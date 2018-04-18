const { spawn } = require("child_process");

module.exports = function setup() {
  return new Promise(resolve => {
    const server = spawn("npm", ["start"], {
      shell: true,
      cwd: process.cwd(),
      env: {
        PATH: process.env.PATH,
        PROXY_HOST_PORT: "localhost:4241",
        PORT: "1111"
      }
    });

    server.on("error", err => {
      console.error("npm start had an error:", error);
    });

    server.stdout.on("data", data => {
      // wait for the start command
      if (String(data).includes("node dist/index.js")) {
        resolve();
      }
    });
    this.global.__mockserver = server;
  });
};
