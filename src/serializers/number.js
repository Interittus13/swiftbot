/* eslint-disable class-methods-use-this */
const { Serializer } = require('../index');

module.exports = class extends Serializer {
  constructor(...args) {
    super(...args, { aliases: ['integer', 'float'] });
  }

  deserialize(data, piece, lang) {
    let num;
    switch (piece.type) {
      case 'integer':
        num = parseInt(data);
        if (Number.isInteger(num)) return num;
        throw lang.get('RESOLVER_INVALID_INT', piece.key)

      case 'number':
      case 'float':
        num = parseFloat(data);
        if (!isNaN(num)) return num;
        throw lang.get('RESOLVER_INVALID_FLOAT', piece.key);
    }

    return null;
  }
};
