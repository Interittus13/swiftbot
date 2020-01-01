const { Monitor } = require('../index');

module.exports = class extends Monitor {
  constructor(...args) {
    super(...args, {
      ignoreOthers: false,
    });
  }

  async run(message) {
    const isAFK = await message.author.settings.get('afk.time');
    if (!isAFK) return;

    await message.author.settings.reset(['afk.time', 'afk.reason']);

    const msg = await message.channel.send(message.language.get('MONITOR_AFK_REMOVED', message.author.username));
    return msg.delete({ timeout: 10000, reason: 'Swift\'s AFK Feature' });
  }
};
