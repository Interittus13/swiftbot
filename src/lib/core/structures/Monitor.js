const Piece = require('./base/Piece');

class Monitor extends Piece {
  constructor(store, file, directory, options = {}) {
    super(store, file, directory, options);

    this.allowedTypes = 'allowedTypes' in options ? options.allowedTypes : ['DEFAULT'];
    this.ignoreBots = 'ignoreBots' in options ? options.ignoreBots : true;
    this.ignoreSelf = 'ignoreSelf' in options ? options.ignoreSelf : true;
    this.ignoreOthers = 'ignoreOthers' in options ? options.ignoreOthers : true;
    this.ignoreWebhooks = 'ignoreWebhooks' in options ? options.ignoreWebhooks : true;
    // this.ignoreEdits = 'ignoreEdits' in options ? options.ignoreEdits : true;
    this.ignoreBlacklistedUsers = 'ignoreBlacklistedUsers' in options ? options.ignoreBlacklistedUsers : true;
    this.ignoreBlacklistedGuilds = 'ignoreBlacklistedGuilds' in options ? options.ignoreBlacklistedGuilds : true;
  }

  async _run(message) {
    try {
      await this.run(message);
    } catch (err) {
      this.client.emit('monitorError', message, this, err);
    }
  }

  run() {
    // Defined in extension Classes
    throw new Error(`The run method has not been implemented by ${this.type}:${this.name}.`);
  }

  shouldRun(message) {
    return this.enabled &&
    this.allowedTypes.includes(message.type) &&
    !(this.ignoreBots && message.author.bot) &&
    !(this.ignoreSelf && this.client.user === message.author) &&
    !(this.ignoreOthers && this.client.user !== message.author) &&
    !(this.ignoreWebhooks && message.webhookID) &&
    // !(this.ignoreEdits && message._edits.length) &&
    !(this.ignoreBlacklistedUsers && this.client.settings.userBlacklist.includes(message.author.id)) &&
    !(this.ignoreBlacklistedGuilds && message.guild && this.client.settings.guildBlacklist.includes(message.guild.id));
  }
}

module.exports = Monitor;
