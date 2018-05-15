jest.unmock("node-fetch");

import fetch from "node-fetch";
import createServer from "./helpers/createServer";
import MockServerController from "./helpers/mockServerController";

function xhr(port, options = {}) {
  return fetch(`http://localhost:${port}`, {
    ...options,
    headers: {
      ...options.headers,
      "content-type": "application/json"
    }
  });
}

describe("Proxy - XHR", () => {
  let s;
  let msPort;
  let msController;

  beforeEach(async () => {
    s = await createServer();
    msController = new MockServerController(s.port);
    msPort = await msController.start();
  });

  afterEach(async () => {
    await msController.stop();
    s.server.close();
  });

  describe("Requests", () => {
    let mockMiddleware;
    beforeEach(() => {
      mockMiddleware = jest.fn();
      s.app.use((req, res) => {
        mockMiddleware(req);
        res.json({ done: true });
      });
    });

    it.only("forwards the request", async () => {
      await xhr(msPort);

      expect(mockMiddleware).toHaveBeenCalled();
    });

    it("forwards the headers", async () => {
      await xhr(msPort, { headers: { "my-header": "is-awesome" } });

      const call = mockMiddleware.mock.calls[0][0];
      expect(call.headers["my-header"]).toBe("is-awesome");
    });

    it("forwards the method", async () => {
      await xhr(msPort, { method: "POST" });

      const call = mockMiddleware.mock.calls[0][0];
      expect(call.method).toBe("POST");
    });

    it("forwards the body", async () => {
      await xhr(msPort, {
        method: "POST",
        body: JSON.stringify({ foo: "bar" })
      });

      const call = mockMiddleware.mock.calls[0][0];
      expect(call.body.foo).toBe("bar");
    });
  });

  describe("Response", () => {
    beforeEach(() => {
      s.app.use((req, res) => {
        res.set("x-b3-span-id", "my-tracing");
        res.status(201);
        res.json({ done: true });
      });
    });

    it("forwards the headers", async () => {
      const response = await xhr(msPort);
      expect(response.headers.get("x-b3-span-id")).toBe("my-tracing");
    });

    it("forwards the status code", async () => {
      const response = await xhr(msPort);
      expect(response.status).toBe(201);
    });

    it("forwards the body", async () => {
      const response = await xhr(msPort).then(res => res.json());
      expect(response.done).toBe(true);
    });
  });
});
