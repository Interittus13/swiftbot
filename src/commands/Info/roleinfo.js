const { MessageEmbed } = require('discord.js');
const { Command } = require('../../index');

class roleInfo extends Command {
  constructor(...args) {
    super(...args, {
      name: 'roleinfo',
      description: language => language.get('CMD_ROLEINFO_DESCRIPTION'),
      usage: 'roleinfo <role>',
      requiredPerms: ['EMBED_LINKS'],
      cooldown: 20,
    });
  }

  async run(message, args) {
    const role = await this.client.resolveRole(message, args.join(' '));
    // const role = message.guild.roles.find('name', args.join(' '));
    if (!role) return this.cmdError(message, this.name);

    const roleHex = role.hexColor.split('#');
    const roleColor = `https://serux.pro/rendercolour?hex=${roleHex[1]}`;

    const embed = new MessageEmbed()
      .setTitle(`Role Info @${role.name}`)
      .setDescription(`${role}\n**ID:** ${role.id}`)
      .addField('Position', `${role.position}`, true)
      .addField('Members', `${role.members.size}`, true)
      .addField('Color', role.hexColor, true)
      .addField('Mentionable', role.mentionable ? 'Yes' : 'No', true)
      .addField('Hoisted', role.hoist ? 'Yes' : 'No', true)
      .addField('Managed', role.managed ? 'Yes' : 'No', true)
      .addField('Created At', role.createdAt.toLocaleString('en-US', { dateStyle: 'long', timeStyle: 'medium' }))
      .setThumbnail(role.color ? roleColor : '')
      .setColor(role.color ? role.color : '');
    message.channel.send({ embeds: [embed] });
  }
}

module.exports = roleInfo;
