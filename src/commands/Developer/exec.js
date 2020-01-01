const { Command } = require('../../index');
const exec = require('child_process').exec;

class Execute extends Command {
  constructor(...args) {
    super(...args, {
      name: 'exec',
      description: language => language.get('CMD_EXEC_DESCRIPTION'),
      aliases: ['shell', 'ex'],
      usage: 'exec <...code>',
      category: 'Developer',
      permLevel: 10,
    });
  }

  // eslint-disable-next-line class-methods-use-this
  async run(message, args) {
    exec(`${args.join(' ')}`, (error, stdout) => {
      const response = (error || stdout);

      return message.channel.send(`**\`OUTPUT\`**${'```prolog'}\n${response}\n${'```'}`);
    });
  }
}

module.exports = Execute;
