import express from "express";
import log from "npmlog";
import { createProxyServer } from "http-proxy";

export interface IServerConfig {
  port: number;
  proxyHost: string;
  proxyPort: number;
}

export default function server({
  port,
  proxyHost,
  proxyPort
}: IServerConfig): Promise<null> {
  return new Promise(resolve => {
    const app = express();

    const proxy = createProxyServer({
      target: {
        host: proxyHost,
        port: `${proxyPort}`
      },
      ws: true
    });

    app.use((req, res) => {
      proxy.web(req, res);
    });

    const listener = app.listen(port, () => {
      // If 0 is passed as a port express searches a port for you
      const actualPort = listener.address().port;
      log.info("server", `Started mockserver on port ${actualPort}`);
      resolve();
    });

    listener.on("upgrade", (req, socket, head) => {
      proxy.ws(req, socket, head);
    });
  });
}
