const { MessageEmbed } = require('discord.js');
const { Command } = require('../../index');

class ManageLevelRoles extends Command {
  constructor(...args) {
    super(...args, {
      description: language => language.get('CMD_LEVELROLE_DESCRIPTION'),
      extended: language => language.get('CMD_LEVELROLE_EXTENDED'),
      usage: '<role level | list | exclude>',
      aliases: ['managelevelrole', 'levelrole', 'levelledroles'],
      example: ['chatterbox 13', 'exclude Admins', 'list'],
      permLevel: 6,
    });
  }

  async run(message, [role, level]) {
    if (role && role.length) return this.toggle(message, role, level);
    return this.list(message);
  }

  async toggle(message, role, level) {
    const toggle = message.guild.settings.get('toggles.levelrole');
    const roles = message.guild.settings.get('roles.levelrole');

    if (toggle && role) {
      const isRole = await this.client.resolveRole(message, role);
      if (!isRole) throw 'invalid role.';

      const lvlRole = roles.find(r => r.id === isRole.id);
      if (lvlRole) {
        await message.guild.settings.update('roles.levelrole', lvlRole, { action: 'remove' });
        return message.channel.send(`Levelrole <@&${lvlRole.id}> removed`);
      }

      await message.guild.settings.update('roles.levelrole', { id: isRole.id, lvl: level });
      return message.channel.send(`${isRole} added to level ${level}`);
    }

    if (role && !toggle) {
      const isRole = await this.client.resolveRole(message, role);
      if (!isRole) throw 'invalid role.';

      await message.guild.settings.update('toggles.levelrole', true);
      await message.guild.settings.update('roles.levelrole', { id: isRole.id, lvl: level });
      return message.channel.send('Level role added.');
    }
  }

  async list(message) {
    const roles = message.guild.settings.get('roles.levelrole');
    if (!roles.length) throw 'None';

    const embed = new MessageEmbed()
      .setAuthor('Swift\'s - Leveled Roles', message.guild.iconURL({ dynamic: true }))
      .setDescription(roles.map(r => `${message.guild.roles.cache.get(r.id) || 'Role removed'} - Level ${r.lvl}`).join('\n'))
    return message.channel.send({ embeds: [embed] });
  }
}

module.exports = ManageLevelRoles;
