const AliasPiece = require('./base/AliasPiece');
const { MENTION_REGEX } = require('../util/constants');

class Serializer extends AliasPiece {

  serialize(data) {
    return data;
  }

  async deserialize() {
    throw new Error(`The deserialize method has not been implemented by ${this.type}:${this.name}`);
  }

  stringify(data) {
    return String(data);
  }
}

Serializer.regex = MENTION_REGEX;

module.exports = Serializer;
