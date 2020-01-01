const { Command } = require('../../index');

module.exports = class extends Command {
  constructor(...args) {
    super(...args, {
      description: language => language.get('CMD_ECONOMY_DESCRIPTION'),
      extended: language => language.get('CMD_ECONOMY_EXTENDED'),
      usage: '[ignore #channel]',
      aliases: ['social'],
      example: ['', 'ignore #channel'],
      permLevel: 6,
    });
  }
  async run(message, [action]) {
    if (['ignore'].includes(action)) return this.ignore(message, action);
    return this.toggle(message);
  }

  async toggle(message) {
    const toggle = !message.guild.settings.get('toggles.persistence');
    await message.guild.settings.update('toggles.persistence', toggle);

    return message.channel.send(message.language.get('CMD_PERSISTENCE_TOGGLE', toggle));
  }

  async ignore(message, value) {
    if (!value) throw 'Invalid channel name.';
    const channel = await this.client.resolveChannel(message, value);
    if (!channel) throw message.language.get('ERROR_INVALID_CHANNEL');

    await message.guild.settings.update('ignoreChannels.persistence', channel);
    return message.reply('Social disabled.');
  }
};
