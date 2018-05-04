const { spawn } = require("child_process");

interface IExpressServer {
  kill: () => void;
}

export default class MockServerController {
  private targetPort: number;
  private mockSearchExpression: string;
  private server: IExpressServer;

  constructor(port: number, mockSearchExpression?: string) {
    this.mockSearchExpression = mockSearchExpression || "./non-existant-folder";
    this.targetPort = port;
  }

  public async start() {
    return new Promise(async (resolve, reject) => {
      // This relies on the build to be run before
      const server = spawn("node", ["dist/index.js"], {
        shell: true,
        cwd: process.cwd(),
        env: {
          PATH: process.env.PATH,
          PROXY_HOST_PORT: `localhost:${this.targetPort}`,
          PORT: "0",
          MOCK_SEARCH_EXPRESSION: this.mockSearchExpression
        }
      });

      server.on("error", err => {
        reject(err);
      });

      const awaitServerStart = data => {
        const str = String(data);

        // wait for the start command
        if (str.includes("Started mockserver on port")) {
          const port = parseInt(
            str.split("Started mockserver on port")[1].match(/\d+/)[0],
            10
          );
          resolve(port);
        }
      };

      server.stdout.on("data", awaitServerStart);
      server.stderr.on("data", awaitServerStart);

      // tslint:disable-next-line
      server.stderr.on("data", data => console.error(String(data)));
      this.server = server;
    });
  }

  public stop() {
    this.server.kill();
  }
}
