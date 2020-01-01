const { Event } = require('../index');
const { MessageEmbed } = require('discord.js');

module.exports = class extends Event {
  async run(message, cmd, args, error) {
    if (error instanceof Error) this.client.logger.error(`[CMD Error] ${error.stack || error}`);

    if (error.message) message.channel.send(error.message, { code: 'js' }).catch(err => this.client.logger.error(`[CMD Error] ${err}`));
    else message.channel.send(error).catch(err => this.client.logger.error(`[CMD Error] ${err}`));

    return this.log(message, cmd, args, error);
  }

  async log(message, cmd, args, error) {
    const channel = this.client.channels.cache.get('644453686541680640');
    if (!channel) return;

    const embed = new MessageEmbed()
      .setAuthor(`Command ${cmd.name} returns Error in ${message.guild.name}`, message.guild.iconURL())
      .setColor('#d9534f')
      .setDescription(`\`\`\`${error.message ? error.message : 'none'}\`\`\``)
      .addField('Args Supplied', args.length ? args.join(' ') : 'none', true)
      .addField('Command Usage', `${message.settings.prefix}${cmd.name} ${args.join(' ')}`, true)
      .addField('Error Description', `\`\`\`${error instanceof Error ? error.stack : error}\`\`\``)
      .setFooter(`CMD ran by ${message.author.tag}`, message.author.displayAvatarURL())
      .setTimestamp();
    channel.send({ embeds: [embed] });
  }
};
