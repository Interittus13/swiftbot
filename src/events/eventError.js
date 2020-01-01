const { Event } = require('../index');
const { MessageEmbed } = require('discord.js');

module.exports = class extends Event {
  async run(event, args, error) {
    if (error) {
      if (error.stack) this.client.logger.error(`[Event Error] ${error.stack}`);
      else this.client.logger.error(error);
    } else this.client.logger.error('[Event Error] Unknown Error');
    // return this.log(event, args, error);
  }

  /* async log(event, args, error) {
    const channel = this.client.channels.get('644874700274794536');
    // const shard = message.guild ? message.guild.shardID : 0;

    const embed = new MessageEmbed()
      .setAuthor(`Event Error in ${message.guild.name}`, message.guild.iconURL())
      .setColor('#d9534f')
      .setDescription(`\`\`\`${error.message ? error.message : 'none'}\`\`\``)
      .addField('Event Name', event.name, true)
      .addField('Usage', message.content.length ? message.content : 'none', true)
      .addField('Error Description', `\`\`\`${error.stack ? error.stack : 'Unknown Error'}\`\`\``)
      .setFooter(`CMD ran by ${message.author.tag}`, message.author.displayAvatarURL())
      .setTimestamp();
    channel.send({ embed });
  } */
};
