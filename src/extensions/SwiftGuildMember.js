const { Structures } = require('discord.js');

module.exports = Structures.extend('GuildMember', (GuildMember) => {
  class SwiftGuildMember extends GuildMember {
    constructor(...args) {
      super(...args);

      this.settings = this.client.gateways.members.get(`${this.guild.id}.${this.id}`, true);
    }
    get fullID() { // message.guild.id-guildMember.id
      return `${this.guild.id}-${this.id}`;
    }
    get authorID() {
      return this.id;
    }

    get global() {
      return this.client.globalStats.ensure(this.authorID, { user: this.id, bgOwned: [{ id: 'u99szc72kw1nw', n: 'default', c: '#7f7f7f' }], bgUsing: { id: 'u99szc72kw1nw', c: '#7f7f7f' }, about: 'Write About Yourself.', xp: 0, points: 0 });
    }

    get profile() {
      return this.client.pointsXP.ensure(this.fullID, { user: this.id, guild: this.guild.id, points: 50, xp: 0, level: 0, txp: 100, oxp: 0, daily: Date.now() });
    }

    get spamCount() {
      return this.client.spamCount.ensure(this.authorID, { inv: 0, links: 0, caps: 0, emotes: 0, swear: 0, mention: 0, msg: 0 });
    }

    get reminders() {
      return this.client.reminders.findAll('id', this.id) || null;
    }

    addPoints(points) {
      return this.client.pointsXP.math(this.fullID, '+', points, 'points');
    }
    removePoints(points) {
      return this.client.pointsXP.math(this.fullID, '-', points, 'points');
    }
    addExp(xp) {
      return this.client.pointsXP.math(this.fullID, '+', xp, 'xp');
    }
    removeExp(xp) {
      return this.client.pointsXP.math(this.fullID, '-', xp, 'xp');
    }
    incLevel() {
      return this.client.pointsXP.inc(this.fullID, 'level');
    }
    decLevel() {
      return this.client.pointsXP.dec(this.fullID, 'level');
    }

    // Global Stats
    setAbout(text) {
      return this.client.globalStats.setProp(this.authorID, 'about', text);
    }
    deposit(amt) {
      return this.client.globalStats.math(this.authorID, '+', amt, 'points');
    }
  }
  return SwiftGuildMember;
});
