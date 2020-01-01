const { isObj, deepClone, toTitleCase, arrayStrictEquals, objToTuples, resolveGuild } = require('../util/util');
const SchemaPiece = require('./schema/SchemaPiece');

class Settings {
  constructor(manager, data) {
    Object.defineProperty(this, 'client', { value: manager.client });
    Object.defineProperty(this, 'gateway', { value: manager });
    Object.defineProperty(this, 'id', { value: data.id });
    Object.defineProperty(this, '_existsInDB', { value: null, writable: true });

    const { defaults, schema } = this.gateway;
    for (const key of schema.keys()) this[key] = defaults[key];
    this._patch(data);
  }

  get synchronizing() {
    return this.gateway.syncQueue.has(this.id);
  }

  get(path) {
    const route = typeof path === 'string' ? path.split('.') : path;
    const piece = this.gateway.schema.get(route);
    if (!piece) return undefined;

    let refThis = this; // eslint-disable-line consistent-this
    for (const key of route) refThis = refThis[key];

    return refThis;
  }

  clone() {
    return new this.constructor(this.gateway, this);
  }

  sync(force = false) {
    // Await current sync status from the sync queue
    const syncStatus = this.gateway.syncQueue.get(this.id);
    if (!force || syncStatus) return syncStatus || Promise.resolve(this);

    // If it's not currently synchronizing, create a new sync status for the sync queue
    const sync = this.gateway.provider.get(this.gateway.type, this.id).then((data) => {
      this._existsInDB = Boolean(data);
      if (data) this._patch(data);
      this.gateway.syncQueue.delete(this.id);
      return this;
    });

    this.gateway.syncQueue.set(this.id, sync);
    return sync;
  }

  async destroy() {
    if (this._existsInDB) {
      await this.gateway.provider.delete(this.gateway.type, this.id);
      this.client.emit('settingsDeleteEntry', this);
    }
    return this;
  }

  async reset(keys, guild, { avoidUnconfigurable = false, force = false } = {}) {
    if (typeof guild === 'boolean') {
      avoidUnconfigurable = guild;
      guild = undefined;
    }

    // If the entry does not exist in the DB, it'll never be able to reset a key
    if (!this._existsInDB) return { errors: [], updated: [] };

    if (typeof keys === 'string') keys = [keys];
    else if (typeof keys === 'undefined') keys = [...this.gateway.schema.values(true)].map(piece => piece.path);
    if (Array.isArray(keys)) {
      const result = { errors: [], updated: [] };
      for (const key of keys) {
        const path = this.gateway.getPath(key, { piece: true, avoidUnconfigurable, errors: false });
        if (!path) {
          result.errors.push(guild && guild.language ?
            guild.language.get('COMMAND_CONF_GET_NOEXT', key) :
            `The path ${key} does not exist in the current schema, or does not correspond to a piece.`);
          continue;
        }
        const value = deepClone(path.piece.default);
        if (this._setValueByPath(path.piece, value, force).updated) result.updated.push({ data: [path.piece.path, value], piece: path.piece });
      }
      await this._save(result);
      return result;
    }
    throw new TypeError('Invalid value. Expected string or Array<string>.');
  }

  update(key, value, guild, options) {
    let entries;
    // Overload update(object, GuildResolvable);
    if (isObj(key)) {
      [guild, options] = [value, guild];
      entries = objToTuples(key);
    } else if (typeof key === 'string') {
      // Overload update(string, any, ...any[]);
      entries = [[key, value]];
    } else if (Array.isArray(key) && key.every(entry => Array.isArray(entry) && entry.length === 2)) {
      // Overload update(Array<[string, any]>)
      [guild, options] = [value, guild];
      entries = key;
    } else {
      return Promise.reject(new TypeError('Invalid value. Expected object, string or Array<[string, any]>.'));
    }

    // Overload update(string|string[], any|any[], SettingsUpdateOptions);
    // Overload update(string|string[], any|any[], GuildResolvable, SettingsUpdateOptions);
    // If the third argument is undefined and the second is an object literal, swap the variables.
    if (typeof options === 'undefined' && isObj(guild)) [guild, options] = [null, guild];
    if (guild) guild = resolveGuild(this.client, guild);
    if (!options) options = {};

    return this._update(entries, guild, {
      avoidUnconfigurable: typeof options.avoidUnconfigurable === 'boolean' ? options.avoidUnconfigurable : false,
      action: typeof options.action === 'string' ? options.action : 'auto',
      arrayPosition: typeof options.arrayPosition === 'number' ? options.arrayPosition : null,
      force: typeof options.force === 'boolean' ? options.force : false,
    });
  }

  list(message, path) {
    const folder = typeof path === 'string' ? this.gateway.getPath(path, { piece: false }).piece : path;
    const array = [];
    const folders = [];
    const keys = {};
    let longest = 0;
    for (const [key, value] of folder.entries()) {
      if (value.type === 'Folder') {
        if (value.configurableKeys.length) folders.push(`// ${key}`);
      } else if (value.configurable) {
        if (!(value.type in keys)) keys[value.type] = [];
        if (key.length > longest) longest = key.length;
        keys[value.type].push(key);
      }
    }
    const keysTypes = Object.keys(keys);
    if (!folders.length && !keysTypes.length) return '';
    if (folders.length) array.push('= Folders =', ...folders.sort(), '');
    if (keysTypes.length) {
      for (const keyType of keysTypes.sort()) {
        array.push(`= ${toTitleCase(keyType)}s =`,
          ...keys[keyType].sort().map(key => `${key.padEnd(longest)} :: ${this.resolveString(message, folder.get(key))}`),
          '');
      }
    }
    return array.join('\n');
  }

