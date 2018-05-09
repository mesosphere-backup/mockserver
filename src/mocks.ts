import { resolve } from "path";
import { sync as syncGlob } from "glob";
import { IMock } from "./types";

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

export function discoverMocks(globString: string): IMock[] {
  return syncGlob(globString)
    .map(file =>
      validateMock(file, require(resolve(process.cwd(), file)).mocks)
    )
    .reduce((carry, item) => carry.concat(item), []);
}
