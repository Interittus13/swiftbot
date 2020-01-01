class RateLimit {
  constructor(bucket, cooldown) {
    this.bucket = bucket;
    this.cooldown = cooldown;

    this.reset();
  }

  get expired() {
    return this.remainingTime === 0;
  }

  get limited() {
    return !(this.remaining > 0 || this.expired);
  }

  get remainingTime() {
    return Math.max(this.time - Date.now(), 0);
  }

  drip() {
    if (this.limited) throw new Error('Ratelimited');
    if (this.expired) this.reset();

    this.remaining--;
    return this;
  }

  reset() {
    return this.resetRemaining().resetTime();
  }

  resetRemaining() {
    this.remaining = this.bucket;
    return this;
  }

  resetTime() {
    this.time = Date.now() + this.cooldown;
    return this;
  }
}

module.exports = RateLimit;
