#!/usr/bin/env node
import log from "npmlog";

import server from "./server";
import getConfig from "./config";
import { discoverMocks } from "./mocks";

let config;
let mocks;

try {
  config = getConfig();
  mocks = discoverMocks(config.mockSearchExpression);
  if (mocks.length === 0) {
    log.warn("mocks", `Found ${mocks.length} mocks.`);
  } else {
    log.info("mocks", `Found ${mocks.length} mocks.`);
  }
} catch (e) {
  log.error("setup", e.message);
  process.exit(1);
}

try {
  server({ ...config, mocks });
} catch (e) {
  log.error("run", e.message);
  process.exit(1);
}
