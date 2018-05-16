import WebSocket from "ws";

import IntegrationTestEnvironment from "./helpers/integrationTestEnvironment";
import { EINVAL } from "constants";

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
  let env;

  beforeEach(async () => {
    env = new IntegrationTestEnvironment();
    await env.setup();
  });

  afterEach(async () => {
    await env.teardown();
  });

  describe("Requests", () => {
    it("opens a connection", async () => {
      const mockConnection = jest.fn();
      env.proxyTargetWebsocketServer.on("connection", mockConnection);

      const ws = await openWSConnection(env.port);
      expect(mockConnection).toHaveBeenCalled();
      ws.close();
    });

    it("closes a connection", async () => {
      const mockClose = jest.fn();
      env.proxyTargetWebsocketServer.on("connection", (ws: WebSocket) => {
        ws.on("close", mockClose);
      });

      const wsClient = await openWSConnection(env.port);
      wsClient.close();
      await wait();
      expect(mockClose).toHaveBeenCalled();
    });

    it("sends data", async () => {
      const mockData = jest.fn();
      env.proxyTargetWebsocketServer.on("connection", (ws: WebSocket) => {
        ws.on("message", mockData);
      });

      const wsClient = await openWSConnection(env.port);
      wsClient.send("my-data");
      await wait();
      expect(mockData).toHaveBeenCalledWith("my-data");
    });

    it("sends data with similar timing", async () => {
      const mockData = jest.fn();
      env.proxyTargetWebsocketServer.on("connection", (ws: WebSocket) => {
        ws.on("message", () => mockData(new Date()));
      });

      const wsClient = await openWSConnection(env.port);
      wsClient.send("my-data");
      setTimeout(() => {
        wsClient.send("other-data");
      }, 300);

      await wait();
      expect(mockData).toHaveBeenCalledTimes(1);
    });
  });

  describe("Response", () => {
    it("opens a connection", async () => {
      const mockOpen = jest.fn();
      env.proxyTargetWebsocketServer.on("connection", (ws: WebSocket) =>
        jest.fn()
      );
      const wsClient = await openWSConnection(env.port, {
        openCallback: mockOpen
      });

      expect(mockOpen).toHaveBeenCalled();
    });

    it("closes a connection", async () => {
      const mockClose = jest.fn();
      env.proxyTargetWebsocketServer.on("connection", async (ws: WebSocket) => {
        ws.close();
      });

      const wsClient = await openWSConnection(env.port);
      wsClient.onclose = mockClose;

      await wait();
      expect(mockClose).toHaveBeenCalled();
    });

    it("receives data", async () => {
      const mockMessage = jest.fn();
      env.proxyTargetWebsocketServer.on("connection", async (ws: WebSocket) => {
        setTimeout(() => {
          ws.send("datas");
        }, 10);
      });

      const wsClient = await openWSConnection(env.port);
      wsClient.onmessage = mockMessage;

      await wait(20);
      expect(mockMessage).toHaveBeenCalled();
      const call = mockMessage.mock.calls[0][0];
      expect(call.data).toBe("datas");
    });

    it("receives data with similar timing", async () => {
      const mockMessage = jest.fn();
      env.proxyTargetWebsocketServer.on("connection", async (ws: WebSocket) => {
        setTimeout(() => {
          ws.send(+new Date());
        }, 10);
        setTimeout(() => {
          ws.send(+new Date());
        }, 100);
      });

      const wsClient = await openWSConnection(env.port);
      wsClient.onmessage = mockMessage;

      await wait(110);
      expect(mockMessage).toHaveBeenCalledTimes(2);
      const call1 = parseInt(mockMessage.mock.calls[0][0].data, 10);
      const call2 = parseInt(mockMessage.mock.calls[1][0].data, 10);
      expect(call2 - call1).toBeGreaterThanOrEqual(90 - generalDelay);
    });
  });
});
