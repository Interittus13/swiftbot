const ms = require('ms');
const { Command, ModLog } = require('../../index');

class Mute extends Command {
  constructor(...args) {
    super(...args, {
      name: 'mute',
      description: language => language.get('CMD_MUTE_DESCRIPTION'),
      extended: language => language.get('CMD_MUTE_EXTENDED'),
      aliases: ['unmute'],
      usage: 'mute <@User> [time] [reason]',
      category: 'Moderation',
      example: ['mute @_Interittus13_ 2h Shitposting',
        'mute @_Interittus13_ 10days you deserve it'],
      permLevel: 4,
      requiredPerms: ['EMBED_LINKS', 'MANAGE_ROLES'],
    });
  }

  async run(message, [user, time, ...reason]) {
    const target = await this.client.resolveMember(message, user);
    const limit = !time || isNaN(ms(time)) ? ms('1h') : ms(time);
    const reas = time && isNaN(ms(time)) ? time : reason.join(' ').length > 0 ? reason.join(' ') : '';

    if (!target) return message.reply(message.language.get('CMD_MUTE_NO_USER')).then(this.cmdError(message, this.name));

    // Moderation filter
    if (target.user.bot) return message.reply('*You can\'t moderate bots.*');
    if (target.id === message.author.id) return message.reply('**You can\'t mute yourself !!!**');
    if (message.guild.me.roles.highest.position <= target.roles.highest.position) return message.reply('**You can\'t perform that action on someone of equal, or higher role.**');

    try {
      const muteRole = message.guild.roles.cache.find(r => r.name === 'Muted');
      // if (!muteRole) return message.channel.send(`${this.client.config.emojis.error} Can't find Muted role.`);

      if (target.roles.cache.has(muteRole.id)) {
        await target.roles.remove(muteRole.id);
        return message.channel.send(`${target} is un-muted!`);
      }

      await target.roles.add(muteRole);

      const timer = Date.now() + limit;

      await new ModLog(message.guild)
        .setType('mute')
        .setId(timer)
        .setModerator(message.author)
        .setReason(reas)
        .setUser(target.user)
        .setMuteDuration(limit)
        .send();

      if (limit) await this.client.schedule.create('timedMute', timer, { data: { guildID: message.guild.id, userID: target.id, lookupID: timer }, catchUp: true });
      return message.channel.send(`**${target.user.tag} is Muted${reas ? ` for ${reas}` : ''}.**`);
    } catch (e) {
      this.client.logger.warn(e);
    }
  }
}

module.exports = Mute;
