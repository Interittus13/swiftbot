const Piece = require('./base/Piece');
const { parse } = require('../util/util');

class Route extends Piece {
  constructor(store, file, dir, options = {}) {
    super(store, file, dir, options);

    this.route = this.client.options.dashboard.apiPrefix + options.route;
    this.authenticated = 'authenticated' in options ? options.authenticated : false;
    this.parsed = parse(this.route);
  }

  matches(split) {
    if (split.length !== this.parsed.length) return false;
    for (let i = 0; i < this.parsed.length; i++) {
      if (this.parsed[i].type === 0 && this.parsed[i].val !== split[i]) return false;
    }
    return true;
  }

  execute(split) {
    const params = {};
    for (let i = 0; i < this.parsed.length; i++) {
      if (this.parsed[i].type === 1) params[this.parsed[i].val] = split[i];
    }

    return params;
  }
}

module.exports = Route;
