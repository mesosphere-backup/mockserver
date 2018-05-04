import express from "express";
import cookieParser from "cookie-parser";
import log from "npmlog";
import { createProxyServer } from "http-proxy";
import { IServerConfig } from "./types";

export default function server({
  port,
  proxyHost,
  proxyPort,
  mocks
}: IServerConfig): Promise<null> {
  return new Promise(resolve => {
    const app = express();
    app.use(cookieParser());

    const proxy = createProxyServer({
      target: {
        host: proxyHost,
        port: `${proxyPort}`
      },
      ws: true
    });

    app.use((req, res, next) => {
      if (
        req.cookies.MockserverID &&
        mocks.find(mock => mock.id === req.cookies.MockserverID)
      ) {
        res.locals.mock = mocks.find(
          mock => mock.id === req.cookies.MockserverID
        );
        next();
      } else {
        // Proxy what we can't mock
        proxy.web(req, res);
      }
    });

    app.use((req, res, next) => {
      let data = "";
      req.on("data", chunk => (data += chunk));
      req.on("end", () => {
        res.locals.rawBody = data;
        next();
      });
    });

    app.use((req, res, next) => {
      res.locals.mock.request(req, res);
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
