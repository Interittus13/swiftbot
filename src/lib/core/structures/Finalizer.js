const Piece = require('./base/Piece');

class Finalizer extends Piece {

  async _run(message, command, response) {
    try {
      await this.run(message, command, response);
    } catch (err) {
      this.client.emit('finalizerError', message, command, response, this, err);
    }
  }

  run() {
    // Defined in extension Classes
    throw new Error(`The run method has not been implemented by ${this.type}:${this.name}.`);
  }
}

module.exports = Finalizer;
