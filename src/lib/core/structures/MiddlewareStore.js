const Store = require('./base/Store');
const Middleware = require('./Middleware');

class MiddlewareStore extends Store {
  constructor(client) {
    super(client, 'middlewares', Middleware);

    this.sortedMiddlewares = [];
  }

  clear() {
    this.sortedMiddlewares = [];
    return super.clear();
  }

  set(piece) {
    const middleware = super.set(piece);
    if (!middleware) return middleware;

    const index = this.sortedMiddlewares.findIndex(m => m.priority >= middleware.priority);

    if (index === -1) this.sortedMiddlewares.push(middleware);
    else this.sortedMiddlewares.splice(index, 0, middleware);
    return middleware;
  }

  delete(name) {
    const middleware = this.resolve(name);
    if (!middleware) return false;

    this.sortedMiddlewares.splice(this.sortedMiddlewares.indexOf(middleware), 1);
    return super.delete(middleware);
  }

  async run(req, res, route) {
    for (const middleware of this.sortedMiddlewares) {
      if (res.finished) return;
      console.log(await middleware.run(req, res, route));
      if (middleware.enabled) await middleware.run(req, res, route);
    }
  }
}

module.exports = MiddlewareStore;
