import log from "npmlog";

import server from "./server";
import getConfig from "./config";

let config;

try {
  config = getConfig();
} catch (e) {
  log.error("setup", e.message);
  process.exit(1);
}

try {
  server(config);
} catch (e) {
  log.error("run", e.message);
  process.exit(1);
}
