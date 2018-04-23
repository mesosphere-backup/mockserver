jest.unmock("express");
jest.unmock("body-parser");

import express from "express";
import bodyparser from "body-parser";

export default function createServer() {
  return new Promise(resolve => {
    const app = express();
    app.use(bodyparser.json());

    const server = app.listen(() => {
      const port = server.address().port;
      resolve({ app, server, port });
    });
  });
}
