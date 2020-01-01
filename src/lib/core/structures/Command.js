const { Permissions } = require('discord.js');
const AliasPiece = require('../structures/base/AliasPiece');

class Command extends AliasPiece {
  constructor(store, file, dir, options = {}) {
    super(store, file, dir, options);

    this.name = this.name.toLowerCase();
    this.description = options.description ? options.description : language => language.get('NO_DESCRIPTION');
    this.extended = options.extended ? options.extended : language => language.get('NO_EXTENDED_DESCRIPTION');

    this.category = file.slice(0, -1)[0] || options.category;
    this.usage = options.usage || '';
    this.example = options.example || [];

    this.bucket = options.bucket || 1;
    this.cooldown = options.cooldown || 0;
    this.cooldownLevel = options.cooldownLevel || 'author';

    this.enabled = 'enabled' in options ? options.enabled : true;
    this.subcommands = options.subcommands || false;
    this.runIn = options.runIn || ['text'];

    this.permLevel = options.permLevel || 0;
    this.requiredPerms = new Permissions(options.requiredPerms || []).freeze();
    this.requiredSettings = options.requiredSettings || [];

    this.nsfw = options.nsfw || false;
    this.hidden = options.hidden || false;
    this.guarded = options.guarded || false;
  }

  // eslint-disable-next-line class-methods-use-this
  async resolveChannel(guild, search) {
    let channel = null;
    if (!search || typeof search !== 'string') return;

    // search by ID
    if (search.match(/^<#!?(\d+)>$/)) {
      const id = search.match(/^<#!?(\d+)>$/)[1];
      channel = await guild.channels.cache.get(id);
      if (channel) return channel;
    }

    // search by Name
    channel = guild.channels.cache.find(c => c.name === search);
    if (channel) return channel;

    channel = await guild.channels.cache.get(search);
    return channel;
  }

  async cmdError(message, str) {
    return this.client.commands.get('help').run(message, [str]);
  }

  async run() {
    throw new Error(`The run method has not been implemented yet by ${this.type}:${this.name}`);
  }
}

module.exports = Command;
