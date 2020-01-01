const Piece = require('./base/Piece');

class Language extends Piece {

  get(term, ...args) {
    if (!this.enabled && this !== this.store.default) return this.store.default.get(term, ...args);
    const value = this.language[term];
    if (!value) return this.language.DEFAULT(term);
    /* eslint-disable new-cap */
    switch (typeof value) {
      case 'function': return value(...args);
      // case 'undefined':
      //   if (this === this.store.default) return this.language.DEFAULT(term);
      //   return `${this.language.DEFAULT(term)}\n\n**${this.language.DEFAULT_LANGUAGE}:**\n${this.store.default.get(term, ...args)}`;
      default: return value;
    }
    /* eslint-enable new-cap */
  }
}

module.exports = Language;
