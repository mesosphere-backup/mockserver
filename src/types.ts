export interface IMock {
  id: string;
  request: (req: Request, res: Response) => void;
}

export interface IConfig {
  port: number;
  proxyHost: string;
  proxyPort: number;
}

export interface IServerConfig extends IConfig {
}
