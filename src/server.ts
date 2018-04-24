import express from "express";
import log from "npmlog";
import { createProxyServer } from "http-proxy";

export default function server(
  port: number,
  proxyHostPort: string
): Promise<null> {
  return new Promise(resolve => {
    const app = express();
    const proxy = createProxyServer();

    app.use((req, res) => {
      proxy.web(req, res, { target: `http://${proxyHostPort}` });
    });

    const listener = app.listen(port, () => {
      // If 0 is passed as a port express searches a port for you
      const actualPort = listener.address().port;
      log.info("server", `Started mockserver on port ${actualPort}`);
      resolve();
    });
  });
}
