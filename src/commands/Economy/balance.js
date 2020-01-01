const { Command } = require('../../index');

module.exports = class extends Command {
  constructor(...args) {
    super(...args, {
      name: 'balance',
      description: language => language.get('CMD_BAL_DESCRIPTION'),
      usage: 'balance [@user]',
      aliases: ['credits', 'pocket', 'bal'],
    });
  }

  async run(message, args) {
    if (!message.settings.socialSystem) return message.channel.send(message.language.get('ERROR_SOCIAL_DISABLED'));

    const member = args[0] ? await this.client.resolveMember(message, args[0]) : message.member;

    if (member.user.bot) return message.channel.send(message.language.get('ERR_BOT_ISUSER', message.author));

    const score = member.profile.points;

    if (member === message.member) message.channel.send(message.language.get('CMD_BAL_SELF', message.member.user.username, score));
    else message.channel.send(message.language.get('CMD_BAL_SOMEONE', member.user.username, score));
  }
};
