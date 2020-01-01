const { Command } = require('../../index');
const ms = require('ms');

class channelLockDown extends Command {
  constructor(...args) {
    super(...args, {
      name: 'lock',
      description: language => language.get('CMD_LOCKDOWN_DESCRIPTION'),
      extended: language => language.get('CMD_LOCKDOWN_EXTENDED'),
      usage: 'lock <#channel> [time] <message>',
      category: 'Moderation',
      permLevel: 'Moderator',
      aliases: ['lockdown'],
      botPerms: ['MANAGE_SERVER', 'EMBED_LINKS'],
      example: ['lock #general we will be back soon.'],
    });
  }


  async run(message, [chan, limit, ...msg], perms) {
    if (!chan) return this.cmdError(message, this.name);

    const channel = await this.resolveChannel(message.guild, chan);
    const time = !limit || isNaN(ms(limit)) ? ms('1h') : ms(limit);
    const reason = limit && isNaN(ms(limit)) ? `${limit} ${msg.join(' ')}` : msg.join(' ');

    if (!channel) return message.channel.send('Cant find channel');
    const readableTime = await this.client.utils.parseTime(time);
    const role = message.guild.roles.find(n => n.name === '@everyone');

    if (!channel.permissionsFor(role).has('SEND_MESSAGES')) return message.channel.send(message.language.get('CMD_LOCKDOWN_ERROR', channel));
    await channel.updateOverwrite(role, { SEND_MESSAGES: false }, `Channel lockdown for ${readableTime}`).catch(() => null);
    await channel.send(message.language.get('CMD_LOCKDOWN_MSG', reason));
    await this.client.moderate.buildModLog(message, 'ld', channel, message.author, reason, time);
    return message.channel.send(message.language.get('CMD_LOCKDOWN_SUCCESS', channel));

    /* try {
    } catch (error) {
      this.client.logger.warn(error);
    } */
  }
}

module.exports = channelLockDown;
