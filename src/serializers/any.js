const { Serializer } = require('../index');

module.exports = class extends Serializer {
  deserialize(data) {
    return data;
  }
};
