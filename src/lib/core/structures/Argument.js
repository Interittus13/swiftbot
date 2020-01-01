const AliasPiece = require('./base/AliasPiece');
const { MENTION_REGEX } = require('../util/constants');

class Argument extends AliasPiece {
  async run() {
    // Defined in extension Classes
    throw new Error(`The run method has not been implemented by ${this.type}:${this.name}.`);
  }

  static minOrMax(client, value, min = null, max = null, possible, message, suffix) {
    suffix = suffix ? (message ? message.language : client.languages.default).get(suffix) : '';
    if (min !== null && max !== null) {
      if (value >= min && value <= max) return true;
      if (min === max) throw (message ? message.language : client.languages.default).get('RESOLVER_MINMAX_EQUALS', possible.name, min, suffix);
      throw (message ? message.language : client.languages.default).get('RESOLVER_MINMAX_BOTH', possible.name, min, max, suffix);
    } else if (min !== null) {
      if (value >= min) return true;
      throw (message ? message.language : client.languages.default).get('RESOLVER_MINMAX_MIN', possible.name, min, suffix);
    } else if (max !== null) {
      if (value <= max) return true;
      throw (message ? message.language : client.languages.default).get('RESOLVER_MINMAX_MAX', possible.name, max, suffix);
    }
    return true;
  }
}

Argument.regex = MENTION_REGEX;

module.exports = Argument;
