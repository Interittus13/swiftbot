const Serializer = require('./Serializer');
const AliasStore = require('./base/AliasStore');

class SerializerStore extends AliasStore {
  constructor(client) {
    super(client, 'serializers', Serializer);
  }
}

module.exports = SerializerStore;
