/* eslint-disable class-methods-use-this */
const { Inhibitor } = require('../index');

module.exports = class extends Inhibitor {
  run(message, command) {
    if (!command.requiredSettings.length || message.channel.type !== 'text') return;

    const reqSettings = command.requiredSettings.filter(set => message.guild.settings.get(set) === false);
    if (reqSettings.length) throw message.language.get('INHIBITOR_REQUIRED_SETTINGS', reqSettings);
  }
};
