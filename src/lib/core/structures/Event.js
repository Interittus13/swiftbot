const Piece = require('./base/Piece');

class Event extends Piece {
  constructor(store, file, directory, options = {}) {
    super(store, file, directory, options);

    // this.once = options.once || false;
    this.emitter = (typeof options.emitter === 'string' ? this.client[options.emitter] : options.emitter) || this.client;
    this.event = options.event || this.name;
    this._listener = this._run.bind(this);
    // this._listener = this.once ? this._runOnce.bind(this) : this._run.bind(this);
  }

  run() {
    // Defined in extension Classes
    throw new Error(`The run method has not been implemented by ${this.type}:${this.name}.`);
  }

  disable() {
    this._unlisten();
    return super.disable();
  }

  enable() {
    this._listen();
    return super.enable();
  }

  async _run(...args) {
    try {
      await this.run(...args);
    } catch (err) {
      this.client.emit('eventError', this, args, err);
    }
  }

  // async _runOnce(...args) {
  //   await this._run(...args);
  //   this.store._onceEvents.add(this.file[this.file.length - 1]);
  //   this.unload();
  // }

  _listen() {
    this.emitter.on(this.event, this._listener);
    // this.emitter[this.once ? 'once' : 'on'](this.event, this._listener);
  }

  _unlisten() {
    this.emitter.removeListener(this.event, this._listener);
  }

  toJSON() {
    return {
      ...super.toJSON(),
      event: this.event,
      emitter: this.emitter.constructor.name,
    };
  }
}

module.exports = Event;
