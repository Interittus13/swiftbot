const { Inhibitor, RateLimitManager } = require('../index');

module.exports = class extends Inhibitor {
  constructor(...args) {
    super(...args, {
      spamProtection: true,
    });
    this.slowmode = new RateLimitManager(1, 900);
    this.aggressive = true;
  }

  run(message) {
    const rateLimit = this.slowmode.acquire(message.author.id);

    try {
      rateLimit.drip();
    } catch (error) {
      if (this.aggressive) rateLimit.resetTime();
      throw true;
    }
  }
};
