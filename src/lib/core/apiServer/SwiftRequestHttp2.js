const { Http2ServerRequest } = require('http2');
const { parse } = require('url');
const { split } = require('../util/util');
const { METHODS_LOWER } = require('../util/constants');
const SwiftResponseHttp2 = require('./SwiftResponseHttp2');

class SwiftRequestHttp2 extends Http2ServerRequest {
  constructor(stream, headers, options, rawHeaders) {
    super(stream, headers, options, rawHeaders);

    const info = parse(this.url, true);

    this.originalUrl = this.originalUrl || this.url;
    this.path = info.pathname;
    this.search = info.search;
    this.query = info.query;
    this.params = null;
    this.route = null;
    this.auth = null;
    this.body = null;
  }

  get methodLower() {
    return METHODS_LOWER[this.method];
  }

  execute(res) {
    return this.route[this.methodLower](this, res);
  }

  init(client) {
    const splitURL = split(this.path);
    this.route = client.routes.findRoute(this.method, splitURL);

    if (this.route) this.params = this.route.execute(splitURL);
  }
}

module.exports = SwiftResponseHttp2;
