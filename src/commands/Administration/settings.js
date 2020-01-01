const { MessageEmbed } = require('discord.js');
const { Command } = require('../../index');

module.exports = class extends Command {
  constructor(...args) {
    super(...args, {
      description: language => language.get('CMD_SETTINGS_DESCRIPTION'),
      aliases: ['setting'],
      guarded: true,
      permLevel: 6,
    });
  }

  async run(message) {
      const { settings } = message.guild;

      const embed = new MessageEmbed()
      .setAuthor(`${message.guild.name} settings`, message.guild.iconURL({ dynamic: true }))
      .addFields(
          { name: 'Prefix', value: settings.prefix, inline: true },
          { name: 'Mod Log', value: settings.toggles.modlog ? `<#${settings.channels.modlog}>` : 'Disabled', inline: true },
          { name: 'Log', value: settings.toggles.log ? `<#${settings.channels.log}>` : 'Disabled', inline: true },
          { name: 'Auto Role', value: settings.toggles.autorole ? settings.roles.autorole.length ? `<@&${settings.roles.autorole.join('>\n<@&')}` : 'None' : 'Disabled', inline: true },
          { name: 'Level Role', value: settings.toggles.levelrole ? settings.roles.levelrole.length ? `${settings.roles.levelrole.map(r => `${message.guild.roles.cache.get(r.id) || 'Deleted Role'} - Level ${r.lvl}`).join('\n')}` : 'None' : 'Disabled', inline: true },
          { name: 'Pinboard', value: settings.toggles.pinboard ? `<#${settings.pinboard.channel}>` : 'Disabled', inline: true },
      )
    return message.reply({ embeds: [embed] });
  }
};
