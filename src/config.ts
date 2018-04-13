export function getPort(): number {
  return process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;
}
