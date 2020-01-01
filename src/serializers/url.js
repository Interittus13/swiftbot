/* eslint-disable class-methods-use-this */
const { Serializer } = require('../index');
const URL = require('url');

module.exports = class extends Serializer {

  deserialize(data, piece, lang) {
    const url = URL.parse(data);
    if (url.protocol && url.hostname) return data;
    throw lang.get('RESOLVER_INVALID_URL', piece.key);
  }
};
