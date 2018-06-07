import express from "express";
import cookieParser from "cookie-parser";
import log from "npmlog";
import { createProxyServer } from "http-proxy";
import { IServerConfig } from "./types";
import { AddressInfo } from "net";

export { getMockForJSON } from "./mocks";

export interface IServerHandle {
  close: () => Promise<void>;
  port: number;
}

export default function server({
  port,
  proxyHost,
  proxyPort,
  mocks
}: IServerConfig): Promise<IServerHandle> {
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
      // If 0 is passed as a port express picks a random port thus we need to
      // get the "actual" port and report it back.  Casting `address()` return
      // to `AddressInfo` as we're not listening on a pipe or UNIX domain socket
      // thus it always return the resp. object. For details pleas see:
      // https://nodejs.org/docs/latest-v10.x/api/net.html#net_server_address
      const actualPort = (listener.address() as AddressInfo).port;

      log.info("server", `Started mockserver on port ${actualPort}`);
      resolve({
        port: actualPort,
        close: async () => {
          await listener.close();
        }
      });
    });

    listener.on("upgrade", (req, socket, head) => {
      proxy.ws(req, socket, head);
    });
  });
}
