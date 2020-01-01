const { Monitor, coreutil: { isFn } } = require('../index');

module.exports = class extends Monitor {
  constructor(...args) {
    super(...args, {
      ignoreOthers: false,
    });
    // this.ignoreEdits = false;
  }

  async run(message) {
    if (message.guild && !message.guild.me) await message.guild.members.fetch(this.client.user);
    if (!message.channel.postable) return undefined;
    if (!message.commandText && message.prefix === this.client.mentionPrefix) return message.channel.send(message.language.get('PREFIX_INFO', [message.guildSettings.prefix.length ? message.guildSettings.prefix : undefined]));

    if (!message.commandText) return undefined;
    if (!message.command || !message.command.enabled) return undefined;

    return this.runCommand(message);
  }

  async runCommand(message) {
    if (this.client.options.typing) message.channel.startTyping();

    try {
      await this.client.inhibitors.run(message, message.command);
      try {
        const subcommand = message.command.subcommands ? message.args.shift() : undefined;
        let commandRun;
        if (subcommand && isFn(message.command[subcommand])) commandRun = message.command[subcommand](message, message.args);
        else if (subcommand && !isFn(message.command[subcommand])) commandRun = message.command.run(message, [subcommand]);
        else commandRun = message.command.run(message, message.args);

        const res = await commandRun;
        this.client.finalizers.run(message, message.command, res);
        this.client.emit('cmdSuccess', message, message.command, message.args, res);
      } catch (cmdError) {
        this.client.emit('cmdError', message, message.command, message.args, cmdError);
      }
    } catch (response) {
      if (Array.isArray(response)) this.client.emit('cmdInhibited', message, message.command, response.toString());
      else this.client.emit('cmdInhibited', message, message.command, response);
    }

    if (this.client.options.typing) message.channel.stopTyping();
  }
};
