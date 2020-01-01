const { Command } = require('../../index');

module.exports = class extends Command {
  constructor(...args) {
    super(...args, {
      name: 'profile',
      description: language => language.get('CMD_WARN_DESCRIPTION'),
      usage: '<@User> <reason>',
      category: 'Profiles',
      example: ['@_Interittus13_ stop spamming'],
      requiredPerms: ['EMBED_LINKS'],
    });
  }

  async run(message, args) {
    // message.delete();
    const member = args[0] ? await this.client.resolveMember(message, args[0]) : message.member;

    if (member.user.bot) return message.channel.send(message.language.get('ERR_USER_ISBOT', message.author));

    return message.channel.send(`${member} is having Rank ${member.settings.rank}`);
  }
};
