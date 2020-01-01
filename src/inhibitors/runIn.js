const { Inhibitor } = require('../index');

module.exports = class extends Inhibitor {
  run(message, command) {
    if (!command.runIn.includes(message.channel.type)) throw message.language.get('INHIBITOR_RUNIN', command.runIn.join(', '));
  }
}