  resolveString(message, path) {
    const piece = path instanceof SchemaPiece ? path : this.gateway.getPath(path, { piece: true }).piece;
    const value = this.get(piece.path);
    if (value === null) return 'Not set';
    if (piece.array) return value.length ? `[ ${value.map(val => piece.serializer.stringify(val, message)).join(' | ')} ]` : 'None';
    return piece.serializer.stringify(value, message);
  }

  async _update(entries, guild, options) {
    const result = { errors: [], updated: [] };
    const pathOptions = { piece: true, avoidUnconfigurable: options.avoidUnconfigurable, errors: false };
    const promises = [];
    for (const [key, value] of entries) {
      const path = this.gateway.getPath(key, pathOptions);
      if (!path) {
        result.errors.push(guild ?
          guild.language.get('COMMAND_CONF_GET_NOEXT', key) :
          `The path ${key} does not exist in the current schema, or does not correspond to a piece.`);
        continue;
      }
      if (!path.piece.array && Array.isArray(value)) {
        result.errors.push(guild ?
          guild.language.get('SETTING_GATEWAY_KEY_NOT_ARRAY', key) :
          `The path ${key} does not store multiple values.`);
        continue;
      }
      promises.push(this._parse(value, guild, options, result, path));
    }

    if (promises.length) {
      await Promise.all(promises);
      await this._save(result);
    }

    return result;
  }

  async _parse(value, guild, options, result, { piece, route }) {
    const parsed = value === null ?
      deepClone(piece.default) :
      await (Array.isArray(value) ?
        this._parseAll(piece, value, guild, result.errors) :
        piece.parse(value, guild).catch((error) => { result.errors.push(error); }));
    if (typeof parsed === 'undefined') return;
    const parsedID = Array.isArray(parsed) ? parsed.map(val => piece.serializer.serialize(val)) : piece.serializer.serialize(parsed);
    if (piece.array) {
      this._parseArray(piece, route, parsedID, options, result);
    } else if (this._setValueByPath(piece, parsedID, options.force).updated) {
      result.updated.push({ data: [piece.path, parsedID], piece });
    }
  }

  async _save({ updated }) {
    if (!updated.length) return;
    if (this._existsInDB === null) await this.sync(true);
    if (this._existsInDB === false) {
      await this.gateway.provider.create(this.gateway.type, this.id);
      this._existsInDB = true;
      this.client.emit('settingsCreateEntry', this);
    }

    await this.gateway.provider.update(this.gateway.type, this.id, updated);
    this.client.emit('settingsUpdateEntry', this, updated);
  }

  _parseArray(piece, route, parsed, { force, action, arrayPosition }, { updated, errors }) {
    if (action === 'overwrite') {
      if (!Array.isArray(parsed)) parsed = [parsed];
      if (this._setValueByPath(piece, parsed, force).updated) {
        updated.push({ data: [piece.path, parsed], piece });
      }
      return;
    }
    const array = this.get(route);
    if (typeof arrayPosition === 'number') {
      if (arrayPosition >= array.length) errors.push(new Error(`The option arrayPosition should be a number between 0 and ${array.length - 1}`));
      else array[arrayPosition] = parsed;
    } else {
      for (const value of Array.isArray(parsed) ? parsed : [parsed]) {
        const index = array.indexOf(value);
        if (action === 'auto') {
          if (index === -1) array.push(value);
          else array.splice(index, 1);
        } else if (action === 'add') {
          if (index !== -1) errors.push(new Error(`The value ${value} for the key ${piece.path} already exists.`));
          else array.push(value);
        } else if (index === -1) {
          errors.push(new Error(`The value ${value} for the key ${piece.path} does not exist.`));
        } else {
          array.splice(index, 1);
        }
      }
    }

    updated.push({ data: [piece.path, array], piece });
  }

  async _parseAll(piece, values, guild, errors) {
    const output = [];
    await Promise.all(values.map(value => piece.parse(value, guild)
      .then(parsed => output.push(parsed))
      .catch(error => errors.push(error))));

    return output;
  }

  _setValueByPath(piece, parsedID, force) {
    const path = piece.path.split('.');
    const lastKey = path.pop();
    let cache = this; // eslint-disable-line consistent-this
    for (const key of path) cache = cache[key] || {};
    const old = cache[lastKey];

    // If both parts are equal, don't update
    if (!force && (piece.array ? arrayStrictEquals(old, parsedID) : old === parsedID)) return { updated: false, old };

    cache[lastKey] = parsedID;
    return { updated: true, old };
  }

  _patch(data, instance = this, schema = this.gateway.schema) {
    if (typeof data !== 'object' || data === null) return;
    for (const [key, piece] of schema.entries()) {
      const value = data[key];
      if (value === undefined) continue;
      if (value === null) instance[key] = deepClone(piece.defaults);
      else if (piece.type === 'Folder') this._patch(value, instance[key], piece);
      else instance[key] = value;
    }
  }

  toJSON() {
    return Object.assign({}, ...[...this.gateway.schema.keys()].map(key => ({ [key]: deepClone(this[key]) })));
  }

  toString() {
    return `Settings(${this.gateway.type}:${this.id})`;
  }

}

module.exports = Settings;
