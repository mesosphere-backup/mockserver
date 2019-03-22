import { discoverMocks, getMockForJSON } from "../mocks";
import { sync } from "glob";
import { resolve } from "path";

jest.mock("glob");
jest.mock("path");

describe("mocks", () => {
  describe("#extractMocks", () => {
    it("returns empty array malformed mock data (missing id)", () => {
      const mockfilename = "1-invalid-mock-without-id";
      sync.mockReturnValue([mockfilename]);
      resolve.mockReturnValue(mockfilename);

      expect(discoverMocks(mockfilename)).toEqual([]);
    });

    it("returns empty array with object given an invalid id", () => {
      const mockfilename = "1-invalid-mock-with-invalid-id";
      sync.mockReturnValue([mockfilename]);
      resolve.mockReturnValue(mockfilename);

      expect(discoverMocks(mockfilename)).toEqual([]);
    });

    it("returns empty array without given mock function", () => {
      const mockfilename = "1-invalid-mock-without-request";
      sync.mockReturnValue([mockfilename]);
      resolve.mockReturnValue(mockfilename);

      expect(discoverMocks(mockfilename)).toEqual([]);
    });

    it("returns empty array with something not a function given as mock", () => {
      const mockfilename = "1-invalid-mock-invalid-request";
      sync.mockReturnValue([mockfilename]);
      resolve.mockReturnValue(mockfilename);

      expect(discoverMocks(mockfilename)).toEqual([]);
    });

    it("returns empty array with mocks not being an array", () => {
      const mockfilename = "1-invalid-mock-not-an-array";
      sync.mockReturnValue([mockfilename]);
      resolve.mockReturnValue(mockfilename);

      expect(discoverMocks(mockfilename)).toEqual([]);
    });

    it("returns something with string given as id", () => {
      const mockfilename = "1-valid-mock";
      sync.mockReturnValue([mockfilename]);
      resolve.mockReturnValue(mockfilename);

      expect(discoverMocks(mockfilename).length).toBeGreaterThan(0);
    });

    it("returns empty array with with empty mocks array", () => {
      const mockfilename = "1-valid-mock-empty-array";
      sync.mockReturnValue([mockfilename]);
      resolve.mockReturnValue(mockfilename);

      expect(discoverMocks(mockfilename)).toEqual([]);
    });
  });

  describe("#getMockForJSON", () => {
    it("throws unless json is provided", () => {
      expect(() => {
        getMockForJSON(null);
      }).toThrow();
    });

    it("throws unless valid json string is provided", () => {
      expect(() => {
        getMockForJSON("foo");
      }).toThrow();
    });

    it("doesn't throw when json is provided", () => {
      expect(() => {
        getMockForJSON({});
      }).not.toThrow();
    });

    it("doesn't throw when valid json string is provided", () => {
      expect(() => {
        getMockForJSON("{}");
      }).not.toThrow();
    });

    it("doesn't throw when json is provided", () => {
      const mockfilename = "1-valid-json-mock";

      sync.mockReturnValue([mockfilename]);
      resolve.mockReturnValue(mockfilename);

      expect(() => {
        discoverMocks(mockfilename);
      }).not.toThrow();
    });
  });
});
