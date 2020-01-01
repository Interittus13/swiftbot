const { Command } = require('../../index');

class Ping extends Command {
  constructor(...args) {
    super(...args, {
      // name: 'ping',
      description: language => language.get('CMD_PING_DESCRIPTION'),
      extended: language => language.get('CMD_PING_EXTENDED'),
    });
  }
  async run(message) {
    const msg = await message.channel.send('Pinging......');
    return msg.edit(message.language.get('CMD_PING_RESPONSE', message.member.displayName, msg.createdTimestamp - message.createdTimestamp).random());
  }
}

module.exports = Ping;
