const { Collection } = require('discord.js');
const RateLimit = require('./RateLimit');

class RateLimitManager extends Collection {
  constructor(bucket, cooldown) {
    super();

    Object.defineProperty(this, 'sweepInterval', { value: null, writable: true });
    Object.defineProperty(this, '_bucket', { value: bucket, writable: true });
    Object.defineProperty(this, '_cooldown', { value: cooldown, writable: true });
  }

  get bucket() {
    return this._bucket;
  }

  set bucket(value) {
    for (const ratelimit of this.values()) ratelimit.bucket = value;
    this._bucket = value;
    return value;
  }

  get cooldown() {
    return this._cooldown;
  }

  set cooldown(value) {
    for (const ratelimit of this.values()) ratelimit.cooldown = value;
    this._cooldown = value;
    return value;
  }

  acquire(id) {
    return this.get(id) || this.create(id);
  }

  create(id) {
    const rateLimit = new RateLimit(this._bucket, this._cooldown);
    this.set(id, rateLimit);
    return rateLimit;
  }

  set(id, rateLimit) {
    if (!(rateLimit instanceof RateLimit)) throw new TypeError('Invalid RateLimit');
    if (!this.sweepInterval) this.sweepInterval = setInterval(this.sweep.bind(this), 30000);
    return super.set(id, rateLimit);
  }

  sweep(fn = rl => rl.expired, thisArg) {
    const amount = super.sweep(fn, thisArg);

    if (this.size === 0) {
      clearInterval(this.sweepInterval);
      this.sweepInterval = null;
    }

    return amount;
  }

  static get [Symbol.species]() {
    return Collection;
  }
}

module.exports = RateLimitManager;

