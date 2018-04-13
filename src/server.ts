import express from "express";
import log from "npmlog";
import { getPort } from "./config";

export default function server(port?: number): Promise<null> {
  return new Promise(resolve => {
    const app = express();
    const PORT = port || getPort();

    app.listen(PORT, () => {
      log.info(`Started mockserver on port ${PORT}`);
      resolve();
    });
  });
}
