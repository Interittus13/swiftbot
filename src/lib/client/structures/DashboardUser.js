const { Collection } = require('discord.js');
const DashboardGuild = require('./DashboardGuild');

class DashboardUser {
  constructor(client, user) {
    this.client = client;
    this.id = user.id;
    this.username = user.username;
    this.discriminator = parseInt(user.discriminator);
    this.locale = user.locale;
    this.mfaEnabled = user.mfa_enabled;
    this.avatar = user.avatar;

    this.guilds = new Collection();
    this.constructor.setupGuilds(this, user.guilds);
  }

  get avatarURL() {
    const { user } = this;
    if (user) return user.displayAvatarURL({ dynamic: true, size: 2048 });
    if (this.avatar) return `https://cdn.discordapp.com/avatars/${this.id}/${this.avatar}.png`;
    return `https://cdn.discordapp.com/embed/avatars/${this.discriminator % 5}.png`;
  }

  get user() {
    return this.client.users.cache.get(this.id) || null;
  }

  toJSON() {
    const user = (u => u ? u.toJSON() : {})(this.user);
    return {
      ...user,
      id: this.id,
      username: this.username,
      discriminator: this.discriminator,
      locale: this.locale,
      mfaEnabled: this.mfaEnabled,
      avatarURL: this.avatarURL,
      guilds: [...this.guilds.values()],
    };
  }

  static setupGuilds(dashboardUser, guilds) {
    for (const guild of guilds) dashboardUser.guilds.set(guild.id, new DashboardGuild(dashboardUser.client, guild, dashboardUser));
  }
}

module.exports = DashboardUser;
