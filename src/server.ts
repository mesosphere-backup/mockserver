import express from "express";
import proxy from "express-http-proxy";
import log from "npmlog";

export default function server(
  port: number,
  proxyHostPort: string
): Promise<null> {
  return new Promise(resolve => {
    const app = express();

    app.use(proxy(proxyHostPort));

    const listener = app.listen(port, () => {
      // If 0 is passed as a port express searches a port for you
      const actualPort = listener.address().port;
      log.info("server", `Started mockserver on port ${actualPort}`);
      resolve();
    });
  });
}
