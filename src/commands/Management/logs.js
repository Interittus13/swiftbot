const { Command } = require('../../index');

module.exports = class extends Command {
  constructor(...args) {
    super(...args, {
      description: language => language.get('CMD_LOGS_DESCRIPTION'),
      extended: language => language.get('CMD_LOGS_EXTENDED'),
      usage: '[#channel]',
      aliases: ['logging', 'togglelog'],
      example: ['', '#channel'],
      permLevel: 6,
    });
  }
  async run(message, [channel]) {
    const toggle = message.guild.settings.get('toggles.log');
    const logChannel = message.guild.settings.get('channels.log');

    if (channel && toggle) {
      const chan = this.client.resolveChannel(message, channel);
      if (!chan) throw message.language.get('ERROR_INVALID_CHANNEL', chan);

      await message.guild.settings.update('channels.log', chan);
      return message.channel.send(message.language.get('CMD_LOGS_CHANNEL_UPDATED', message.guild.settings.get('channels.log')));
    }

    if (!toggle && !logChannel) {
      if (!channel) throw 'Please specify a channel.';
      const chan = await this.client.resolveChannel(message, channel);
      if (!chan) throw message.language.get('ERROR_INVALID_CHANNEL', chan);

      await message.guild.settings.update([['channels.log', chan], ['toggles.log', true]]);
      return message.channel.send(message.language.get('CMD_LOGS_ENABLED', message.guild.settings.channels.logs));
    }

    await message.guild.settings.update('toggles.log', !toggle);
    return message.channel.send(message.language.get('CMD_LOGS_TOGGLE', !toggle));
  }
};
