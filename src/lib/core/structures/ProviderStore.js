const Provider = require('./Provider');
const Store = require('./base/Store');

class ProviderStore extends Store {
  constructor(client) {
    super(client, 'providers', Provider);
  }

  get default() {
    return this.get(this.client.options.providers.default) || null;
  }

  clear() {
    for (const provider of this.values()) this.delete(provider);
  }

  delete(name) {
    const pro = this.resolve(name);
    if (!pro) return false;
    pro.shutdown();
    return super.delete(pro);
  }
}

module.exports = ProviderStore;
