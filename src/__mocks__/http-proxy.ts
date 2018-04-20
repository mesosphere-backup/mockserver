const mockWeb = jest.fn();
const mockWs = jest.fn();

export const createProxyServer = jest.fn(() => ({
  web: mockWeb,
  ws: mockWs
}));
