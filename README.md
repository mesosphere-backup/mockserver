# Mockserver

## Usage

We provide two interfaces, a CLI for the fast and easy way to interact with the mock server and a programmatic API to give you the control over everything.

### CLI

The CLI is entirely controlled via environment variables, here are the ones you may configure

* `PROXY_HOST_PORT` (required): determine where to send the requests no mock matches against to. E.g. "my-service.com:2342"
* `MOCK_SEARCH_EXPRESSION` (required): glob to specify where to search for mocks. E.g. "./\*_/_-mock.js"
* `PORT` (optional): port of the mockserver

Your mocks should be defined in Javascript files as named export:

```js
// The name is important!
export const mocks = [
  {
    id: "my-first-mock",
    request: (req, res) => {
      // Same interface as express middlewares
      res.status(200);
    }
  }
];
```

Please note that we import these files at start time of the mockserver.

### API

```ts
import mockserver from "mockserver";
// Every option is required
const { port, close } = await mockserver({
  port: 0, // zero means "choose your own"
  proxyHost: "my-service",
  proxyPort: 42,
  mocks: [
    {
      id: "my-first-mock",
      request: (req, res) => {
        // Same interface as express middlewares
        res.status(200);
      }
    }
  ]
});
```

## Development

* Installation: `npm install`
* Start production server: `npm start`
* Start development server: `npm run watch`

## Testing

Please run `npm test`
