const express = require("express");
const log = require("npmlog");

export function getPort() {
  return process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;
}

export default function server(port) {
  return new Promise(resolve => {
    const app = express();
    const PORT = getPort();

    app.listen(PORT, () => {
      log.info(`Started mockserver on port ${PORT}`);
      resolve();
    });
  });
}
