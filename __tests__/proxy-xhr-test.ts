jest.unmock("node-fetch");
jest.unmock("express");

import fetch from "node-fetch";
import express from "express";
import bodyparser from "body-parser";

function createServer() {
  return new Promise(resolve => {
    const app = express();
    app.use(bodyparser.json());

    const server = app.listen(4241, () => {
      resolve({ app, server });
    });
  });
}

function xhr(options = {}) {
  return fetch("http://localhost:1111", {
    ...options,
    headers: {
      ...options.headers,
      "content-type": "application/json"
    }
  });
}

describe("Proxy - XHR", () => {
  let s;

  beforeEach(async () => {
    s = await createServer();
  });

  afterEach(() => {
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

    it("forwards the request", async () => {
      await xhr();

      expect(mockMiddleware).toHaveBeenCalled();
    });

    it("forwards the headers", async () => {
      await xhr({ headers: { "my-header": "is-awesome" } });

      const call = mockMiddleware.mock.calls[0][0];
      expect(call.headers["my-header"]).toBe("is-awesome");
    });

    it("forwards the method", async () => {
      await xhr({ method: "POST" });

      const call = mockMiddleware.mock.calls[0][0];
      expect(call.method).toBe("POST");
    });

    it("forwards the body", async () => {
      await xhr({ method: "POST", body: JSON.stringify({ foo: "bar" }) });

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
      const response = await xhr();
      expect(response.headers.get("x-b3-span-id")).toBe("my-tracing");
    });

    it("forwards the status code", async () => {
      const response = await xhr();
      expect(response.status).toBe(201);
    });

    it("forwards the body", async () => {
      const response = await xhr().then(res => res.json());
      expect(response.done).toBe(true);
    });
  });
});
