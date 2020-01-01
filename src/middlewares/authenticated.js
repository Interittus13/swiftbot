const { Middleware, coreutil: { decrypt }, constants: { RESPONSES }, config } = require('../index');

module.exports = class extends Middleware {
  constructor(...args) {
    super(...args, { priority: 100 });
  }

  async run(req, res, route) {
    if (!route || !route.authenticated) return;

    try {
      req.auth = decrypt(req.headers.authorization, config.clientSecret);
      if (req.method === 'POST' && !req.auth.scope.includes(req.body.id)) throw true;
    } catch (error) {
      this.unauthorized(res);
    }
  }

  unauthorized(res) {
    res.writeHead(401);
    return res.end(RESPONSES.UNAUTHORIZED);
  }
};
