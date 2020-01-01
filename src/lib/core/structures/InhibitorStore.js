const Inhibitor = require('./Inhibitor');
const Store = require('./base/Store');

class InhibitorStore extends Store {
  constructor(client) {
    super(client, 'inhibitors', Inhibitor);
  }

  async run(message, command, selective = false) {
    const mps = [];
    for (const inhibitor of this.values()) if (inhibitor.enabled && (!selective || !inhibitor.spamProtection)) mps.push(inhibitor._run(message, command));
    const results = (await Promise.all(mps)).filter(res => res);
    if (results.includes(true)) throw undefined;
    if (results.length) throw results;
    return undefined;
  }
}

module.exports = InhibitorStore;
