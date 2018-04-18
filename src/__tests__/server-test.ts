import express from "express";
import expressHTTPProxy from "express-http-proxy";
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
    it("uses express-http-proxy", async () => {
      await server(3223, "google.com:80");
      expect(expressHTTPProxy).toHaveBeenCalled();
    });
  });
});
