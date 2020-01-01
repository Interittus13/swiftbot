const { IncomingMessage } = require('http');
const { parse } = require('url');
const { split } = require('../util/util');
const { METHODS_LOWER } = require('../util/constants');

class SwiftIncomingMsg extends IncomingMessage {
  constructor(socket) {
    super(socket);

    this.originalUrl = null;
    this.path = null;
    this.search = null;
    this.query = null;
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
    const info = parse(this.url, true);
    this.originalUrl = this.originalUrl || this.url;
    this.path = info.pathname;
    this.search = info.search;
    this.query = info.query;

    const splitURL = split(this.path);
    this.route = client.routes.findRoute(this.method, splitURL);

    if (this.route) this.params = this.route.execute(splitURL);
  }
}

module.exports = SwiftIncomingMsg;
