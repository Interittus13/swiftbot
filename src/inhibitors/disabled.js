const { Inhibitor } = require('../index');

module.exports = class extends Inhibitor {
  run(message, cmd) {
    if (message.guildSettings.disabledCmds.includes(cmd.name)) throw message.language.get('INHIBITOR_DISABLED_GUILD', cmd.name);
  }
};
