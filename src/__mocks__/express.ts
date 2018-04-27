const eventHandlerMock = jest.fn();

const app = {
  use: jest.fn(),
  listen: jest.fn((port, cb) => {
    // we need to defer this, so the return took action already like in the real implementation
    setTimeout(() => cb());
    return {
      address: jest.fn(() => ({
        port: 4242
      })),
      on: eventHandlerMock
    };
  })
};

const express = jest.fn(() => app);
export default express;
