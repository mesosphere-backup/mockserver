jest.unmock("express");
jest.unmock("body-parser");

import bodyparser from "body-parser";
import express from "express";
import http from "http";
import WebSocket from "ws";

interface IServer {
  app: Express.Application;
  server: http.Server;
  port: number;
  wss: WebSocket.Server;
}

export default function createServer(): Promise<IServer> {
  return new Promise(resolve => {
    const server = http.createServer();
    const wss = new WebSocket.Server({ server });

    const app = express();
    app.use(bodyparser.json());
    server.on("request", app);

    const listener = server.listen(() => {
      const port = listener.address().port;
      resolve({ app, server, port, wss });
    });
  });
}
