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

describe("Mock - XHR", () => {
  let env;

  beforeEach(async () => {
    env = new IntegrationTestEnvironment("./**/mock-xhr-mocks.js");
    await env.setup();
  });

  afterEach(async () => {
    await env.teardown();
  });

  describe("request handling", () => {
    it("switches mock depending on cookie", async () => {
      const responseA = await xhr(env.port, {
        headers: { cookie: `MockserverID=switch-mock-A` }
      }).then(response => response.text());
      const responseB = await xhr(env.port, {
        headers: { cookie: `MockserverID=switch-mock-B` }
      }).then(response => response.text());

      expect(responseA).toBe("A");
      expect(responseB).toBe("B");
    });

    it("passes through given header to mock", async () => {
      const response = await xhr(env.port, {
        headers: {
          cookie: `MockserverID=header-mock`,
          specialHeader: "my-header"
        }
      }).then(res => res.text());

      expect(response).toBe("my-header");
    });

    it("passes through given body to mock", async () => {
      const response = await xhr(env.port, {
        headers: { cookie: `MockserverID=body-mock` },
        method: "POST",
        body: "my-body"
      }).then(res => res.text());

      expect(response).toBe("my-body");
    });
  });

  describe("Deliver different content types", () => {
    it("delivers text based content (JSON)", async () => {
      const response = await xhr(env.port, {
        headers: { cookie: `MockserverID=json-mock` }
      }).then(res => res.json());

      expect(response.key).toBe("myValue");
    });

    it("delivers text based content (XML)", async () => {
      const response = await xhr(env.port, {
        headers: { cookie: `MockserverID=xml-mock` }
      }).then(res => res.text());

      expect(response).toBe("<mock><id>42</id></mock>");
    });

    it("delivers binary content", async () => {
      const response = await xhr(env.port, {
        headers: { cookie: `MockserverID=binary-mock` }
      }).then(res => res.text());

      expect(response).toBe("my-binary-string");
    });
  });
});
