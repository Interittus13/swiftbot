const Store = require('./base/Store');
const { METHODS } = require('http');

const Route = require('./Route');
const { METHODS_LOWER } = require('../util/constants');

class RouteStore extends Store {
  constructor(client) {
    super(client, 'routes', Route);

    this.registry = {};

    for (const method of METHODS) this.registry[method] = new Map();
  }

  findRoute(method, splitURL) {
    for (const route of this.registry[method].values()) {
      if (route.matches(splitURL)) return route;
    }

    return undefined;
  }

  clear() {
    for (const method of METHODS) this.registry[method].clear();
    return super.clear();
  }

  set(piece) {
    const route = super.set(piece);
    if (!route) return route;

    for (const method of METHODS) {
      if (METHODS_LOWER[method] in route) this.registry[method].set(route.name, route);
    }

    return route;
  }

  delete(name) {
    const route = this.resolve(name);
    if (!route) return false;

    for (const method of METHODS) this.registry[method].delete(route.name);
    return super.delete(route);
  }
}

module.exports = RouteStore;
