import WebSocket from "ws";

import createServer from "./helpers/createServer";
import MockServerController from "./helpers/mockServerController";

const generalDelay = 10;

interface IWebsocketOptions {
  openCallback?: (evt: Event) => void;
}
function openWSConnection(
  port,
  options: IWebsocketOptions = {}
): Promise<WebSocket> {
  return new Promise(resolve => {
    const ws = new WebSocket(`ws://localhost:${port}`);
    ws.on("open", evt => {
      if (options.openCallback) {
        options.openCallback(evt);
      }
      resolve(ws);
    });
  });
}

function wait(timeout = 10) {
  return new Promise(resolve => {
    setTimeout(resolve, timeout);
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

  describe("Requests", () => {
    it("opens a connection", async () => {
      const mockConnection = jest.fn();
      s.wss.on("connection", mockConnection);

      const ws = await openWSConnection(msPort);
      expect(mockConnection).toHaveBeenCalled();
      ws.close();
    });

    it("closes a connection", async () => {
      const mockClose = jest.fn();
      s.wss.on("connection", (ws: WebSocket) => {
        ws.on("close", mockClose);
      });

      const wsClient = await openWSConnection(msPort);
      wsClient.close();
      await wait();
      expect(mockClose).toHaveBeenCalled();
    });

    it("sends data", async () => {
      const mockData = jest.fn();
      s.wss.on("connection", (ws: WebSocket) => {
        ws.on("message", mockData);
      });

      const wsClient = await openWSConnection(msPort);
      wsClient.send("my-data");
      await wait();
      expect(mockData).toHaveBeenCalledWith("my-data");
    });

    it("sends data with similar timing", async () => {
      const mockData = jest.fn();
      s.wss.on("connection", (ws: WebSocket) => {
        ws.on("message", () => mockData(new Date()));
      });

      const wsClient = await openWSConnection(msPort);
      wsClient.send("my-data");
      await new Promise(resolve =>
        setTimeout(() => {
          wsClient.send("other-data");
          resolve();
        }, 120)
      );

      await wait();
      expect(mockData).toHaveBeenCalledTimes(2);
      const callTimeFirst = mockData.mock.calls[0][0];
      const callTimeSecond = mockData.mock.calls[1][0];
      expect(callTimeSecond - callTimeFirst).toBeGreaterThanOrEqual(120);
    });
  });

  describe("Response", () => {
    it("opens a connection", async () => {
      const mockOpen = jest.fn();
      s.wss.on("connection", (ws: WebSocket) => jest.fn());
      const wsClient = await openWSConnection(msPort, {
        openCallback: mockOpen
      });

      expect(mockOpen).toHaveBeenCalled();
    });

    it("closes a connection", async () => {
      const mockClose = jest.fn();
      s.wss.on("connection", async (ws: WebSocket) => {
        ws.close();
      });

      const wsClient = await openWSConnection(msPort);
      wsClient.onclose = mockClose;

      await wait();
      expect(mockClose).toHaveBeenCalled();
    });

    it("receives data", async () => {
      const mockMessage = jest.fn();
      s.wss.on("connection", async (ws: WebSocket) => {
        setTimeout(() => {
          ws.send("datas");
        }, 10);
      });

      const wsClient = await openWSConnection(msPort);
      wsClient.onmessage = mockMessage;

      await wait(20);
      expect(mockMessage).toHaveBeenCalled();
      const call = mockMessage.mock.calls[0][0];
      expect(call.data).toBe("datas");
    });

    it("receives data with similar timing", async () => {
      const mockMessage = jest.fn();
      s.wss.on("connection", async (ws: WebSocket) => {
        setTimeout(() => {
          ws.send(+new Date());
        }, 10);
        setTimeout(() => {
          ws.send(+new Date());
        }, 100);
      });

      const wsClient = await openWSConnection(msPort);
      wsClient.onmessage = mockMessage;

      await wait(110);
      expect(mockMessage).toHaveBeenCalledTimes(2);
      const call1 = parseInt(mockMessage.mock.calls[0][0].data, 10);
      const call2 = parseInt(mockMessage.mock.calls[1][0].data, 10);
      expect(call2 - call1).toBeGreaterThanOrEqual(90 - generalDelay);
    });
  });
});
