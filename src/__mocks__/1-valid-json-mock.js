const getMockForJSON = require("../mocks").getMockForJSON;

const jsonMock = {
  ping: "pong"
};

module.exports = {
  mocks: [
    {
      id: "my-json-mock",
      request: getMockForJSON(jsonMock)
    }
  ]
};
