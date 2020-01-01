const { Structures, Collection, Permissions: { FLAGS }, APIMessage } = require('discord.js');
const { regExpEsc } = require('../lib/core/util/util');

module.exports = Structures.extend('Message', (Message) => {
  class SwiftMessage extends Message {
    constructor(...args) {
      super(...args);

      this.command = this.command || null;
      this.commandText = this.commandText || null;
      this.prefix = this.prefix || null;
      this.prefixLength = this.prefixLength || null;
      this.args = this.args || null;
    }

    get reactable() {
      if (!this.guild) return true;
      return this.channel.readable && this.channel.permissionsFor(this.guild.me).has([FLAGS.ADD_REACTIONS, FLAGS.READ_MESSAGE_HISTORY], false);
    }

    async usableCommands() {
      const col = new Collection();
      await Promise.all(this.client.commands.map(command =>
        this.client.inhibitors.run(this, command, true)
          .then(() => { col.set(command.name, command); })
          .catch(() => {
            // noop
          }),
      ));
      return col;
    }

    async hasAtLeastPermissionLevel(min) {
      const { permission } = await this.client.permissionLevels.run(this, min);
      return permission;
    }

    _patch(data) {
      super._patch(data);
      this.language = this.guild ? this.guild.language : this.client.languages.default;
      this.guildSettings = this.guild ? this.guild.settings : this.client.gateways.guilds.defaults;

      this._parseCommand();
    }

    _parseCommand() {
      this.prefix = null;
      this.prefixLength = null;
      this.commandText = null;
      this.command = null;
      this.args = null;

      try {
        const prefix = this._mentionPrefix() || this._customPrefix() || this._naturalPrefix();

        if (!prefix) return;
        const data = this.content.slice(prefix.length).trim().split(/ +/g);

        this.prefix = prefix.regex;
        this.prefixLength = prefix.length;
        this.commandText = data.shift().toLowerCase();
        this.args = data;
        this.command = this.client.commands.get(this.commandText) || null;

        if (!this.command || !this.command.enabled) return;

        // this.prompter = this.command.usage.createPrompt(this, {
        //   flagSupport: this.command.flagSupport,
        //   quotedStringSupport: this.command.quotedStringSupport,
        //   time: this.command.promptTime,
        //   limit: this.command.promptLimit,
        // });
      } catch (error) {
        return;
      }
    }

    _mentionPrefix() {
      const mentionPrefix = this.client.mentionPrefix.exec(this.content);
      return mentionPrefix ? { length: mentionPrefix[0].length, regex: this.client.mentionPrefix } : null;
    }

    _customPrefix() {
      if (!this.guildSettings.prefix) return null;
      for (const prf of Array.isArray(this.guildSettings.prefix) ? this.guildSettings.prefix : [this.guildSettings.prefix]) {
        const testPrf = this.constructor.prefixes.get(prf) || this.constructor.generatePrefix(prf, this.client.options.prefixCaseInsensitive ? 'i' : '');
        if (testPrf.regex.test(this.content)) return testPrf;
      }
      return null;
    }

    _naturalPrefix() {
      if (!this.client.options.regexPrefix) return null;
      const results = this.client.options.regexPrefix.exec(this.content);
      return results ? { length: results[0].length, regex: this.client.options.regexPrefix } : null;
    }

    static generatePrefix(prefix, flags) {
      const prefixObj = { length: prefix.length, regex: new RegExp(`^${regExpEsc(prefix)}`, flags) };
      this.prefixes.set(prefix, prefixObj);
      return prefixObj;
    }
  }

  SwiftMessage.prefixes = new Map();

  return SwiftMessage;
});
