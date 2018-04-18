import log from "npmlog";

import server from "./server";
import { getPort, getProxyHostPort } from "./config";

let hostPort;
let port;

try {
  hostPort = getProxyHostPort();
  port = getPort();
} catch (e) {
  log.error("setup", e.message);
  process.exit(1);
}

try {
  server(port, hostPort);
} catch (e) {
  log.error("run", e.message);
  process.exit(1);
}
