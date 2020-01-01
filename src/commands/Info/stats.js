const { MessageEmbed } = require('discord.js');
const moment = require('moment');
const os = require('os');
require('moment-duration-format');

const { Command } = require('../../index');

class Statistics extends Command {
  constructor(...args) {
    super(...args, {
      enabled: false,
      name: 'stats',
      description: language => language.get('CMD_STATS_DESCRIPTION'),
      usage: 'stats',
      category: 'System',
      requiredPerms: ['EMBED_LINKS'],
    });
  }

  async run(message) {
    const duration = moment.duration(this.client.uptime).format(' D [days], H [hrs], m [mins], s [secs]');
    const embed = new MessageEmbed()
      .setAuthor(`${this.client.user.username}`, this.client.user.displayAvatarURL)
      .addField('• Guilds', `${this.client.guilds.cache.size.toLocaleString()}`, true)
      .addField('• Users', `${this.client.users.cache.size.toLocaleString()}`, true)
      .addField('• Channels', `${this.client.channels.cache.size.toLocaleString()}`, true)
      .addField('• Host OS', os.type(), true)
      .addField('• CPU Load', `${Math.round(os.loadavg()[0] * 10000) / 100}%`, true)
      .addField('• Mem Usage', `${(process.memoryUsage().heapUsed / 1024 / 1024).toFixed(2)} MB`, true)
      // .addField('• RAM (Total)', `${(process.memoryUsage().heapTotal / 1048576)} MB`, true)
      .addField('• Uptime', duration, true)
      .setFooter('SwiftBot - Made by _Interittus13_#1504')
      .setTimestamp();
    message.channel.send({ embeds: [embed] });
  }
}

module.exports = Statistics;
