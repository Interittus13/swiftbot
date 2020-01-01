const { Event } = require('../index');

module.exports = class extends Event {
  run(message, cmd, res) {
    if (res && res.length) {
      message.channel.send(res);
    }
  }
};
