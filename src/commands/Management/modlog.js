const { Command } = require('../../index');

module.exports = class extends Command {
  constructor(...args) {
    super(...args, {
      description: language => language.get('CMD_MODLOGS_DESCRIPTION'),
      usage: '[#Channel]',
      extended: language => language.get('CMD_MODLOGS_EXTENDED'),
      aliases: ['modlogs'],
      example: ['', '#channel'],
      permLevel: 6,
    });
  }
  async run(message, [channel]) {
    const toggle = message.guild.settings.get('toggles.modlog');
    const modLogChannel = message.guild.settings.get('channels.modlog');

    if (channel && toggle) {
      const chan = this.client.resolveChannel(message, channel);
      if (!chan) throw message.language.get('ERROR_INVALID_CHANNEL', chan);

      await message.guild.settings.update('channels.modlog', chan);
      return message.channel.send(message.language.get('CMD_MODLOGS_CHANNEL_UPDATED', message.guild.settings.get('channels.modlog')));
    }

    if (!toggle && !modLogChannel) {
      if (!channel) throw 'Please specify a channel.';
      const chan = await this.client.resolveChannel(message, channel);
      if (!chan) throw message.language.get('ERROR_INVALID_CHANNEL', chan);

      await message.guild.settings.update([['channels.modlog', chan], ['toggles.modlog', true]]);
      return message.channel.send(message.language.get('CMD_MODLOGS_ENABLED', message.guild.settings.channels.modlog));
    }

    await message.guild.settings.update('toggles.modlog', !toggle);
    return message.channel.send(message.language.get('CMD_MODLOGS_TOGGLE', !toggle));
  }
};
