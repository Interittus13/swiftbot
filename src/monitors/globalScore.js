const { Monitor } = require('../index');

module.exports = class extends Monitor {
  constructor(...args) {
    super(...args, {
      ignoreOthers: false,
      enable: false,
    });
  }

  async run(message) {
    if (message.prefix) return;
    this.client.logger.log(message.content);
  }
};
