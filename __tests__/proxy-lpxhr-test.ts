// Proxying of long polling XHR requests

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

  afterEach(() => {
    msController.stop();
    s.server.close();
  });

  // Requests are already tested with the xhr tests

  describe("Response", () => {
    beforeEach(() => {
      s.app.use((req, res) => {
        setTimeout(() => {
          res.json({ done: true });
        }, 140);
      });
    });

    it("forwards the result after the timeout", async () => {
      const startTime = +new Date();
      const response = await xhr(msPort).then(res => res.json());
      const endTime = +new Date();
      expect(response.done).toBe(true);
      expect(endTime - startTime).toBeGreaterThanOrEqual(140);
    });
  });
});
