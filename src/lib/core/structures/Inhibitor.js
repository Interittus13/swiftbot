const Piece = require('./base/Piece');

class Inhibitor extends Piece {
  constructor(store, file, directory, options = {}) {
    super(store, file, directory, options);

    this.spamProtection = options.spamProtection || false;
  }

  async _run(message, command) {
    try {
      return await this.run(message, command);
    } catch (err) {
      return err;
    }
  }

  async run() {
    // Defined in extension Classes
    throw new Error(`The run method has not been implemented by ${this.type}:${this.name}.`);
  }
}

module.exports = Inhibitor;
