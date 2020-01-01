const { Command } = require('../../index');

class SoftBan extends Command {
  constructor(...args) {
    super(...args, {
      name: 'softban',
      description: language => language.get('CMD_SBAN_DESCRIPTION'),
      extended: language => language.get('CMD_SBAN_EXTENDED'),
      usage: 'softban <@user> [reason]',
      aliases: ['hardkick'],
      category: 'Moderation',
      permLevel: 'Moderator',
      botPerms: ['MANAGE_MESSAGES', 'KICK_MEMBERS', 'EMBED_LINKS'],
      example: ['softban @_Interittus13_ fuck off'],
    });
  }

  async run(message, args, perms) {
    message.delete();
    if (!args.length) return message.channel.send(message.language.get('CMD_SBAN_NO_USER')).then(this.cmdError(message, this.name));
    const target = await this.verifyMember(message.guild, args[0]);
    if (!target) return message.channel.send(message.language.get('CMD_SBAN_USER_MISS'));

    const modLevel = this.client.moderate.modCheck(message, target, perms);
    if (typeof modLevel === 'string') return message.reply(modLevel);

    const reason = args.slice(1, args.length).join(' ') || 'No reason supplied.';

    try {
      await target.ban({ days: 2, reason });
      await message.channel.send(`${this.client.config.emojis.success} **${target.user.tag} was softbanned.**`);
      await message.guild.members.unban(target);
      await this.client.moderate.buildModLog(message, 'so', target, message.author, reason);
    } catch (e) {
      this.client.logger.warn(e);
    }
  }
}

module.exports = SoftBan;
