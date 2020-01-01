const Discord = require('discord.js');
const { Command } = require('../../index');

class ServerInfo extends Command {
  constructor(...args) {
    super(...args, {
      name: 'serverinfo',
      description: language => language.get('CMD_SERVERINFO_DESCRIPTION'),
      usage: 'serverinfo',
      aliases: ['guildinfo', 'serverstats'],
      requiredPerms: ['EMBED_LINKS'],
      cooldown: 20,
    });
  }

  async run(message, args, perms) {
    let tc = 0, vc = 0, cat = 0;
    message.guild.channels.cache.map(r => r.type === 'text' ? tc++ : r.type === 'voice' ? vc++ : r.type === 'category' ? cat++ : '');

    const bots = message.guild.members.cache.filter(m => m.user.bot).size;
    const humans = message.guild.memberCount - bots;

    const embed = new Discord.MessageEmbed()
      .setAuthor(message.guild.name, message.guild.iconURL({ dynamic: true }))
      .setColor(3447003)
      .setThumbnail(message.guild.iconURL({ dynamic: true }))
      .addField('ID', message.guild.id, true)
      .addField('Owner', `<@${message.guild.ownerID}>`, true)
      .addField('Verification Level', `${message.guild.verificationLevel}`, true)
      .addField(`Channels [${tc + vc + cat}]`, `Category: ${cat}\nText: ${tc}\nVoice: ${vc}`, true)
      .addField(`Members [${message.guild.memberCount}]`, `Humans: ${humans}\nBots: ${bots}`, true)
      .addField('Server Boosts', `Level: ${message.guild.premiumTier}\nBoosts: ${message.guild.premiumSubscriptionCount}`, true)
      .addField('Created On', message.guild.createdAt.toLocaleString('en-US', { dateStyle: 'long', timeStyle: 'medium' }))
      .addField(`Roles [${message.guild.roles.cache.size}]`, message.guild.roles.cache.map(r => r.name).join(',  '))

    message.channel.send({ embeds: [embed] });
  }
}

module.exports = ServerInfo;
