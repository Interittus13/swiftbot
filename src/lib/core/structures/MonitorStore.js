const Monitor = require('./Monitor');
const Store = require('./base/Store');

class MonitorStore extends Store {
  constructor(client) {
    super(client, 'monitors', Monitor);
  }

  run(message) {
    for (const monitor of this.values()) if (monitor.shouldRun(message)) monitor._run(message);
  }
}

module.exports = MonitorStore;
