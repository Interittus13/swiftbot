const { Command } = require('../../index');
const { User } = require('discord.js');

class Blacklist extends Command {
  constructor(...args) {
    super(...args, {
      name: 'blacklist',
      description: language => language.get('CMD_BLACKLIST_DESCRIPTION'),
      category: 'Developer',
      permLevel: 10,
      guarded: true,
      usage: '<User:user|Guild:guild|guild:str> [...]',
      usageDelim: ' ',
    });

    this.terms = ['usersAdded', 'usersRemoved', 'guildsAdded', 'guildsRemoved'];
  }

  async run(message, usersOrGuilds) {
    const changes = [[], [], [], []];
    const queries = [[], []];

    for (const userOrGuild of new Set(usersOrGuilds)) {
      const type = userOrGuild instanceof User ? 'user' : 'guild';
      if (this.client.settings[`${type}Blacklist`].includes(userOrGuild.id || userOrGuild)) {
        changes[this.terms.indexOf(`${type}sRemoved`)].push(userOrGuild.name || userOrGuild.username || userOrGuild);
      } else {
        changes[this.terms.indexOf(`${type}sAdded`)].push(userOrGuild.name || userOrGuild.userOrGuild || userOrGuild);
      }

      queries[Number(type === 'guild')].push(userOrGuild.id || userOrGuild);
    }

    const { errors } = await this.client.settings.update([['userBlacklist', queries[0]], ['guildBlacklist', queries[1]]]);
    if (errors.length) throw String(errors[0]);

    return message.channel.send(message.language.get('CMD_BLACKLIST_SUCCESS', changes));
  }
}

module.exports = Blacklist;
