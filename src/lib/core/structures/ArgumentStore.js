const Argument = require('./Argument');
const AliasStore = require('./base/AliasStore');

class ArgumentStore extends AliasStore {
  constructor(client) {
    super(client, 'arguments', Argument);
  }
}

module.exports = ArgumentStore;
