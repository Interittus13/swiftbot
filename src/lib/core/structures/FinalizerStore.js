const Finalizer = require('./Finalizer');
const Store = require('./base/Store');

class FinalizerStore extends Store {
  constructor(client) {
    super(client, 'finalizers', Finalizer);
  }

  run(message, command, response, timer) {
    for (const finalizer of this.values()) {
      if (finalizer.enabled) finalizer._run(message, command, response, timer);
    }
  }
}

module.exports = FinalizerStore;
