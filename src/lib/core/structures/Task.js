const Piece = require('./base/Piece');

class Task extends Piece {
  async run() {
    // Defined in extension Classes
    throw new Error(`The run method has not been implemented by ${this.type}:${this.name}.`);
  }
}

module.exports = Task;
