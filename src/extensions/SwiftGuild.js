const { Structures } = require('discord.js');

module.exports = Structures.extend('Guild', (Guild) => {
  class SwiftGuild extends Guild {
    constructor(...args) {
      super(...args);

      this.settings = this.client.gateways.guilds.get(this.id, true);
    }

    get language() {
      return this.client.languages.get(this.settings.language) || null;
    }

    get store() {
      return this.client.store.findAll('guildId', this.id);
    }

    get serverMod() {
      return this.client.serverMod.ensure(this.id, { excludedRoles: [], levelledRoles: {}, swearWords: [], afk: {}, msgSpam: [] });
    }

    pushSpamMsg(msg) {
      return this.client.serverMod.push(this.id, msg, 'msgSpam');
    }
  }
  return SwiftGuild;
});
