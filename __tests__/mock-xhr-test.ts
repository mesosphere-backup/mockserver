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

describe("Mock - XHR", () => {
  let s;
  let msPort;
  let msController;

  beforeEach(async () => {
    s = await createServer();
    msController = new MockServerController(s.port, "./**/mock-xhr-mocks.js");
    msPort = await msController.start();
  });

  afterEach(() => {
    msController.stop();
    s.server.close();
  });

  describe("request handling", () => {
    it("switches mock depending on cookie", async () => {
      const responseA = await xhr(msPort, {
        headers: { cookie: `MockserverID=switch-mock-A` }
      }).then(response => response.text());
      const responseB = await xhr(msPort, {
        headers: { cookie: `MockserverID=switch-mock-B` }
      }).then(response => response.text());

      expect(responseA).toBe("A");
      expect(responseB).toBe("B");
    });

    it("passes through given header to mock", async () => {
      const response = await xhr(msPort, {
        headers: {
          cookie: `MockserverID=header-mock`,
          specialHeader: "my-header"
        }
      }).then(res => res.text());

      expect(response).toBe("my-header");
    });

    it("passes through given body to mock", async () => {
      const response = await xhr(msPort, {
        headers: { cookie: `MockserverID=body-mock` },
        method: "POST",
        body: "my-body"
      }).then(res => res.text());

      expect(response).toBe("my-body");
    });
  });

  describe("Deliver different content types", () => {
    it("delivers text based content (JSON)", async () => {
      const response = await xhr(msPort, {
        headers: { cookie: `MockserverID=json-mock` }
      }).then(res => res.json());

      expect(response.key).toBe("myValue");
    });

    it("delivers text based content (XML)", async () => {
      const response = await xhr(msPort, {
        headers: { cookie: `MockserverID=xml-mock` }
      }).then(res => res.text());

      expect(response).toBe("<mock><id>42</id></mock>");
    });

    it("delivers binary content", async () => {
      const response = await xhr(msPort, {
        headers: { cookie: `MockserverID=binary-mock` }
      }).then(res => res.text());

      expect(response).toBe("my-binary-string");
    });
  });
});
