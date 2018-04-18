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

    app.listen(port, () => {
      log.info("server", `Started mockserver on port ${port}`);
      resolve();
    });
  });
}
