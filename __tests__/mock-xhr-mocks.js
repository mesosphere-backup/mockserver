module.exports = {
  mocks: [
    {
      id: "switch-mock-B",
      request: (req, res) => {
        res.write("B");
        res.end();
      }
    },
    {
      id: "switch-mock-A",
      request: (req, res) => {
        res.write("A");
        res.end();
      }
    },
    {
      id: "header-mock",
      request: (req, res) => {
        res.write(req.header("specialHeader"));
        res.end();
      }
    },
    {
      id: "body-mock",
      request: (req, res) => {
        res.write(res.locals.rawBody);
        res.end();
      }
    },
    {
      id: "json-mock",
      request: (req, res) => {
        res.write(JSON.stringify({ key: "myValue" }));
        res.end();
      }
    },
    {
      id: "binary-mock",
      request: (req, res) => {
        res.end(new Buffer("my-binary-string", "binary"));
      }
    },
    {
      id: "xml-mock",
      request: (req, res) => {
        res.write("<mock><id>42</id></mock>");
        res.end();
      }
    }
  ]
};
