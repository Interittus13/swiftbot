const GatewayStorage = require('./GatewayStorage');
const Settings = require('./Settings');
const { Collection } = require('discord.js');

class Gateway extends GatewayStorage {
  constructor(store, type, schema, provider) {
    super(store.client, type, schema, provider);
    this.store = store;
    this.cache = (type in this.client) && this.client[type].cache instanceof Map ? this.client[type].cache : new Collection();
    this.syncQueue = new Collection();

    Object.defineProperty(this, '_synced', { value: false, writable: true });
  }

  get Settings() {
    return Settings;
  }

  get(id, create = false) {
    const entry = this.cache.get(id);
    if (entry) return entry.settings;
    if (create) {
      const settings = new this.Settings(this, { id });
      if (this._synced && this.schema.size) settings.sync(true).catch(err => this.client.emit('error', err));
      return settings;
    }
    return null;
  }

  async sync(input = [...this.cache.keys()]) {
    if (Array.isArray(input)) {
      if (!this._synced) this._synced = true;
      const entries = await this.provider.getAll(this.type, input);
      for (const entry of entries) {
        if (!entry) continue;
        const cache = this.get(entry.id);
        if (cache) {
          if (!cache._existsInDB) cache._existsInDB = true;
          cache._patch(entry);
        }
      }

      // Set all the remaining settings from unknown status in DB to not exists.
      for (const entry of this.cache.values()) {
        if (entry.settings._existsInDB === null) entry.settings._existsInDB = false;
      }
      return this;
    }

    const cache = this.get((input && input.id) || input);
    return cache ? cache.sync(true) : null;
  }

}

module.exports = Gateway;
