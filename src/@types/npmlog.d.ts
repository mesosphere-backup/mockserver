declare module "npmlog" {
  export function error(prefix: string, message: string): void;
  export function warn(prefix: string, message: string): void;
  export function verbose(prefix: string, message: string): void;
  export function info(prefix: string, message: string): void;
}
