const { Monitor, ServerLog, coreutil } = require('../index');

module.exports = class extends Monitor {
  constructor(...args) {
    super(...args, {
      ignoreBots: false,
      ignoreOthers: false,
    });
    this.urlRegex = /((ftp|http|https):\/\/)?www\.([A-z]+)\.([A-z]{2,})/i;
  }
  async run(message) {
    if (!message.guild || message.guild.settings.get('automod.invites') ||
    message.guild.settings.get('ignoreChannels.invites').includes(message.channel.id)) return;

    if (!this.urlRegex.test(message.content)) return;

    await message.channel.send(message.language.get('MONITOR_URL_DETECTED', message.member))
      .then(async (msg) => {
        await message.delete().catch(() => null);
        await coreutil.wait(3000);
        msg.delete();
      });

    await new ServerLog(message.guild)
      .setType('automod')
      .setFooter('Automod - URL Delete')
      .setDescription(`Web Link from ${message.author} in ${message.channel}`)
      .addField('URL', `https://${message.content}`, true)
      .send();
  }
};
