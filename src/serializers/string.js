/* eslint-disable class-methods-use-this */
const { Serializer } = require('../index');

module.exports = class extends Serializer {

  deserialize(data) {
    return String(data);
  }
};
