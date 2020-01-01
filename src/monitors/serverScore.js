const { Monitor, util: { randomNumber } } = require('../index');

module.exports = class extends Monitor {
  constructor(...args) {
    super(...args, {
      ignoreOthers: false,
      enable: false,
    });
    this.timeout = new Set();
  }
  
  async run(message) {
    if (!message.guild || !message.guild.settings.get('toggles.persistence')) return;
    if (message.prefix || message.guild.settings.get('ignoreChannels.persistence').includes(message.channel.id)) return;
    if (this.timeout.has(`${message.author.id}-${message.guild.id}`)) return;

    await message.member.settings.sync(true);
    const data = message.member.settings;

    const score = randomNumber(1, 4);
    const points = randomNumber(5, 10);

    await message.member.settings.update([['score', score], ['points', points]]);

    this.timeout.add(`${message.author.id}-${message.guild.id}`);

    setTimeout(() => {
      this.timeout.delete(`${message.author.id}-${message.guild.id}`);
    }, 120000);

    const scoreNeeded = 5 * (data.level ^ 2) + (50 * data.level) + 100 - data.score;

    if (data.score <= scoreNeeded) return;

    if (message.guild.settings.get('toggles.levelup')) await this.levelup(message);
    if (message.guild.settings.get('toggles.levelroles')) await this.levelroles(message);
  }

  // eslint-disable-next-line class-methods-use-this
  async levelup(message) {
    const { level } = message.member.settings;
    message.member.settings.update('level', level + 1);
    if (!message.channel.postable) return;
    return message.channel.send(`${message.member} has levelled up to **Level ${message.member.settings.get('level')}**`);
  }

  // eslint-disable-next-line class-methods-use-this
  async levelroles(message) {
    const levelRoles = message.guild.settings.get('roles.levelroles').filter(lr => message.member.settings.get('level') >= lr.lvl);
    if (!levelRoles) return;

    const promises = [];

    // eslint-disable-next-line no-restricted-syntax
    for (const levelRole of levelRoles) {
      if (message.member.roles.cache.has(levelRole.id)) continue;

      const role = message.guild.roles.cache.get(levelRole.id);
      if (!role) continue;

      if (role.position >= message.guild.roles.highest.position) continue;

      promises.push(message.member.roles.add(role, 'Swift\'s Level Based Role').catch(() => null));
    }

    await Promise.all(promises);
  }
};
