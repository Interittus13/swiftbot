const { Command } = require('../../index');

module.exports = class extends Command {
  constructor(...args) {
    super(...args, {
      description: language => language.get('CMD_PINBOARD_DESCRIPTION'),
      extended: language => language.get('CMD_PINBOARD_EXTENDED'),
      usage: '<#channel> | <pins 3>',
      example: ['', '#Channel', 'pins 4'],
      permLevel: 6,
    });
  }

  async run(message, [channel]) {
    const toggle = message.guild.settings.get('toggles.pinboard');
    const pinChannel = message.guild.settings.get('channels.pinboard');

    if (channel && toggle) {
      const chan = this.client.resolveChannel(message, channel);
      if (!chan) throw message.language.get('ERROR_INVALID_CHANNEL', chan);

      await message.guild.settings.update('channels.pinboard', chan);
      return message.channel.send(message.language.get('CMD_PINBOARD_CHANNEL_UPDATED', message.guild.settings.get('channels.pinboard')));
    }

    if (!toggle && !pinChannel) {
      if (!channel) throw 'Please specify a channel.';
      const chan = await this.client.resolveChannel(message, channel);
      if (!chan) throw message.language.get('ERROR_INVALID_CHANNEL', chan);

      await message.guild.settings.update([['channels.pinboard', chan], ['toggles.pinboard', true]]);
      return message.channel.send(message.language.get('CMD_PINBOARD_ENABLED', message.guild.settings.channels.pinboard));
    }

    await message.guild.settings.update('toggles.pinboard', !toggle);
    return message.channel.send(message.language.get('CMD_PINBOARD_TOGGLE', !toggle));
  }

  async pins(message, pins) {
    if (pins < 1) return message.channel.settings('Can not be less than 1');

    await message.guild.settings.update('pinboard.required', pins);
    return message.channel.send('Pinboard has been enabled.');
  }
};
