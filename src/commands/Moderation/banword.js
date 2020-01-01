const { Command } = require('../../index');

class SwearWords extends Command {
  constructor(...args) {
    super(...args, {
      name: 'banword',
      description: language => language.get('CMD_BANWORDS_DESCRIPTION'),
      usage: 'bw [view | add <word>  | del <word>]',
      aliases: ['bw'],
      category: 'Moderation',
      permLevel: 'Moderator',
      botPerms: ['MANAGE_MESSAGES'],
      example: ['banword view',
        'banword add fuck',
        'banword del cum'],
    });
  }

  async run(message, [action, ...value], perms) {
    if (message.settings.antiSwearing === 'false') return message.channel.send(': Blacklisted words are disabled. :', { code: 'asciidoc' });

    const words = message.guild.serverMod.swearWords;

    switch (action) {
      case 'add': {
        const input = value.join(' ').toLowerCase();
        if (words.includes(input)) return message.channel.send(`${this.client.config.emojis.error} Word **${input}** is already blacklisted.`);
        this.client.serverMod.push(message.guild.id, input, 'swearWords');
        message.channel.send(`${this.client.config.emojis.success} Word(s) **${value.join(' ')}** blacklisted.`);
        break;
      }
      case 'del':
      case 'remove': {
        const input = value.join(' ').toLowerCase();
        if (!words.includes(input)) return message.channel.send(`${this.client.config.emojis.error} Word **${input}** is not blacklisted.`);
        this.client.serverMod.remove(message.guild.id, input, 'swearWords');
        message.channel.send(`${this.client.config.emojis.success} Word **${input}** removed from blacklist.`);
        break;
      }
      case 'list':
      case 'view':
      default: {
        const gword = this.client.config.swearWords;
        let output;
        if (!words.length) output = 'No word is blacklisted on this server.';
        else output = words.join(', ');
        message.channel.send(`: Blacklisted words :\n= Global Words =\n${gword.join(', ')}\n\n= ${message.guild.name} Server's Custom =\n${output}`, { code: 'asciidoc' });
        break;
      }
    }
  }
}

module.exports = SwearWords;
