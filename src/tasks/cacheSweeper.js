const { Task } = require('../index');
const { SnowflakeUtil } = require('discord.js');

const THRESHOLD = 1000 * 60 * 10;

module.exports = class extends Task {
  constructor(...args) {
    super(...args);
    this.HEADER = '\u001B[39m\u001B[94m[SWIFT CACHE SWEEP]\u001B[39m\u001B[90m';
  }

  async run() {
    const OLD_SNOWFLAKE = SnowflakeUtil.generate(Date.now() - THRESHOLD);
    let guildMembers = 0;
    let emojis = 0;
    let lastMessages = 0;
    let users = 0;

    // Per-Guild Sweep
    for (const guild of this.client.guilds.cache.values()) {
      // Clear members that haven't send any messages in last 30 Minutes.
      const { me } = guild;
      for (const [id, member] of guild.members.cache) {
        if (member === me) continue;
        if (member.voice.channelID) continue;
        if (member.lastMessageID && member.lastMessageID > OLD_SNOWFLAKE) continue;
        guildMembers += 1;
        guild.members.cache.delete(id);
      }

      // Clear emojis
      emojis += guild.emojis.cache.size;
      guild.emojis.cache.clear();
    }

    // Per-Channel Sweep
    for (const channel of this.client.channels.cache.values()) {
      if (!channel.lastMessageID) continue;
      channel.lastMessageID = null;
      lastMessages += 1;
    }

    // Per-User Sweep
    for (const user of this.client.users.cache.values()) {
      if (user.lastMessageID && user.lastMessageID > OLD_SNOWFLAKE) continue;
      this.client.users.cache.delete(user.id);
      users += 1;
    }

    // Log
    this.client.logger.debug(`${this.HEADER} \n${
      this.setColor(guildMembers)} [GuildMember]s \n${
      this.setColor(users)} [User]s \n${
      this.setColor(lastMessages)} [Last Message]s \n${
      this.setColor(emojis)} [Emoji]s`);
  }

  /**
     * Console color depending on the amount
     * > 1000 : Light Red
     * > 100  : Light Yellow
     * < 100  : Green
     */
  setColor(number) {
    const text = String(number).padStart(5, ' ');
    if (number > 1000) return `\u001B[39m\u001B[91m${text}\u001B[39m\u001B[90m`;
    if (number > 100) return `\u001B[39m\u001B[93m${text}\u001B[39m\u001B[90m`;
    return `\u001B[39m\u001B[32m${text}\u001B[39m\u001B[90m`;
  }

  async init() {
    if (!this.client.schedule.tasks.some(task => task.taskName === 'cacheSweeper')) {
      await this.client.schedule.create('cacheSweeper', '*/10 * * * *');
    }
  }
};
