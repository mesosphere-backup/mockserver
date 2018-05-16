jest.unmock("node-fetch");

import fetch from "node-fetch";
import IntegrationTestEnvironment from "./helpers/integrationTestEnvironment";

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
  let env;

  beforeEach(async () => {
    env = new IntegrationTestEnvironment();
    await env.setup();
  });

  afterEach(async () => {
    await env.teardown();
  });

  describe("Requests", () => {
    let mockMiddleware;
    beforeEach(() => {
      mockMiddleware = jest.fn();
      env.proxyTargetApp.use((req, res) => {
        mockMiddleware(req);
        res.json({ done: true });
      });
    });

    it("forwards the request", async () => {
      await xhr(env.port);

      expect(mockMiddleware).toHaveBeenCalled();
    });

    it("forwards the headers", async () => {
      await xhr(env.port, { headers: { "my-header": "is-awesome" } });

      const call = mockMiddleware.mock.calls[0][0];
      expect(call.headers["my-header"]).toBe("is-awesome");
    });

    it("forwards the method", async () => {
      await xhr(env.port, { method: "POST" });

      const call = mockMiddleware.mock.calls[0][0];
      expect(call.method).toBe("POST");
    });

    it("forwards the body", async () => {
      await xhr(env.port, {
        method: "POST",
        body: JSON.stringify({ foo: "bar" })
      });

      const call = mockMiddleware.mock.calls[0][0];
      expect(call.body.foo).toBe("bar");
    });
  });

  describe("Response", () => {
    beforeEach(() => {
      env.proxyTargetApp.use((req, res) => {
        res.set("x-b3-span-id", "my-tracing");
        res.status(201);
        res.json({ done: true });
      });
    });

    it("forwards the headers", async () => {
      const response = await xhr(env.port);
      expect(response.headers.get("x-b3-span-id")).toBe("my-tracing");
    });

    it("forwards the status code", async () => {
      const response = await xhr(env.port);
      expect(response.status).toBe(201);
    });

    it("forwards the body", async () => {
      const response = await xhr(env.port).then(res => res.json());
      expect(response.done).toBe(true);
    });
  });
});
