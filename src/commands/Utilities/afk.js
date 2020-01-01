const Discord = require('discord.js');
const { Command } = require('../../index');

class AFK extends Command {
  constructor(...args) {
    super(...args, {
      description: language => language.get('CMD_AFK_DESCRIPTION'),
      usage: 'afk [message]',
      example: ['afk',
        'afk I\'m sleeping',
        'afk kinda busy'],
      requiredPerms: ['EMBED_LINKS'],
    });
  }

  async run(message, reason) {
    reason = reason.length ? reason.join(' ') : 'will be back soon';

    await message.author.settings.update([['afk.time', Date.now()], ['afk.reason', reason]]);

    const embed = new Discord.MessageEmbed()
      .setColor(0xA12D3D)
      .setDescription(`**AFK Message :** ${reason}`);
    message.channel.send(message.language.get('SET_AFK_SUCCESS', message.author.username), { embeds: [embed] });

    // if (message.guild.member(this.client.user.id).highestRole.position >= message.member.highestRole.position) {
    //   if (!message.guild.member(message.author.id).nickname) {
    //     name = message.guild.member(message.author.id).displayName;
    //   } else name = message.guild.member(message.author.id).nickname;
    // }
    // if (message.author.id !== message.guild.owner.id) message.guild.member(message.author.id).setNickname(`[AFK] ${name}`);
  }
}

module.exports = AFK;
