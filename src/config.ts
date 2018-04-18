import log from "npmlog";

export function getPort(): number {
  return process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;
}

export function getProxyHostPort(): string {
  const proxyHostPort = process.env.PROXY_HOST_PORT;

  if (!proxyHostPort) {
    throw new Error(
      `mockserver needs the PROXY_HOST_PORT environment variable to be set.
It is used to determine where to send the requests no mock matches against to.
E.g. PROXY_HOST_PORT='my-service.com:2342'`
    );
  }

  if (proxyHostPort.includes("http")) {
    throw new Error("Please remove the protocol from your PROXY_HOST_PORT");
  }

  if (!proxyHostPort.includes(":")) {
    log.warn(
      "setup",
      "Your PROXY_HOST_PORT has no port configured, will default to 80"
    );
    return proxyHostPort + ":80";
  }

  return proxyHostPort;
}
