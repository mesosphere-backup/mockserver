import { resolve } from "path";
import { sync as syncGlob } from "glob";
import { IMock } from "./types";
import { Request, RequestHandler, Response } from "express";

function validateMock(file: string, mocks: any): IMock[] {
  if (!(mocks instanceof Array)) {
    throw new Error(`You missed to export mocks in ${file}, please provide at least this default case:
export const mocks = [];`);
  }

  mocks.forEach((mock: any, index: number) => {
    if (!mock.id || typeof mock.id !== "string") {
      throw new Error(
        `The mock export at index ${index} at ${file} does not include a valid id: ${JSON.stringify(
          mock
        )}`
      );
    }

    if (!mock.request || typeof mock.request !== "function") {
      throw new Error(
        `The mock export at index ${index} at ${file} does not include a valid request: ${JSON.stringify(
          mock
        )}`
      );
    }
  });

  return mocks as IMock[];
}

export function getMockForJSON(json: string | {}): RequestHandler {
  if (!json) {
    throw new Error("JSON argument is missing!");
  }

  const jsonString = JSON.stringify(
    typeof json === "string" ? JSON.parse(json) : json
  );

  return (_req: Request, res: Response) => {
    res.setHeader("Content-Type", "Application/json");
    res.send(jsonString);
  };
}

export function discoverMocks(globString: string): IMock[] {
  // @ts-ignore
  // tslint:disable-next-line:no-empty
  global.describe = () => {};

  return syncGlob(globString)
    .map(file => {
      try {
        return validateMock(file, require(resolve(process.cwd(), file)).mocks);
      } catch (e) {
        return [];
      }
    })
    .reduce((carry, item) => carry.concat(item), []);
}
