import express from "express";
import log from "npmlog";

export default function server(port: number): Promise<null> {
  return new Promise(resolve => {
    const app = express();

    app.listen(port, () => {
      log.info(`Started mockserver on port ${port}`);
      resolve();
    });
  });
}
