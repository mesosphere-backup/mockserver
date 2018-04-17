import log from "npmlog";

import server from "./server";
import { getPort, getProxyHostPort } from "./config";
let hostPort;
try {
  hostPort = getProxyHostPort();
} catch (e) {
  log.error("setup", e.message);
  process.exit(1);
}

server(getPort(), hostPort);
