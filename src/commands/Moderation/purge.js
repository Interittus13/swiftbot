const { Command } = require('../../index');

class Purge extends Command {
  constructor(...args) {
    super(...args, {
      name: 'purge',
      description: language => language.get('CMD_PURGE_DESCRIPTION'),
      extended: language => language.get('CMD_PURGE_EXTENDED'),
      usage: 'purge <number> [@user | links | invites | uploads | me | bot]',
      aliases: ['prune', 'clean'],
      category: 'Moderation',
      permLevel: 'Moderator',
      botPerms: ['MANAGE_MESSAGES'],
      example: ['purge 50',
        'purge 50 @_Interittus13_',
        'purge 50 links',
        'purge 50 uploads'],
    });
  }

  getFilter(msg, filter, user) {
    switch (filter) {
      case 'link' || 'links': return m => /https?:\/\/[^ /.]+\.[^ /.]+/.test(m.content);
      case 'invite' || 'invites': return m => /(https?:\/\/)?(www\.)?(discord\.(gg|li|me|io)|discordapp\.com\/invite)\/.+/.test(m.content);
      case 'bots': return m => m.author.bot;
      case 'swift': return m => m.author.id === this.client.user.id;
      case 'me': return m => m.author.id === msg.author.id;
      case 'upload' || 'uploads': return m => m.attachments.size > 0;
      case 'user': return m => m.author.id === user.id;
      default: return () => true;
    }
  }

  async run(message, [limit = null, filter = null], perms) {
    if (!limit) return message.reply('Must specify an amount to delete!');
    if (limit > 100) return message.reply(message.language.get('CMD_PURGE_LIMIT'));
    // if (!limit && !user) return message.reply('Must specify a user and amount, or just an amount, of messages to purge!');
    await message.delete();
    let messages = await message.channel.messages.fetch({ limit: 100 });
    if (filter) {
      const user = typeof filter !== 'string' ? filter : null;
      const type = typeof filter === 'string' ? filter : 'user';
      messages = messages.filter(this.getFilter(message, type, user));
    }
    messages = messages.array().slice(0, limit);
    await message.channel.bulkDelete(messages, true).catch(msg => msg.reply(message.language.get('CMD_PURGE_ERROR')));
    const reply = await message.language.get('CMD_PURGE_RESPONSES', messages.length).random();
    message.channel.send(reply).then(msg => msg.delete({ timeout: 5000 }));
  }
}

module.exports = Purge;
