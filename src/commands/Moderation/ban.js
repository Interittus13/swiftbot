const { Command } = require('../../index');

class Ban extends Command {
  constructor(...args) {
    super(...args, {
      name: 'ban',
      description: language => language.get('CMD_BAN_DESCRIPTION'),
      extended: language => language.get('CMD_BAN_EXTENDED'),
      usage: 'ban <@user> <reason>',
      category: 'Moderation',
      permLevel: 'Administrator',
      botPerms: ['EMBED_LINKS', 'MANAGE_MESSAGES', 'BAN_MEMBERS'],
      example: ['ban @_Interittus13_ fuck off'],
    });
  }

  async run(message, args, perms) {
    message.delete();
    if (!args.length) return message.channel.send(message.language.get('CMD_BAN_NO_USER')).then(this.cmdError(message, this.name));
    const target = await this.verifyMember(message, args[0]);
    if (!target) return message.channel.send(message.language.get('CMD_BAN_USER_MISS'));

    const modLevel = this.client.moderate.modCheck(message, target, perms);
    if (typeof modLevel === 'string') return message.reply(modLevel);

    const reason = args.slice(1, args.length).join(' ');
    if (!reason) return message.channel.send(message.language.get('CMD_BAN_NO_REASON'));

    try {
      await target.ban({ days: 2, reason });
      await message.channel.send(`${this.client.config.emojis.success} **${target.user.tag} was Banned.**`);
      await target.send(`**${target.user.tag}**, you have been banned from **${message.guild.name}** for _${reason}_`);
      await this.client.moderate.buildModLog(message, 'ba', target, message.author, reason);
    } catch (e) {
      this.client.logger.warn(e);
    }
    // if (!message.guild.member(target).bannable) return message.reply(`${emoji[1]} This member is not bannable.`);
  }
}

module.exports = Ban;
