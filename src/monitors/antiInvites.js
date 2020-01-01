const { Monitor, ServerLog, coreutil } = require('../index');

module.exports = class extends Monitor {
  constructor(...args) {
    super(...args, {
      ignoreBots: false,
      ignoreOthers: false,
    });
    this.inviteRegex = /(?:https?:\/\/)?(?:www\.)?(discord\.(gg|io|me|li)|discordapp\.com\/invite)\/(\S+)/i;
  }
  async run(message) {
    if (!message.guild || !message.guild.settings.get('automod.invites') ||
    message.guild.settings.get('ignoreChannels.invites').includes(message.channel.id)) return;

    if (!this.inviteRegex.test(message.content)) return; // {

    await message.channel.send(message.language.get('MONITOR_INVITE_WARNING', message.member))
      .then(async (msg) => {
        await message.delete().catch(() => null);
        await coreutil.wait(3000);
        msg.delete();
      });

    const invite = await this.client.fetchInvite(message.content).catch((err) => {});
    if (!invite) return;

    await new ServerLog(message.guild)
      .setType('automod')
      .setFooter('Automod - Invite Delete')
      .setTitle(`Server invite from ${message.author.tag} in #${message.channel.name}`)
      .setDescription(invite.guild.description ? invite.guild.description : '')
      .addField('Invite Code', invite.code, true)
      .addField('Server', invite.guild.name, true)
      .addField('Channel', `#${invite.channel.name}`, true)
      .send();
  }
};
