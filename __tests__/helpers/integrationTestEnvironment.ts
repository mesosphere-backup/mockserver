jest.unmock("express");
jest.unmock("body-parser");
jest.unmock("http");
jest.unmock("ws");

import bodyparser from "body-parser";
import express from "express";
import http from "http";
import WebSocket from "ws";

import mockserver, { IServerHandle } from "../../src/server";
import { discoverMocks } from "../../src/mocks";
import { IMock } from "../../src/types";

export default class IntegrationTestEnvironment {
  private mocks: IMock[];
  private handle: IServerHandle;
  private app: Express.Application;
  private server: http.Server;
  private wss: WebSocket.Server;

  constructor(mockSearchExpression = "./unknown-path") {
    this.mocks = discoverMocks(mockSearchExpression);
  }

  public async setup() {
    let server;
    let app;
    let port;
    let wss;

    // Start a proxy target
    await new Promise(resolve => {
      server = http.createServer();
      wss = new WebSocket.Server({ server });

      app = express();
      app.use(bodyparser.json());
      server.on("request", app);

      const listener = server.listen(() => {
        port = listener.address().port;
        resolve();
      });
    });

    this.server = server;
    this.app = app;
    this.wss = wss;

    this.handle = await mockserver({
      port: 0, // auto-select
      proxyHost: "localhost",
      proxyPort: port,
      mocks: this.mocks
    });
  }

  get port() {
    return this.handle.port;
  }

  get proxyTargetApp() {
    return this.app;
  }

  get proxyTargetWebsocketServer() {
    return this.wss;
  }

  public async teardown() {
    await this.handle.close();
    await this.server.close();
  }
}
