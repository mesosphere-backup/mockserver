import { getPort } from "../server";

describe("Server", () => {
  describe("#getPort", () => {
    it("returns a default port if no port is configured", () => {
      expect(getPort()).toBe(3000);
    });

    it("returns the configured port", () => {
      process.env.PORT = 4002;
      expect(getPort()).toBe(4002);
      process.env.PORT = null;
    });
  });
});