const { MessageEmbed, version } = require('discord.js');
const pakage = require('../../package.json');
const { Command } = require('../../index');

class BotInformation extends Command {
  constructor(...args) {
    super(...args, {
      name: 'info',
      description: language => language.get('CMD_INFO_DESCRIPTION'),
      usage: 'info',
      botPerms: ['EMBED_LINKS'],
      cooldown: 20,
    });
  }

  async run(message, args) {
    const embed = new MessageEmbed()
      .setTitle('A fully customizable, Multi-Purpose bot for your server with features like anti-spam, auto-moderation, role management, social economy commands, NSFW commands, fun commands and many more.')
      .setAuthor(`${this.client.user.username}`, this.client.user.displayAvatarURL())
      .addField('• Version', `v${pakage.version}`, true)
      .addField('• Node', `${process.version}`, true)
      .addField('• Library', `Discord.js (v${version})`, true)
      .addField('• Creator', '_Interittus13_#1504', true)
      .addField('• Invite', '[SwiftBot/Invite](https://discordapp.com/api/oauth2/authorize?client_id=346999806624923658&permissions=1544023286&scope=bot "Invite Swift")', true)
      .addField('• Website', 'SOON', true)
      .addField('• Contribution', '`PI¥ỮŞĦ™#6080` - Handles bot\'s graphics.\nContact me If you want to Contribute to the Project.')
      .setFooter('SwiftBot - Made by _Interittus13_#1504')
      .setTimestamp();
    message.channel.send({ embeds: [embed] });
  }
}

module.exports = BotInformation;
