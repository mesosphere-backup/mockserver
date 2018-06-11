import express from "express";
import server from "../server";

const mockExpressApp = express();

describe("Server", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("API", () => {
    it("resolves a promise once it initializes", async () => {
      await server({
        port: 3223,
        proxyHost: "google.com",
        proxyPort: 80,
        mocks: []
      });
      expect(mockExpressApp.use).toHaveBeenCalled();
      expect(mockExpressApp.listen).toHaveBeenCalledWith(
        3223,
        expect.any(Function)
      );
    });
  });
});
