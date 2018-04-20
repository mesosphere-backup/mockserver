import express from "express";
import { createProxyServer } from "http-proxy";
import server from "../server";

const mockExpressApp = express();

describe("Server", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("API", () => {
    it("resolves a promise once it initializes", async () => {
      await server(3223, "google.com:80");
      expect(mockExpressApp.use).toHaveBeenCalled();
      expect(mockExpressApp.listen).toHaveBeenCalledWith(
        3223,
        expect.any(Function)
      );
    });
  });

  describe("Proxy", () => {
    it("uses http-proxy's web method", async () => {
      await server(3223, "google.com:80");
      expect(createProxyServer).toHaveBeenCalled();
      const mockProxy = createProxyServer();
      const app = express();
      app.use.mock.calls[0][0]({ request: true }, { response: true });
      expect(mockProxy.web).toHaveBeenCalled();
    });

    it("uses http-proxy's ws method", async () => {
      await server(3223, "google.com:80");
      expect(createProxyServer).toHaveBeenCalled();
      const mockProxy = createProxyServer();
      const app = express();
      const listener = app.listen(80);

      expect(listener.on.mock.calls[0][0]).toBe("upgrade");
      listener.on.mock.calls[0][1](
        { request: true },
        { socket: true },
        { head: true }
      );
      expect(mockProxy.ws).toHaveBeenCalled();
    });
  });
});
