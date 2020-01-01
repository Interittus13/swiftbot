const { Command } = require('../../index');
const { MessageEmbed } = require('discord.js');

const has = (obj, key) => Object.prototype.hasOwnProperty.call(obj, key);

class Help extends Command {
  constructor(...args) {
    super(...args, {
      name: 'help',
      description: language => language.get('CMD_HELP_DESCRIPTION'),
      extended: language => language.get('CMD_HELP_EXTENDED'),
      usage: '[command]',
      aliases: ['h', 'halp'],
      guarded: true,
    });
  }
  async run(message, [cmdText]) {

    const command = this.client.commands.get(cmdText);

    // let currentCategory = '';
    // const sorted = this.client.commands.array().sort((p, c) => (p.category > c.category ? 1 : p.name > c.name && p.category === c.category ? 1 : -1));
    // // const ccc = sorted.filter(cmd => this.client.permissionLevels[cmd.permLevel] <= perms && !cmd.hidden && cmd.enabled);
    // const ccc = sorted.filter(cmd => !cmd.hidden && cmd.enabled && cmd.category !== 'Owner');

    if (command) {
      const fullExample = await this.fullExample(message, command);
      const embed = new MessageEmbed()
        .setColor(6192321)
        .setTitle('Help Menu', this.client.user.displayAvatarURL())
        .setDescription(`\`\`\`${command.description(message.language)}\`\`\``)
        .addField('Usage', `\`${await this.fullUsage(message, command)}\``, true)
        // embed.addField('Examples', command.example.length === 0 ? 'None' : message.guildSettings.prefix + command.example.join(`\n${message.guildSettings.prefix}`), true)
      if (fullExample) embed.addField('Examples', fullExample, true);
      embed.addField('Aliases', command.aliases.length === 0 ? 'None' : command.aliases.join(', '), true)
        .addField('Aditional', command.extended(message.language));

      return message.channel.send({ embeds: [embed] });
    }

    const help = await this.buildHelp(message);
    const categories = Object.keys(help);

    const embed = new MessageEmbed()
      .setTitle('Help Menu')
      .setColor(6192321)
      .setDescription(`Type \`${message.guildSettings.prefix}help [command]\` for more details. Eg \`${message.guildSettings.prefix}help advice\``);
    for (let i = 0; i < categories.length; i += 1) {
      embed.addField(categories[i], help[categories[i]].join('\n'), true);
    }
    return message.channel.send({ embeds: [embed] });
  }

  async buildHelp(message) {
    const help = {};

    await Promise.all(this.client.commands.map(cmd =>
      this.client.inhibitors.run(message, cmd, true)
        .then(() => {
          if (!has(help, cmd.category)) help[cmd.category] = [];
          help[cmd.category].push(cmd.name);
        })
        .catch(() => {
        // noop
        }),
    ));

    return help;
  }

  async fullUsage(msg, cmd) {
    const { prefix } = msg.guildSettings; 
    const fullUsage = cmd.usage ? `${prefix}${cmd.name} ${cmd.usage}` : `${prefix}${cmd.name}`;
    return fullUsage;
  }

  async fullExample(msg, cmd) {
    const { prefix } = msg.guildSettings; 
    const fullExample = cmd.example.length ? `${prefix}${cmd.name} ${cmd.example.join(`\n${prefix}${cmd.name} `)}` : null;
    return fullExample;
  }
}

module.exports = Help;
