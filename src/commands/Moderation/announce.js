const { Command } = require('../../index');
const { MessageEmbed } = require('discord.js');

class Announce extends Command {
  constructor(...args) {
    super(...args, {
      name: 'announce',
      description: language => language.get('CMD_ANNOUNCE_DESCRIPTION'),
      extended: language => language.get('CMD_ANNOUNCE_EXTENDED'),
      usage: 'announce [#channel] <message>',
      category: 'Moderation',
      permLevel: 'Moderator',
      botPerms: ['EMBED_LINKS', 'MANAGE_MESSAGES'],
      example: ['announce #general Hello World!',
        'announce Hello World!'],
    });
  }

  async run(message, args, perms) {
    const channelID = await this.verifyChannel(message, args[0]);
    if (channelID !== message.channel.id) {
      args.shift();
    }
    if (!args[0]) return this.cmdError(message, this.name);
    const channel = message.guild.channels.get(channelID);
    const attachment = this.client.utils.isImg(args.join(' '));

    message.delete();
    const embed = new MessageEmbed()
      .setDescription(attachment ? args.join(' ').replace(/https?:\/\/(?:\w+\.)?[\w-]+\.[\w]{2,3}(?:\/[\w-_.]+)+\.(?:png|jpg|jpeg|gif|webp)/, '') : args.join(' '))
      .setFooter(`Message from ${message.author.username}`, message.author.displayAvatarURL())
      .setTimestamp();
    if (attachment) embed.setImage(attachment[0]);
    return channel.send({ embed });
  }
}

module.exports = Announce;
