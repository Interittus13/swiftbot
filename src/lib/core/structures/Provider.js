const Piece = require('./base/Piece');
const { isObj, mergeObjs, makeObj } = require('../util/util');

class Provider extends Piece {

  async createTable() {
    throw new Error(`[PROVIDERS] ${this.path} | Missing method 'createTable' of ${this.constructor.name}`);
  }

  async deleteTable() {
    throw new Error(`[PROVIDERS] ${this.path} | Missing method 'deleteTable' of ${this.constructor.name}`);
  }

  async hasTable() {
    throw new Error(`[PROVIDERS] ${this.path} | Missing method 'hasTable' of ${this.constructor.name}`);
  }

  async create() {
    throw new Error(`[PROVIDERS] ${this.path} | Missing method 'create' of ${this.constructor.name}`);
  }

  async delete() {
    throw new Error(`[PROVIDERS] ${this.path} | Missing method 'delete' of ${this.constructor.name}`);
  }

  async get() {
    throw new Error(`[PROVIDERS] ${this.path} | Missing method 'get' of ${this.constructor.name}`);
  }

  async getAll() {
    throw new Error(`[PROVIDERS] ${this.path} | Missing method 'getAll' of ${this.constructor.name}`);
  }

  async getKeys() {
    throw new Error(`[PROVIDERS] ${this.path} | Missing method 'getKeys' of ${this.constructor.name}`);
  }

  async has() {
    throw new Error(`[PROVIDERS] ${this.path} | Missing method 'has' of ${this.constructor.name}`);
  }

  async replace() {
    throw new Error(`[PROVIDERS] ${this.path} | Missing method 'replace' of ${this.constructor.name}`);
  }

  async update() {
    throw new Error(`[PROVIDERS] ${this.path} | Missing method 'update' of ${this.constructor.name}`);
  }

  async shutdown() {
    // Optionally defined in extension Classes
  }

  parseUpdateInput(updated) {
    if (isObj(updated)) return updated;
    const updateObject = {};
    for (const entry of updated) mergeObjs(updateObject, makeObj(entry.data[0], entry.data[1]));
    return updateObject;
  }

}

module.exports = Provider;
