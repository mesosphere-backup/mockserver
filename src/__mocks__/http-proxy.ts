const mockWeb = jest.fn();
export const createProxyServer = jest.fn(() => ({
  web: mockWeb
}));
