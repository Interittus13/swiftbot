const { Command } = require('../../index');
const { MessageEmbed } = require('discord.js');
const ms = require('ms');

class ModLogs extends Command {
  constructor(...args) {
    super(...args, {
      name: 'history',
      description: language => language.get('CMD_HISTORY_DESCRIPTION'),
      usage: 'history <@user>',
      category: 'Moderation',
      permLevel: 'Administrator',
      botPerms: ['EMBED_LINKS'],
      aliases: ['violations', 'warnings'],
      example: ['ban @_Interittus13_ fuck off'],
    });
  }

  async run(message, args, perms) {
    const target = await this.verifyMember(message, args[0]);

    const logs = this.client.modLogs;
    let sort;

    const embed = new MessageEmbed()
      .setColor('ORANGE')
      .setFooter('Swift Bot');

    if (!target) {
      sort = logs.filter(f => f.guild === message.guild.id).array();
      embed.setAuthor(message.guild.name, message.guild.iconURL());

      if (!sort.length) embed.setDescription('No member has committed any violations in this server.');

      sort.forEach(async (s) => {
        const t = this.client.users.get(s.target).tag;
        embed.addField(`${t} (${s.type})`, `Moderator: <@${s.moderator}>\nReason: ${s.reason}\n${s.time ? `Muted for: ${ms(s.time, { long: true })}\n` : ''}Case: ${s.case}`);
      });
    } else {
      sort = logs.filter(f => f.target === target.id).array();
      embed.setAuthor(target.user.tag, target.user.displayAvatarURL());

      if (!sort.length) embed.setDescription('This member has not committed any violations.');

      sort.forEach((s) => {
        embed.addField(`Case: ${s.case} (${s.type})`, `Moderator: <@${s.moderator}>\nReason: ${s.reason}\n${s.time ? `Muted for: ${ms(s.time, { long: true })}` : ''}`, true);
      });
    }
    message.channel.send({ embed });
  }
}

module.exports = ModLogs;
