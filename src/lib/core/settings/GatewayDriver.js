const Gateway = require('./Gateway');
const Schema = require('./schema/Schema');

class GatewayDriver {
  constructor(client) {
    Object.defineProperty(this, 'client', { value: client });
    Object.defineProperty(this, '_queue', { value: [] });

    this.keys = new Set();
    this.guilds = null;
    this.users = null;
    this.members = null;
    this.clientStorage = null;
  }

  register(name, { provider = this.client.options.providers.default, schema = new Schema() } = {}) {
    if (typeof name !== 'string') throw new TypeError('You must pass a name for your new gateway and it must be a string.');
    if (!(schema instanceof Schema)) throw new TypeError('Schema must be a valid Schema instance.');
    if (this.name !== undefined && this.name !== null) throw new Error(`The key '${name}' is either taken by another Gateway or reserved for GatewayDriver's functionality.`);

    const gateway = new Gateway(this, name, schema, provider);
    this.keys.add(name);
    this[name] = gateway;
    this._queue.push(gateway.init.bind(gateway));
    if (!(name in this.client.options.gateways)) this.client.options.gateways[name] = {};
    return this;
  }

  async init() {
    await Promise.all([...this._queue].map(fn => fn()));
    this._queue.length = 0;
  }

  sync(input) {
    return Promise.all([...this].map(([key, gateway]) => gateway.sync(typeof input === 'undefined' ? this.client.options.gateways[key].syncArg : input)));
  }

  *[Symbol.iterator]() {
    for (const key of this.keys) yield [key, this[key]];
  }

  toString() {
    return `GatewayDriver(${[...this.keys].join(', ')})`;
  }
}

module.exports = GatewayDriver;
