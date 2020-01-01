const { Middleware } = require('../index');

module.exports = class extends Middleware {
  constructor(...args) {
    super(...args, { priority: 10 });
  }

  run(req, res) {
    res.setHeader('Access-Control-Allow-Origin', this.client.options.dashboard.origin);
    res.setHeader('Access-Control-Allow-Methods', 'DELETE, GET, HEAD, OPTIONS, PATCH, POST, PUT');
    res.setHeader('Access-Control-Allow-Headers', 'Authorization, User-Agent, Content-Type');

    if (req.method === 'OPTIONS') return res.end('Something');
    res.setHeader('Content-Type', 'application/json');
    return undefined;
  }
};
