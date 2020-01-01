const { Command } = require('../../index');
const { Role, MessageEmbed } = require('discord.js');

module.exports = class extends Command {
  constructor(...args) {
    super(...args, {
      description: language => language.get('CMD_MODS_DESCRIPTION'),
      aliases: ['managemod', 'mod'],
      example: ['add admin-role', 'remove admin-role'],
      subcommands: true,
      permLevel: 6,
      usage: '[list | add | remove]',
      requiredPerms: ['USE_EXTERNAL_EMOJIS', 'EMBED_LINKS'],
    });
  }

  async run(message, [action]) {
    if (['show'].includes(action)) return this.list(message);
    return this.list(message);
  }

  async add(message, admin) {
    if (!admin.length) return message.channel.send(message.language.get('CMD_MODS_ARGS_MISSING'));

    const memberOrRole = await this.resolve(message, admin.join(' '));
    if (!memberOrRole) return message.channel.send(message.language.get('CMD_MODS_ARGS_INVALID', admin.join(' ')));

    const type = memberOrRole instanceof Role ? 'role' : 'member';

    if (type === 'member') {
      if (message.guild.settings.get('users.mod').includes(memberOrRole.id)) throw message.language.get('CMD_MODS_EXISTS', memberOrRole);
      await message.guild.settings.update('users.mod', memberOrRole, { arrayAction: 'add', guild: message.guild });
      // return message.channel.send(message.language.get('CMD_MODS_ADDED', memberOrRole));
    }

    if (type === 'role') {
      if (message.guild.settings.get('roles.mod') === memberOrRole.id) throw message.language.get('CMD_MODS_EXISTS', memberOrRole);
      await message.guild.settings.update({ roles: { mod: memberOrRole } }, message.guild);
      // return message.channel.send(message.language.get('CMD_MODS_ADDED', memberOrRole.name));
    }

    return message.channel.send(message.language.get('CMD_MODS_ADDED', memberOrRole));
  }

  async remove(message, admin) {
    if (!admin.length) return message.channel.send(message.language.get('CMD_ADMINS_ARGS_MISSING'));

    const memberOrRole = await this.resolve(message, admin.join(' '));
    if (!memberOrRole) return message.channel.send(message.language.get('CMD_ADMINS_ARGS_INVALID', admin.join(' ')));

    const type = memberOrRole instanceof Role ? 'role' : 'member';

    if (type === 'member') {
      if (!message.guild.settings.get('users.admin').includes(memberOrRole.id)) throw message.language.get('CMD_ADMINS_MISSING', memberOrRole);
      await message.guild.settings.update('users.admin', memberOrRole, { arrayAction: 'remove', guild: message.guild });
      // return message.channel.send(`${memberOrRole} has been added as an Administrator.`);
    }

    if (type === 'role') {
      if (message.guild.settings.get('roles.admin') !== memberOrRole.id) throw message.language.get('CMD_ADMINS_MISSING', memberOrRole);
      await message.guild.settings.reset('roles.admin', memberOrRole);
      // return message.channel.send(message.language.get('CMD_ADMINS_REMOVED', memberOrRole));
    }

    return message.channel.send(message.language.get('CMD_ADMINS_REMOVED', memberOrRole));
  }

  list(message) {
    const role = message.guild.settings.get('roles.admin');
    const users = message.guild.settings.get('users.admin');

    const embed = new MessageEmbed()
      .setAuthor(`${message.guild.name} Swift's Administrators`)
      .addField('Role', `${role ? `${message.guild.roles.cache.get(role)}` : 'None'}`, true)
      .addField('Members', `${users.length ? `<@${users.join('>\n <@')}>` : 'None'}`, true);

    return message.channel.send({ embeds: [embed] });
  }

  async resolve(message, memberOrRole) {
    const member = await this.client.resolveMember(message, memberOrRole);
    if (member) return member;

    const role = await this.client.resolveRole(message, memberOrRole);
    if (role) return role;

    return false;
  }
};
