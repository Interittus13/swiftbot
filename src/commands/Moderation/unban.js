const { Command } = require('../../index');

class Unban extends Command {
  constructor(...args) {
    super(...args, {
      name: 'unban',
      description: language => language.get('CMD_UNBAN_DESCRIPTION'),
      extended: language => language.get('CMD_UNBAN_EXTENDED'),
      usage: 'unban <@user> [reason]',
      category: 'Moderation',
      permLevel: 'Administrator',
      botPerms: ['MANAGE_MESSAGES', 'BAN_MEMBERS', 'EMBED_LINKS'],
      example: ['unban @_Interittus13_ Appealed'],
    });
  }

  async run(message, args, perms) {
    message.delete();
    if (!args.length) return message.channel.send(message.language.get('CMD_UNBAN_NO_USER')).then(this.cmdError(message, this.name));
    const target = await this.verifyUser(message, args[0]);
    if (!target) return message.channel.send(message.language.get('CMD_UNBAN_USER_MISS'));

    const reason = args.slice(1, args.length).join(' ') || 'No reason supplied.';

    try {
      await message.guild.members.unban(target);
      await this.client.moderate.buildModLog(message, 'nb', target, message.author, reason);
    } catch (e) {
      this.client.logger.warn(e);
    }
  }
}

module.exports = Unban;
