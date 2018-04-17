import log from "npmlog";

import server from "./server";
import { getPort, getProxyHostPort } from "./config";

try {
  const hostPort = getProxyHostPort();
  server(getPort(), hostPort);
} catch (e) {
  log.error(e.message);
}
