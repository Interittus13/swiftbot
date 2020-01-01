const { Permissions } = require('discord.js');

class DashboardGuild {
  constructor(client, guild, user) {
    this.client = client;
    this.user = user;
    this.id = guild.id;
    this.name = guild.name;
    this.icon = guild.icon;
    this.userIsOwner = guild.owner;

    this.userGuildPerms = new Permissions(guild.permissions);
    this.userCanManage = this.userGuildPerms.has('MANAGE_GUILD');
  }

  get iconURL() {
    const { guild } = this;
    if (guild) return guild.iconURL({ dynamic: true, size: 2048 });
    if (this.icon) return `https://cdn.discordapp.com/icons/${this.id}/${this.icon}.png`;
    return null;
  }

  get guild() {
    return this.client.guilds.cache.get(this.id) || null;
  }

  toJSON() {
    const guild = (g => g ? g.toJSON() : {})(this.guild);
    return {
      ...guild,
      id: this.id,
      name: this.name,
      iconURL: this.iconURL,
      userIsOwner: this.userIsOwner,
      userGuildPerms: this.userGuildPerms,
      userCanManage: this.userCanManage,
    };
  }
}

module.exports = DashboardGuild;
