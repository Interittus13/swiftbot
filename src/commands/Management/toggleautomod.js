const { Command } = require('../../index');

class ToggleAutomod extends Command {
  constructor(...args) {
    super(...args, {
      name: 'toggleautomod',
      description: language => language.get('CMD_AUTOMOD_DESCRIPTION'),
      extended: language => language.get('CMD_AUTOMOD_EXTENDED'),
      usage: 'toggleautomod <enable [all | setting-name] | disable [all | setting-name]>',
      category: 'Configuration',
      aliases: ['toggleautomoderation'],
      example: ['toggleautomod enable all',
        'toggleautomod disable all',
        'toggleautomd enable antiLinks',
        'toggleautomod disable antiInvites'],
      permLevel: 'Administrator',
    });
    this.validKeys = ['antiInvites', 'antiWebLinks', 'antiMentionSpam', 'antiCaps', 'antiSwearing', 'antiEmotes'];
  }
  async run(message, [action, ...value], perms) {
    if (action === 'enable' || action === 'on') return this.enableSetting(message, value);
    if (action === 'disable' || action === 'off') return this.disableSetting(message, value);
    return this.cmdError(message, this.name);
  }

  async enableSetting(message, [key]) {
    const settings = this.client.getSettings(message.guild.id);
    if (!key) return message.reply(`Provide a valid key.\n\`\`\`asciidoc\n: valid keys :\n\n${this.validKeys.map(k => k).join(', ')}\`\`\``);
    if (key === 'all') return this.enableAll(message);
    if (!this.validKeys.includes(key) || !this.client.settings.has(message.guild.id, key)) return message.reply(`No automod setting **${key}** exists.`);
    if (settings[key]) return message.reply(`automod setting **${key}** is already enabled.`);
    settings[key] = true;
    this.client.settings.set(message.guild.id, settings);
    return message.reply(`automod setting **${key}** enabled.`);
  }

  async disableSetting(message, [key]) {
    const settings = this.client.getSettings(message.guild.id);
    if (!key) return message.reply(`Provide a valid key.\n\`\`\`asciidoc\n: valid keys :\n\n${this.validKeys.map(k => k).join(', ')}\`\`\``);
    if (key === 'all') return this.disableAll(message);
    if (!this.validKeys.includes(key) || !this.client.settings.has(message.guild.id, key)) return message.reply(`No automod setting **${key}** exists.`);
    if (!settings[key]) return message.reply(`automod setting **${key}** is already disabled.`);
    settings[key] = false;
    this.client.settings.set(message.guild.id, settings);
    return message.reply(`automod setting **${key}** disabled.`);
  }

  async enableAll(message) {
    const settings = this.client.getSettings(message.guild.id);
    for (let i = 0; i < this.validKeys.length; i++) {
      if (!settings[this.validKeys[i]]) settings[this.validKeys[i]] = true;
    }
    this.client.settings.set(message.guild.id, settings);
    message.reply('All automod settings have been enabled.');
  }

  async disableAll(message) {
    const settings = this.client.getSettings(message.guild.id);
    for (let i = 0; i < this.validKeys.length; i++) {
      if (settings[this.validKeys[i]]) settings[this.validKeys[i]] = false;
    }
    this.client.settings.set(message.guild.id, settings);
    message.reply('All automod settings have been disabled.');
  }
}

module.exports = ToggleAutomod;
