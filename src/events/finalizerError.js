const { Event } = require('../index');
const { MessageEmbed } = require('discord.js');

module.exports = class extends Event {
  async run(message, command, response, finalizer, error) {
    if (error) {
      if (error.stack) this.client.logger.error(`[Finalizer Error]\n${error.stack}`);
      else this.client.logger.error(error);
    } else this.client.logger.error('[Finalizer Error] Unknown Error');
    return this.log(message, command, response, finalizer, error);
  }

  async log(message, command, response, finalizer, error) {
    const channel = this.client.channels.get('644874700274794536');
    const shard = message.guild ? message.guild.shardID : 0;

    const embed = new MessageEmbed()
      .setAuthor(`Finalizer Error in ${message.guild.name}`, message.guild.iconURL())
      .setColor('#d9534f')
      .setDescription(`\`\`\`${error.message ? error.message : 'none'}\`\`\``)
      .addField('Finalizer Name', finalizer.name, true)
      .addField('Command', command.name, true)
      .addField('Error Description', `\`\`\`${error.stack ? error.stack : 'Unknown Error'}\`\`\``)
      .setFooter(`CMD ran by ${message.author.tag}`, message.author.displayAvatarURL())
      .setTimestamp();
    channel.send({ embed });
  }
};
