const { Monitor } = require('../index');

module.exports = class extends Monitor {
  constructor(...args) {
    super(...args, {
      ignoreOthers: false,
    });
  }

  async run(message) {
    const mentioned = message.mentions.users.first();
    if (!mentioned) return;

    const afk = await message.author.settings.get('afk');
    if (!afk.time) return;

    return message.channel.send(message.language.get('MONITOR_AFK_ISAFK', message.author.username, afk));
  }
};
