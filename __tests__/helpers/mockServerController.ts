import mockserver, { IServerHandle } from "../../src/server";
import { discoverMocks } from "../../src/mocks";

interface IExpressServer {
  kill: () => void;
}

export default class MockServerController {
  private targetPort: number;
  private handle: IServerHandle;
  private mockSearchExpression: string;

  constructor(port: number, mockSearchExpression = "./unknown-path") {
    this.targetPort = port;
    this.mockSearchExpression = mockSearchExpression;
  }

  public async start() {
    const mocks = discoverMocks(this.mockSearchExpression);

    this.handle = await mockserver({
      port: 0, // auto-select
      proxyHost: "localhost",
      proxyPort: this.targetPort,
      mocks
    });
    return this.handle.port;
  }

  public async stop() {
    await this.handle.close();
  }
}
