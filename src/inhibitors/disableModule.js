const { Inhibitor } = require('../index');

module.exports = class extends Inhibitor {
  constructor(...args) {
    super(...args, {
      spamProtection: true,
    });
  }

  async run(message, command) {
      if (!message.guild || !message.guild.settings.get('disabledModules').includes(command.category.toLowerCase())) return;
      throw message.language.get('INHIBITOR_MODULE_DISABLED', command.category);
  }
};
