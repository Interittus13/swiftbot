const { Finalizer, RateLimitManager } = require('../index');

module.exports = class extends Finalizer {
  constructor(...args) {
    super(...args);
    this.cooldowns = new WeakMap();
  }
  async run(message, command) {
    if (command.cooldown <= 0) return;

    try {
      this.getCooldown(message, command).drip();
    } catch (error) {
      this.client.logger.error(`${message.author.username}[${message.author.id}] has exceeded the RateLimit for ${message.command}`)
    }
  }

  getCooldown(message, command) {
    let cooldownMgr = this.cooldowns.get(command);
    if (!cooldownMgr) {
      cooldownMgr = new RateLimitManager(command.bucket, command.cooldown * 1000);
      this.cooldowns.set(command, cooldownMgr);
    }
    return cooldownMgr.acquire(message.guild ? message[command.cooldownLevel].id : message.author.id);
  }
};
