const { Task, ModLog } = require('../index');

module.exports = class extends Task {
  async run({ guildID, userID, lookupID }) {
    const guild = this.client.guilds.cache.get(guildID);
    const member = await guild.members.fetch(userID).catch(() => null);

    if (!guild || !member) return;

    const muteRole = await guild.roles.cache.find(r => r.name === 'Muted');
    const unmute = await member.roles.remove(muteRole).catch(() => null);

    if (!unmute) return;

    await new ModLog(guild)
      .setType('unmute')
      .setId(lookupID)
      .setModerator(this.client.user)
      .setReason('Automod - Mute Limit Over')
      .setUser(member.user)
      .send();
  }
};
