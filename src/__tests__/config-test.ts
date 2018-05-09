import log from "npmlog";
import getConfig, {
  getPort,
  getProxyHostPort,
  getProxyHost,
  getProxyPort,
  getMockSearchExpression
} from "../config";

describe("Config", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("#getPort", () => {
    it("returns a default port if no port is configured", () => {
      expect(getPort()).toBe(3000);
    });

    it("returns the configured port", () => {
      process.env.PORT = "4002";
      expect(getPort()).toBe(4002);
      process.env.PORT = undefined;
    });
  });

  describe("#getProxyHostPort", () => {
    afterEach(() => {
      delete process.env.PROXY_HOST_PORT;
    });

    it("returns a string if set correctly", () => {
      process.env.PROXY_HOST_PORT = "my-application.com:4310";
      const hostPort = getProxyHostPort();
      expect(hostPort).toBe("my-application.com:4310");
    });

    it("throws an error if nothing is passed as environment variable", () => {
      expect(() => {
        getProxyHostPort();
      }).toThrowErrorMatchingSnapshot();
    });

    it("throws an error if the protocol is included in the environment variable", () => {
      process.env.PROXY_HOST_PORT = "http://my-application.com:4310";
      expect(() => {
        getProxyHostPort();
      }).toThrowErrorMatchingSnapshot();
    });

    it("shows a warning if no port is configured", () => {
      process.env.PROXY_HOST_PORT = "my-application.com";
      const hostPort = getProxyHostPort();
      expect(hostPort).toBe("my-application.com:80");
      expect(log.warn).toHaveBeenCalled();
    });
  });

  describe("#getProxyHost", () => {
    it("extracts the proxy host", () => {
      expect(getProxyHost("google.de:80")).toBe("google.de");
    });
  });

  describe("#getProxyPort", () => {
    it("extracts the proxy port", () => {
      expect(getProxyPort("google.de:80")).toBe(80);
    });
  });

  describe("#getMockSearchExpression", () => {
    afterEach(() => {
      delete process.env.MOCK_SEARCH_EXPRESSION;
    });

    it("fails without the environment variable", () => {
      expect(() => {
        getMockSearchExpression();
      }).toThrowErrorMatchingSnapshot();
    });

    it("returns the expression", () => {
      const expr = "./**/*-spec.js";
      process.env.MOCK_SEARCH_EXPRESSION = expr;

      expect(getMockSearchExpression()).toBe(expr);
    });
  });

  describe("#getConfig", () => {
    it("returns a complete configuration", () => {
      process.env.MOCK_SEARCH_EXPRESSION = "./**/__tests__/*-spec.js";
      process.env.PROXY_HOST_PORT = "my-application.com:1234";
      process.env.PORT = "4002";

      expect(getConfig()).toEqual({
        port: 4002,
        proxyPort: 1234,
        proxyHost: "my-application.com",
        mockSearchExpression: "./**/__tests__/*-spec.js"
      });

      process.env.PORT = undefined;
    });
  });
});
