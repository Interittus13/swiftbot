const { Command } = require('../../index');
const ms = require('ms');

class LiftChannelLockDown extends Command {
  constructor(...args) {
    super(...args, {
      name: 'unlock',
      description: language => language.get('CMD_UNLOCK_DESCRIPTION'),
      extended: language => language.get('CMD_UNLOCK_EXTENDED'),
      usage: 'unlock <#channel> [time] <message>',
      category: 'Moderation',
      permLevel: 'Moderator',
      aliases: ['lockdown'],
      botPerms: ['MANAGE_SERVER', 'EMBED_LINKS'],
      example: ['lock #general we will be back soon.'],
    });
  }


  async run(message, [chan, ...msg], perms) {
    if (!chan) return this.cmdError(message, this.name);

    const channel = await this.resolveChannel(message.guild, chan);
    const reason = msg.join(' ');

    if (!channel) return message.channel.send('Cant find channel');
    // const readableTime = await this.client.utils.parseTime(time);
    const role = message.guild.roles.find(n => n.name === '@everyone');

    if (channel.permissionsFor(role).has('SEND_MESSAGES')) return message.channel.send(message.language.get('CMD_UNLOCK_ERROR'));
    await channel.updateOverwrite(role, { SEND_MESSAGES: true }, 'Channel lockdown lifted.').catch(() => null);
    await channel.send(message.language.get('CMD_UNLOCK_MSG', reason));
    await this.client.moderate.buildModLog(message, 'ul', channel, message.author, reason);
    return message.channel.send(message.language.get('CMD_UNLOCK_SUCCESS', channel));

    /* try {
    } catch (error) {
      this.client.logger.warn(error);
    } */
  }
}

module.exports = LiftChannelLockDown;
