const { Command } = require('../../index');

class ToggleAutoRole extends Command {
  constructor(...args) {
    super(...args, {
      description: language => language.get('CMD_AUTOROLE_DESCRIPTION'),
      extended: language => language.get('CMD_AUTOROLE_EXTENDED'),
      usage: '[role-name]',
      example: ['', 'autorole subscribers'],
      permLevel: 6,
      subcommands: true,
    });
  }
  async run(message, [value]) {
    if (value && value.length) return this.role(message, value.join(' '));
    return this.toggle(message);
  }

  async toggle(message) {
    const toggle = !message.guild.settings.get('toggles.autorole');
    await message.guild.settings.update('toggles.autorole', toggle);

    const roleInfo = await message.guild.settings.get('roles.autorole') ? message.guild.roles.cache.get(await message.guild.settings.get('roles.autorole').join('\n')) : null;
    return message.channel.send(message.language.get('CMD_AUTOROLE_TOGGLE', toggle, roleInfo));
  }

  async role(message, [value]) {
    const role = await this.client.resolveRole(message, value);
    if (!role) throw message.language.get('ERROR_INVALID_ROLE', value);

    if (message.guild.settings.get('roles.autorole').indexOf(role.id) !== -1) {
      return message.guild.settings.update('roles.autorole', role, message.guild)
        .then(() => {
          message.channel.send(`${role} removed from Autorole.`);
        });
    }

    return message.guild.settings.update('roles.autorole', role, message.guild)
      .then(() => {
        message.channel.send(`${role} added to Autorole.`);
      });
  }
}

module.exports = ToggleAutoRole;
