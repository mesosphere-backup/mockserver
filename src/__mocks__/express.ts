const app = {
  use: jest.fn(),
  listen: jest.fn((port, cb) => cb())
};

const express = jest.fn(() => app);
export default express;
