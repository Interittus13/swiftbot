const Language = require('./Language');
const Store = require('./base/Store');

class LanguageStore extends Store {
  constructor(client) {
    super(client, 'languages', Language);
  }

  get default() {
    return this.get('en-US') || null;
  }
}

module.exports = LanguageStore;
