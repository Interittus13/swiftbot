const Event = require('./Event');
const Store = require('./base/Store');

class EventStore extends Store {
  constructor(client) {
    super(client, 'events', Event);
    // this._onceEvents = new Set();
  }

  load(file, core) {
    // if (this._onceEvents.has(file[file.length - 1])) return undefined;
    return super.load(file, core);
  }

  clear() {
    for (const event of this.values()) this.delete(event);
  }

  delete(name) {
    const event = this.resolve(name);
    if (!event) return false;
    event._unlisten();
    return super.delete(event);
  }

  set(piece) {
    const event = super.set(piece);
    if (!event) return undefined;
    event._listen();
    return event;
  }
}

module.exports = EventStore;
