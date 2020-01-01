const { Command } = require('../../index');

module.exports = class extends Command {
  constructor(...args) {
    super(...args, {
      description: language => language.get('CMD_PREFIX_DESCRIPTION'),
      usage: '[prefix]',
      aliases: ['prefix', 'changeprefix', 'updateprefix'],
      example: ['+', '!!'],
      category: 'Administration',
      permLevel: 6,
    });
  }

  async run(message, [prefix]) {
    if (!prefix) return message.reply(message.language.get('CMD_PREFIX_GUILD', message.guild.settings.get('prefix')));

    await message.guild.settings.update('prefix', prefix);
    return message.reply(message.language.get('CMD_PREFIX_UPDATED', message.guild.settings.prefix));
  }
};
