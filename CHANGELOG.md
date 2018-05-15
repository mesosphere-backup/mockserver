# Change Log

All notable changes to this project will be documented in this file. See [standard-version](https://github.com/conventional-changelog/standard-version) for commit guidelines.

<a name="2.0.1"></a>

## [2.0.1](https://github.com/mesosphere/mockserver/compare/v2.0.0...v2.0.1) (2018-05-15)

<a name="2.0.0"></a>

# [2.0.0](https://github.com/mesosphere/mockserver/compare/v1.2.4...v2.0.0) (2018-05-09)

### Features

* **mocks:** implement mock discovery ([c1072f7](https://github.com/mesosphere/mockserver/commit/c1072f7))

### BREAKING CHANGES

* **mocks:** the environment variable was not necessary before. Set it to
  an non-existant path as a default, so that the behaviour does not
  change for you

Closes DCOS-21972

<a name="1.2.4"></a>

## [1.2.4](https://github.com/mesosphere/mockserver/compare/v1.2.3...v1.2.4) (2018-05-03)

<a name="1.2.3"></a>

## [1.2.3](https://github.com/mesosphere/mockserver/compare/v1.2.2...v1.2.3) (2018-05-03)

<a name="1.2.2"></a>

## [1.2.2](https://github.com/mesosphere/mockserver/compare/v1.2.1...v1.2.2) (2018-04-30)

<a name="1.2.1"></a>

## [1.2.1](https://github.com/mesosphere/mockserver/compare/v1.2.0...v1.2.1) (2018-04-27)

<a name="1.2.0"></a>

# [1.2.0](https://github.com/mesosphere/mockserver/compare/v1.1.0...v1.2.0) (2018-04-25)

### Features

* **proxy:** add websocket support ([d0ce77a](https://github.com/mesosphere/mockserver/commit/d0ce77a))
* **proxy:** enable server sent events ([2e19a34](https://github.com/mesosphere/mockserver/commit/2e19a34))

<a name="1.1.0"></a>

# [1.1.0](https://github.com/mesosphere/mockserver/compare/v1.0.8...v1.1.0) (2018-04-24)

### Features

* **proxy:** enable server sent events ([2f72402](https://github.com/mesosphere/mockserver/commit/2f72402))

<a name="1.0.8"></a>

## [1.0.8](https://github.com/mesosphere/mockserver/compare/v1.0.7...v1.0.8) (2018-04-24)

<a name="1.0.7"></a>

## [1.0.7](https://github.com/mesosphere/mockserver/compare/v1.0.6...v1.0.7) (2018-04-24)

### Bug Fixes

* **deps:** update dependency express-http-proxy to v1.2.0 ([c82fbf3](https://github.com/mesosphere/mockserver/commit/c82fbf3))

<a name="1.0.6"></a>

## [1.0.6](https://github.com/mesosphere/mockserver/compare/v1.0.5...v1.0.6) (2018-04-23)

<a name="1.0.5"></a>

## [1.0.5](https://github.com/mesosphere/mockserver/compare/v1.0.4...v1.0.5) (2018-04-23)

<a name="1.0.4"></a>

## [1.0.4](https://github.com/mesosphere/mockserver/compare/v1.0.3...v1.0.4) (2018-04-23)

<a name="1.0.3"></a>

## [1.0.3](https://github.com/mesosphere/mockserver/compare/v1.0.2...v1.0.3) (2018-04-23)

<a name="1.0.2"></a>

## [1.0.2](https://github.com/mesosphere/mockserver/compare/v1.0.1...v1.0.2) (2018-04-23)

<a name="1.0.1"></a>

## [1.0.1](https://github.com/mesosphere/mockserver/compare/v1.0.0...v1.0.1) (2018-04-18)

<a name="1.0.0"></a>

# [1.0.0](https://github.com/mesosphere/mockserver/compare/v0.1.5...v1.0.0) (2018-04-18)

### Bug Fixes

* **tooling:** include src files in prettier scope ([1dd8336](https://github.com/mesosphere/mockserver/commit/1dd8336))

### Features

* **proxy:** adds support for the PROXY_HOST_PORT environment variable ([cd927e6](https://github.com/mesosphere/mockserver/commit/cd927e6))
* **proxy:** enable XHR proxying ([08ae2db](https://github.com/mesosphere/mockserver/commit/08ae2db))
* **tooling:** enable tests against started server ([dbacc27](https://github.com/mesosphere/mockserver/commit/dbacc27))

### BREAKING CHANGES

* **proxy:** Starting the server will throw an error if PROXY_HOST_PORT is not provided. It
  should be set to the host and port of the application you want to proxy to, e.g.
  'my-application.com:4567'

<a name="0.1.5"></a>

## [0.1.5](https://github.com/mesosphere/mockserver/compare/v0.1.4...v0.1.5) (2018-04-17)

<a name="0.1.4"></a>

## [0.1.4](https://github.com/mesosphere/mockserver/compare/v0.1.3...v0.1.4) (2018-04-17)

<a name="0.1.3"></a>

## [0.1.3](https://github.com/mesosphere/mockserver/compare/v0.1.2...v0.1.3) (2018-04-17)

<a name="0.1.2"></a>

## [0.1.2](https://github.com/mesosphere/mockserver/compare/v0.1.1...v0.1.2) (2018-04-17)

<a name="0.1.1"></a>

## [0.1.1](https://github.com/mesosphere/mockserver/compare/v0.0.1...v0.1.1) (2018-04-17)

<a name="0.1.0"></a>

# 0.1.0 (2018-04-17)

### Features

* expose empty mock server ([f5a9151](https://github.com/mesosphere/mockserver/commit/f5a9151))

<a name="0.0.1"></a>

## 0.0.1 (2018-04-17)

### Features

* expose empty mock server ([f5a9151](https://github.com/mesosphere/mockserver/commit/f5a9151))
