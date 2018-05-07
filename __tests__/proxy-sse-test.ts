jest.unmock("eventsource");

import EventSource from "eventsource";
import createServer from "./helpers/createServer";
import MockServerController from "./helpers/mockServerController";

interface IEventListener {
  cb: (evt: MessageEvent) => void;
  type: string;
}
interface ICallbacks {
  onmessage?: (evt: MessageEvent, resolve: (...any) => void) => void;
  onerror?: (evt: MessageEvent, resolve: (...any) => void) => void;
  eventListeners?: IEventListener[];
}

function sse(
  port: number,
  callbacks: ICallbacks = {},
  options: object = {}
): Promise<any> {
  return new Promise(resolve => {
    const source = new EventSource(`http://localhost:${port}`, options);

    if (callbacks.onmessage) {
      source.onmessage = evt => {
        callbacks.onmessage(evt, resolve);
      };
    } else if (callbacks.onerror) {
      source.onerror = evt => {
        callbacks.onerror(evt, resolve);
      };
    } else {
      source.onopen = () => resolve(source);
    }

    (callbacks.eventListeners || []).forEach(({ type, cb }) =>
      source.addEventListener(type, cb)
    );
  });
}

describe("Proxy - Server Sent Events", () => {
  let s;
  let msController;
  let msPort;

  beforeEach(async () => {
    s = await createServer();
    msController = new MockServerController(s.port);
    msPort = await msController.start();

    s.app.use((req, res, next) => {
      res.writeHead(200, {
        "Content-Type": "text/event-stream",
        "Cache-Control": "no-cache",
        Connection: "keep-alive"
      });

      res.sseSendUntyped = data => {
        res.write("data: " + JSON.stringify(data) + "\n\n");
      };

      res.sseSendTyped = (type, data) => {
        res.write("event: " + type + "\n");
        res.write("data: " + JSON.stringify(data) + "\n\n");
      };

      next();
    });
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
        res.sseSendUntyped({ done: true });
        res.end();
      });
    });

    it("opens a connection", async () => {
      const source = await sse(msPort);

      source.close();
      expect(mockMiddleware).toHaveBeenCalled();
    });

    it("sends the headers", async () => {
      const source = await sse(msPort, {}, { headers: { "my-header": "foo" } });

      source.close();
      const call = mockMiddleware.mock.calls[0][0];
      expect(call.headers["my-header"]).toBe("foo");
    });
  });

  describe("Response", () => {
    it("forwards data", async () => {
      s.app.use((req, res) => {
        res.sseSendUntyped({ count: 1 });
        res.sseSendUntyped({ count: 2 });
        res.end();
      });

      const mockOnMessage = jest.fn();
      let callCount = 0;
      await sse(msPort, {
        onmessage: (evt, resolve) => {
          callCount++;
          mockOnMessage();
          if (callCount === 2) {
            resolve();
          }
        }
      });
      expect(mockOnMessage).toHaveBeenCalledTimes(2);
    });

    it("forwards data with a similar interval", async () => {
      s.app.use((req, res) => {
        res.sseSendUntyped({ count: 1 });
        setTimeout(() => {
          res.sseSendUntyped({ count: 2 });
          res.end();
        }, 800);
      });

      const mockOnMessage = jest.fn();
      await sse(msPort, {
        onmessage: (evt, resolve) => {
          mockOnMessage(evt);
          resolve();
        }
      });

      expect(mockOnMessage).toHaveBeenCalledTimes(1);
    });

    it("forwards data in the same order", async () => {
      s.app.use((req, res) => {
        res.sseSendUntyped({ count: 1 });
        res.sseSendUntyped({ count: 2 });
        res.end();
      });

      const mockOnMessage = jest.fn();
      let callCount = 0;
      await sse(msPort, {
        onmessage: (evt, resolve) => {
          callCount++;
          mockOnMessage(JSON.parse(evt.data).count);
          if (callCount === 2) {
            resolve();
          }
        }
      });

      expect(mockOnMessage).toHaveBeenCalledTimes(2);
      expect(mockOnMessage.mock.calls[0][0]).toBe(1);
      expect(mockOnMessage.mock.calls[1][0]).toBe(2);
    });

    it("forwards untyped data events", async () => {
      s.app.use((req, res) => {
        res.sseSendUntyped({ foo: "my-untyped-message" });
        res.end();
      });

      const mockOnMessage = jest.fn();

      const msg = await sse(msPort, {
        onmessage: (evt, resolve) => {
          resolve(JSON.parse(evt.data));
        }
      });

      expect(msg).toEqual({ foo: "my-untyped-message" });
    });

    it("forwards typed data events", async () => {
      s.app.use((req, res) => {
        res.sseSendTyped("typeA", { count: 1 });
        res.sseSendTyped("typeB", { count: 2 });
        res.sseSendUntyped({ end: true });
        res.end();
      });

      const mockTypeA = jest.fn();
      const mockTypeB = jest.fn();
      const mockTypeC = jest.fn();
      await sse(msPort, {
        onmessage: (evt, resolve) => resolve(),
        eventListeners: [
          {
            type: "typeA",
            cb: evt => mockTypeA(evt)
          },
          {
            type: "typeB",
            cb: evt => mockTypeB(evt)
          },
          {
            type: "typeC",
            cb: evt => mockTypeC(evt)
          }
        ]
      });

      expect(mockTypeA).toHaveBeenCalledTimes(1);
      expect(JSON.parse(mockTypeA.mock.calls[0][0].data).count).toBe(1);
      expect(mockTypeB).toHaveBeenCalledTimes(1);
      expect(JSON.parse(mockTypeB.mock.calls[0][0].data).count).toBe(2);
      expect(mockTypeC).not.toHaveBeenCalled();
    });

    it("invokes error callback if no event is sent", async () => {
      s.app.use((req, res) => {
        res.end();
      });

      const error = await sse(msPort, {
        onerror: (evt, resolve) => resolve(evt)
      });

      expect(error.type).toBe("error");
    });
  });
});
