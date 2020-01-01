const { TIME: { DAY, CRON: { allowedNum, partRegex, wildcardRegex, predefined, tokens, tokensRegex } } } = require('./constants');

class Cron {
  constructor(cron) {
    this.cron = cron.toLowerCase();
    this.normalized = this.constructor._normalize(this.cron);
    [this.minutes, this.hours, this.days, this.months, this.dows] = this.constructor._parseString(this.normalized);
  }

  next(outset = new Date(), origin = true) {
    if (!this.days.includes(outset.getUTCDate()) || !this.months.includes(outset.getUTCMonth() + 1) || !this.dows.includes(outset.getUTCDay())) {
      return this.next(new Date(outset.getTime() + DAY), false);
    }
    if (!origin) return new Date(Date.UTC(outset.getUTCFullYear(), outset.getUTCMonth(), outset.getUTCDate(), this.hours[0], this.minutes[0]));

    const now = new Date(outset.getTime() + 60000);

    for (const hour of this.hours) {
      if (hour < now.getUTCHours()) continue;
      for (const minute of this.minutes) {
        if (hour === now.getUTCHours() && minute < now.getUTCMinutes()) continue;
        return new Date(Date.UTC(outset.getUTCFullYear(), outset.getUTCMonth(), outset.getUTCDate(), hour, minute));
      }
    }

    return this.next(new Date(outset.getTime() + DAY), false);
  }

  static _normalize(cron) {
    if (cron in predefined) return predefined[cron];
    const now = new Date();
    cron = cron.split(' ').map((val, i) => val.replace(wildcardRegex, match => {
      if (match === 'h') return Math.floor(Math.random() * (allowedNum[i][1] + 1));
      if (match === '?') {
        switch (i) {
          case 0: return now.getUTCMinutes();
          case 1: return now.getUTCHours();
          case 2: return now.getUTCDate();
          case 3: return now.getUTCMonth();
          case 4: return now.getUTCDay();
        }
      }
      return match;
    })).join(' ');
    return cron.replace(tokensRegex, match => tokens[match]);
  }

  static _parseString(cron) {
    const parts = cron.split(' ');
    if (parts.length !== 5) throw new Error('Invalid cron provided.');
    return parts.map(Cron._parsePart);
  }

  static _parsePart(cornPart, id) {
    if (cornPart.includes(',')) {
      const res = [];
      for (const part of cornPart.split(',')) res.push(...Cron._parsePart(part, id));
      return [...new Set(res)].sort((a, b) => a - b);
    }

    let [, wild, min, max, step] = partRegex.exec(cornPart);

    if (wild) [min, max] = allowedNum[id];
    else if (!max && !step) return [parseInt(min)];
    return Cron._range(...[parseInt(min), parseInt(max) || allowedNum[id][1]].sort((a, b) => a - b), parseInt(step) || 1);
  }

  static _range(min, max, step) {
    return new Array(Math.floor((max - min) / step) + 1).fill(0).map((val, i) => min + (i * step));
  }
}

module.exports = Cron;
