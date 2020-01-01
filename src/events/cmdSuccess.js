const { Event } = require('../index');
const { MessageEmbed } = require('discord.js');

module.exports = class extends Event {
  async run(message, cmd, args, response) {
    // if (message.author === this.client.appInfo.owner) return undefined;
    // return this.sendFeedback(message, cmd, args, response);
  }

  async sendFeedback(message, cmd, args, res) {
    const channel = this.client.channels.get('644491823800254474');
    const { type } = message.channel;
    const shard = message.guild ? message.guild.shardID : 0;

    const embed = new MessageEmbed()
      .setAuthor(`Command ${cmd.name} used in ${message.guild.name}`, message.guild.iconURL())
      .setColor('#4f92ff')
      .addField('Shard', shard, true)
      .addField('Message Type', this[type](), true)
      .addField('Args Supplied', args.length ? args.join(' ') : 'none', true)
      .addField('Command Usage', `${message.settings.prefix}${cmd.name} ${args.join(' ')}`, true)
      .addField('Command Response', `\`\`\`${res || 'none'}\`\`\``)
      .setFooter(`CMD ran by ${message.author.tag}`, message.author.displayAvatarURL())
      .setTimestamp();
    channel.send({ embed });
  }

  text() {
    return 'Guild Message';
  }

  dm() {
    return 'Direct Message (DM)';
  }
};
