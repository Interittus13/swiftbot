const { Command, coreutil: { toTitleCase } } = require('../../index');

class Configuration extends Command {
  constructor(...args) {
    super(...args, {
      name: 'conf',
      description: language => language.get('CMD_CONF_DESCRIPTION'),
      category: 'Develpoer',
      guarded: true,
      requiredLevel: 10,
      subcommands: true,
      usage: '<set|show|remove|reset> (key:key) (value:value) [...]',
    });
  }

  show(message, [key]) {
    const path = this.client.gateways.guilds.getPath(key, { avoidUnconfigurable: true, errors: false, piece: null });
    if (!path) return message.channel.send('CMD_CONF_NOEXT', [key]);
    if (path.piece.type === 'Folder') {
      return message.channel.send(message.language.get('CMD_CONF_SERVER', key ? `: ${key.split('.').map(toTitleCase).join('/')}` : '', message.guildSettings.list(message, path.piece)));
    }
    return message.channel.send(message.language.get('CMD_CONF_GET', path.piece.path, message.guildSettings.resolveString(message, path.piece)));
  }

  async set(message, [key, ...valueToSet]) {
    const status = await message.guildSettings.update(key, valueToSet.join(' '), message.guild, { avoidUnconfigurable: true, action: 'add' });
    return this.check(message, key, status) || message.channel.send('CMD_CONF_UPDATED', key, message.guildSettings.resolveString(message, status.updated[0].piece));
  }

  async reset(message, [key]) {
    return message.channel.send('Done');
  }

  check(message, key, { errors, updated }) {
    if (errors.length) return message.channel.send(String(errors[0]));
    if (!updated.length) return message.channel.send('CMD_CONF_NOCHANGE', key);
    return null;
  }
}

module.exports = Configuration;
