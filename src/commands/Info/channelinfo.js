const Discord = require('discord.js');
const { Command } = require('../../index');

class Channelinfo extends Command {
  constructor(...args) {
    super(...args, {
      name: 'channelinfo',
      description: language => language.get('CMD_CHNLINFO_DESCRIPTION'),
      usage: 'channelinfo [#channel]',
      requiredPerms: ['EMBED_LINKS'],
      cooldown: 20,
    });
  }

  async run(message, args) {
    let channel = await this.resolveChannel(message.guild, args.join(' '));
    if (!channel) channel = message.channel;

    const embed = new Discord.MessageEmbed();

    if (channel.type === 'text') {
      embed.setTitle(`Channel Info #${channel.name}`)
        .setDescription(`${channel}\nID: ${channel.id}`)
        .addField('Channel Topic', channel.topic || 'None')
        .addField('Type', channel.type, true)
        .addField('NSFW', channel.nsfw ? 'Yes' : 'No', true)
        .addField('Category', channel.parent ? channel.parent.name : 'None', true);
    }
    
    if (channel.type === 'voice') {
      embed.setTitle(`Voice Channel Info #${channel.name}`)
        .setDescription(`${channel}\nID: ${channel.id}`)
        .addField('Type', channel.type, true)
        .addField('Category', channel.parent ? channel.parent.name : 'None', true)
        .addField('Bitrate', `${channel.bitrate / 1000} Kbps`, true)
        .addField('User Limit', channel.userLimit ? `${channel.userLimit}` : 'No Limit', true);
    }

    embed.setColor(0x377fd1)
      .addField('Created At', channel.createdAt.toLocaleString());
    message.channel.send({ embeds: [embed] });
  }
}

module.exports = Channelinfo;
