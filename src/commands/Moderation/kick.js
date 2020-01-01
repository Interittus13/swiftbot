const { Command } = require('../../index');

class Kick extends Command {
  constructor(...args) {
    super(...args, {
      name: 'kick',
      description: language => language.get('CMD_KICK_DESCRIPTION'),
      extended: language => language.get('CMD_KICK_EXTENDED'),
      usage: 'kick <@user> <reason>',
      category: 'Moderation',
      permLevel: 'Moderator',
      requiredPerms: ['MANAGE_MESSAGES', 'KICK_MEMBERS', 'EMBED_LINKS'],
      example: ['kick @_Interittus13_ spamming'],
    });
  }


  async run(message, args, perms) {
    message.delete();
    if (!args.length) return message.channel.send(message.language.get('CMD_KICK_NO_USER')).then(this.cmdError(message, this.name));
    const target = await this.verifyMember(message, args[0]);
    if (!target) return message.channel.send(message.language.get('CMD_KICK_USER_MISS'));

    const modLevel = this.client.moderate.modCheck(message, target, perms);
    if (typeof modLevel === 'string') return message.reply(modLevel);

    const reason = args.splice(1, args.length).join(' ');
    if (!reason) return message.channel.send(message.language.get('CMD_KICK_NO_REASON'));

    try {
      await target.kick({ reason });
      await message.channel.send(`${this.client.config.emojis.success} **${target.user.username} was Kicked for ${reason}**`);
      await target.send(`**${target.user.tag}**, you have been kicked from **${message.guild.name}'s server** for _${reason}_`);
      await this.client.moderate.buildModLog(message, 'ki', target, message.author, reason);
    } catch (error) {
      this.client.logger.warn(error);
    }
  }
}

module.exports = Kick;
