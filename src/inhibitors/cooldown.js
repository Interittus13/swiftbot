const { Inhibitor } = require('../index');

module.exports = class extends Inhibitor {
  constructor(...args) {
    super(...args, {
      spamProtection: true,
    });
  }

  run(message, command) {
    if (command.cooldown <= 0) return;

    let existing;

    try {
      existing = this.client.finalizers.get('cmdCooldown').getCooldown(message, command);
    } catch (error) {
      return;
    }

    if (existing && existing.limited) throw message.language.get('INHIBITOR_COOLDOWN', Math.ceil(existing.remainingTime / 1000), command.cooldownLevel !== 'author');
  }
};
