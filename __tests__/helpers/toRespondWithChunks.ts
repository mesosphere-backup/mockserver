import { ClientRequest, IncomingMessage } from "http";

/**
 * This matcher compares the received chunks with the provided ones.
 * It wraps the provided values using `Buffer.from` so that there's no need
 * to do so in the tests. The matcher will exit and close the connection
 * as soon as the condition match or fail.
 *
 * Please note that this is an async matcher thus the tests to be async as well.
 */
export default function toRespondWithChunks(
  req: ClientRequest,
  chunks: Array<Buffer | string | any[]>
) {
  return new Promise((resolve, reject) => {
    req.on("response", (response: IncomingMessage) => {
      let i = 0;

      response.on("end", () => {
        if (i === chunks.length) {
          resolve({
            message: () => `expected the chunks to not match  ${chunks}`,
            pass: true
          });
        }

        reject({
          message: `received ${i} of the expected ${chunks.length} chunks`,
          pass: false
        });
      });
      response.on("data", (chunk: Buffer) => {
        const expected = Buffer.from(chunks[i++]);

        if (!expected.equals(chunk)) {
          req.abort();

          reject({
            message: `expected ${chunk} in stream to match ${expected}`,
            pass: false
          });
        } else if (i === chunks.length) {
          req.abort();

          resolve({
            message: () => `expected the chunks to not match  ${chunks}`,
            pass: true
          });
        }
      });
    });
  });
}
