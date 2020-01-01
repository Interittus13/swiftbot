const http = require('http');

class Server {
  constructor(client) {
    const { http2, serverOptions } = client.options.dashboard;

    this.client = client;

    this.server = http2 ?
    require('http2').createSecureServer(serverOptions) :
    serverOptions.cert ? require('https').createServer(serverOptions) : http.createServer(serverOptions);

    this.onNoMatch = this.onError.bind(this, { code: 404 });
  }

  listen(port) {
    this.server.on('request', this.handler.bind(this));
    return new Promise((res, rej) => {
      this.server.listen(port, err => err ? rej(err) : res());
    });
  }

  async handler(req, res) {
    req.init(this.client);

    try {
      await this.client.middlewares.run(req, res, req.route);
      await (req.route ? req.execute(res) : this.onNoMatch(req, res));
    } catch (error) {
      this.client.logger.error(error);
      this.onError(error, req, res);
    }
  }

  onError(error, req, res) {
    const code = res.statusCode = error.code || error.status || error.statusCode || 500;
    res.end(JSON.stringify({ message: (error.length && error) || error.message || http.STATUS_CODES[code], success: false }));
  }
}

module.exports = Server;
