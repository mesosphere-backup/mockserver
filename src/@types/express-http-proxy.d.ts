interface Options {
  proxyReqPathResolver?: Function;
  filter?: Function;
  userResDecorator?: Function;
  limit?: string;
  memoizeHost?: boolean;
  userResHeaderDecorator?: Function;
  skipToNextHandlerFilter?: Function;
  proxyReqOptDecorator?: Function;
  proxyReqBodyDecorator?: Function;
  https?: boolean;
  preserveHostHdr?: boolean;
  parseReqBody?: boolean;
  reqAsBuffer?: boolean;
  reqBodyEncoding?: boolean;
  timeout?: number;
}
declare function proxy(host: string, options?: Options): any;

declare module "express-http-proxy" {
  export default proxy;
}
