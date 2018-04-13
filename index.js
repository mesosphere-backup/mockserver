const express = require("express");
const log = require("npmlog");

const app = express();
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  log.info(`Started mockserver on port ${PORT}`);
});