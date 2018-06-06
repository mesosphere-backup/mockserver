import { ClientRequest, request } from "http";
import IntegrationTestEnvironment from "./integrationTestEnvironment";

export enum Method {
  GET = "GET",
  POST = "POST"
}

export default function requestMock(
  env: IntegrationTestEnvironment,
  mockID: string,
  method: Method = Method.GET,
  body: Buffer | string | any[] = "",
  contentType: string = "application/json"
): ClientRequest {
  const req = request({
    port: env.port,
    hostname: "localhost",
    method,
    headers: {
      Cookie: `MockserverID=${mockID}`,
      "Content-Type": contentType
    }
  });

  if (method === "POST") {
    const buffer = Buffer.from(body);

    req.setHeader("Content-Length", Buffer.byteLength(buffer));
    req.write(buffer);
  }

  req.end();
  return req;
}
