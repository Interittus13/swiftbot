const { Event } = require('../index');

module.exports = class extends Event {
  async run(message) {
    await this.client.monitors.run(message);
  }
};
