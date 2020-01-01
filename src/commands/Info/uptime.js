const Discord = require('discord.js');
const { Command, Duration } = require('../../index');

class Bottime extends Command {
  constructor(...args) {
    super(...args, {
      name: 'uptime',
      description: language => language.get('CMD_UPTIME_DESCRIPTION'),
      usage: 'uptime',
      aliases: ['up'],
      botPerms: ['EMBED_LINKS'],
      cooldown: 20,
    });
  }


  async run(message, args, perms) {
    const duration = Duration.toNow(Date.now() - (process.uptime() * 1000));
    const embed = new Discord.MessageEmbed()
      .addField('Uptime', `${duration}`, true)
      .setTimestamp();
    message.channel.send({ embeds: [embed] });

    //     message.channel.send(`= STATISTICS =
    // • Mem Usage  :: ${(process.memoryUsage().heapUsed / 1024 / 1024).toFixed(2)} MB
    // • Uptime     :: ${duration}
    // • Users      :: ${client.users.size.toLocaleString()}
    // • Servers    :: ${client.guilds.size.toLocaleString()}
    // • Channels   :: ${client.channels.size.toLocaleString()}
    // • Discord.js :: v${Discord.version}
    // • Node       :: ${process.version}`, {code: "asciidoc"});
  }
}

module.exports = Bottime;
