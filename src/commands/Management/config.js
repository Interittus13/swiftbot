const Command = require('../../structure/Command.js');
const { MessageEmbed } = require('discord.js');

class ViewConfiguration extends Command {
  constructor(...args) {
    super(...args, {
      name: 'config',
      description: language => language.get('CMD_CONFIG_DESCRIPTION'),
      usage: 'config',
      category: 'Configuration',
      aliases: ['setting', 'settings', 'viewsettings'],
      permLevel: 'Moderator',
    });
    this.validKeys = ['antiInvites', 'antiWebLinks', 'antiMentionSpam', 'antiCaps', 'antiSwearing'];
  }

  async autoMod(message) {
    const res = [];
    for (let i = 0; i < this.validKeys.length; i++) {
      if (message.settings[this.validKeys[i]]) res.push(`${this.validKeys[i]} Enabled`);
      else res.push(`${this.validKeys[i]} Disabled`);
    }
    return res.join('\n           ');
  }

  async run(message, args, perms) {
    try {
      const embed = new MessageEmbed()
        .setAuthor(`${message.guild.name} Server Settings`, message.guild.iconURL())
        .addField('Prefix', message.settings.prefix, true)
      // .addField('Language', message.settings.general.lang, true)
        .addField('Welcome', message.settings.welcome ? `<#${message.settings.welcomeChannel}>` : 'Disabled', true)
        .addField('Auto Role', message.settings.autoRole ? `<@&${message.settings.role}>` : 'Disabled', true)
        .addField('Admin Role', message.settings.adminRole, true)
        .addField('Manager Role', message.settings.modRole, true)
        .addField('Logs Channel', message.settings.logs ? `<#${message.settings.logChannel}>` : 'Disabled', true)
        .addField('Mod Logs Channel', message.settings.modLogs ? `<#${message.settings.modLogChannel}>` : 'Disabled', true)
        .addField('NSFW', message.settings.nsfw ? `<#${message.settings.nsfwChannel}>` : 'Disabled', true)
        .addField('Economy', message.settings.socialSystem ? 'Enabled' : 'Disabled', true);
      if (message.settings.socialSystem) embed.addField('Levelled Roles', message.settings.levelledRoles ? 'Enabled' : 'Disabled', true);
      embed.addField('Starboard', message.settings.starboard ? `<#${message.settings.starboardChannel}>` : 'Disabled', true)
        .addField('Auto Moderation', await this.autoMod(message), true)
        .setColor(message.member.displayHexColor)
        .setFooter(`Bot Language: ${message.language.getLang()}`);

      message.channel.send(embed);
    } catch (e) {
      this.client.logger.warn(e);
    }
  }
}

module.exports = ViewConfiguration;
