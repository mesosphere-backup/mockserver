const express = require("express");
const log = require("npmlog");

export function getPort(): number {
  return process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;
}

export default function server(port?: number) {
  return new Promise(resolve => {
    const app = express();
    const PORT = port || getPort();

    app.listen(PORT, () => {
      log.info(`Started mockserver on port ${PORT}`);
      resolve();
    });
  });
}
