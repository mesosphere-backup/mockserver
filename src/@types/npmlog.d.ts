// Type definitions for npmlog 4.1
// Project: https://github.com/npm/npmlog#readme
// Definitions by: Daniel Schmidt <https://github.com/DanielMSchmidt>
// Definitions: https://github.com/DefinitelyTyped/DefinitelyTyped

declare enum LogLevels {
  silly = "silly",
  verbose = "verbose",
  info = "info",
  http = "http",
  warn = "warn",
  error = "error"
}

interface IStyleObject {
  fg?: string;
  bg?: string;
  bold?: boolean;
  inverse?: boolean;
  underline?: boolean;
  bell?: boolean;
}

interface IMessageObject {
  id: number;
  level: string;
  prefix: string;
  message: string;
  messageRaw: string;
}

declare module "npmlog" {
  export function log(
    level: LogLevels | string,
    prefix: string,
    message: string,
    ...args: any[]
  ): void;

  export function silly(prefix: string, message: string, ...args: any[]): void;
  export function verbose(
    prefix: string,
    message: string,
    ...args: any[]
  ): void;
  export function info(prefix: string, message: string, ...args: any[]): void;
  export function http(prefix: string, message: string, ...args: any[]): void;
  export function warn(prefix: string, message: string, ...args: any[]): void;
  export function error(prefix: string, message: string, ...args: any[]): void;

  export let level: string;
  export let record: IMessageObject[];
  export let maxRecordSize: number;
  export let prefixStyle: IStyleObject;
  export let headingStyle: IStyleObject;
  export let heading: string;
  export let stream: any; // Defaults to process.stderr

  export function enableColor(): void;
  export function disableColor(): void;

  export function enableProgress(): void;
  export function disableProgress(): void;

  export function enableUnicode(): void;
  export function disableUnicode(): void;

  export function pause(): void;
  export function resume(): void;

  export function addLevel(
    level: string,
    n: number,
    style?: IStyleObject,
    disp?: string
  ): void;

  // TODO: newStream, newGroup, setGaugeTemplate and setGaugeTemplateSet need to be added
}
