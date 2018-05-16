import { Request, Response } from "express";

export interface IMock {
  id: string;
  request: (req: Request, res: Response) => void;
}

export interface IConfig {
  port: number;
  proxyHost: string;
  proxyPort: number;
  mockSearchExpression?: string;
}

export interface IServerConfig extends IConfig {
  mocks: IMock[];
}
