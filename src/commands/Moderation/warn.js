const { Command, ModLog } = require('../../index');

class Warn extends Command {
  constructor(...args) {
    super(...args, {
      name: 'warn',
      description: language => language.get('CMD_WARN_DESCRIPTION'),
      usage: 'warn <@User> <reason>',
      category: 'Moderation',
      aliases: ['caution'],
      example: ['warn @_Interittus13_ stop spamming'],
      permLevel: 4,
      requiredPerms: ['EMBED_LINKS'],
    });
  }

  async run(message, args) {
    // message.delete();
    if (!args.length) return message.channel.send(message.language.get('CMD_WARN_NO_USER')).then(this.cmdError(message, this.name));
    const target = await this.client.resolveMember(message, args[0]);
    if (!target) return message.channel.send(message.language.get('CMD_WARN_USER_MISS'));

    // const modLevel = await ModLog.modfilter();
    // if (!modLevel.success) return message.reply(modLevel.res);

    const reason = args.slice(1, args.length).join(' ');

    try {
      await new ModLog(message.guild)
        .setType('warn')
        .setModerator(message.author)
        .setUser(target.user)
        .setReason(reason)
        .send();

      return message.channel.send(`**Warning issued to ${target.user.tag}${reason ? ` for ${reason}` : ''}.**`);
    } catch (e) {
      throw e;
    }
  }
}

module.exports = Warn;
