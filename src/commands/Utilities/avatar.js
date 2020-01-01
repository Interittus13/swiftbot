const { Command } = require('../../index');
const { MessageEmbed } = require('discord.js');

class Avatar extends Command {
  constructor(...args) {
    super(...args, {
      name: 'avatar',
      description: language => language.get('CMD_AVATAR_DESCRIPTION'),
      usage: 'avarat [@User]',
      aliases: ['av'],
      requiredPerms: ['ATTACH_FILES', 'EMBED_LINKS'],
      cooldown: 20,
    });
  }

  async run(message, args, perms) {
    const msg = await message.channel.send(message.language.get('PLEASE_WAIT', 'Generating Avatar'));
    const target = message.mentions.users.first() || message.author;

    const embed = new MessageEmbed()
      .setAuthor(target.tag)
      .setColor(0x377fd1)
      .setDescription(`[Avatar URL](${target.avatarURL({ dynamic: true, size: 2048 })} 'Download Avatar')`)
      .setImage(target.displayAvatarURL({ dynamic: true, size: 2048 }));
    message.channel.send({ embeds: [embed] });

    msg.delete();
  }
}

module.exports = Avatar;
