const { Command } = require('../../index');

class Say extends Command {
  constructor(...args) {
    super(...args, {
      name: 'say',
      description: language => language.get('CMD_SAY_DESCRIPTION'),
      usage: 'say <message>',
      category: 'Moderation',
      extended: language => language.get('CMD_SAY_EXTENDED'),
      aliases: ['speak'],
      botPerms: ['MANAGE_MESSAGES'],
      permLevel: 'Moderator',
    });
  }
  async run(message, args, perms) { // eslint-disable-line

    const say = args.slice(0).join(' ');
    message.delete();
    if (!say) return message.channel.send('Nothing to say ');
    message.channel.send(`${say}`);
  }
}

module.exports = Say;
