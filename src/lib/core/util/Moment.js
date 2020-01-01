const { TIME: { SECOND, MINUTE, DAY, DAYS, MONTHS, TIMESTAMP: { TOKENS } } } = require('./constants');

const tokens = new Map([
  // Dates
  ['Y', time => String(time.getFullYear()).slice(2)],
  ['YY', time => String(time.getFullYear()).slice(2)],
  ['YYY', time => String(time.getFullYear())],
  ['YYYY', time => String(time.getFullYear())],
  ['Q', time => String((time.getMonth() + 1) / 3)],
  ['M', time => String(time.getMonth() + 1)],
  ['MM', time => String(time.getMonth() + 1).padStart(2, '0')],
  ['MMM', time => MONTHS[time.getMonth()]],
  ['MMMM', time => MONTHS[time.getMonth()]],
  ['D', time => String(time.getDate())],
  ['DD', time => String(time.getDate()).padStart(2, '0')],
  ['DDD', (time) => {
    const start = new Date(time.getFullYear(), 0, 0);
    const difference = ((time.getMilliseconds() - start.getMilliseconds()) + (start.getTimezoneOffset() - time.getTimezoneOffset())) * MINUTE;
    return String(Math.floor(difference / DAY));
  }],
  ['DDDD', (time) => {
    const start = new Date(time.getFullYear(), 0, 0);
    const difference = ((time.getMilliseconds() - start.getMilliseconds()) + (start.getTimezoneOffset() - time.getTimezoneOffset())) * MINUTE;
    return String(Math.floor(difference / DAY));
  }],
  ['d', (time) => {
    const day = String(time.getDate());
    if (day !== '11' && day.endsWith('1')) return `${day}st`;
    if (day !== '12' && day.endsWith('2')) return `${day}nd`;
    if (day !== '13' && day.endsWith('3')) return `${day}rd`;
    return `${day}th`;
  }],
  ['dd', time => DAYS[time.getDay()].slice(0, 2)],
  ['ddd', time => DAYS[time.getDay()].slice(0, 3)],
  ['dddd', time => DAYS[time.getDay()]],
  ['X', time => String(time.valueOf() / SECOND)],
  ['x', time => String(time.valueOf())],

  // Locales
  ['H', time => String(time.getHours())],
  ['HH', time => String(time.getHours()).padStart(2, '0')],
  ['h', time => String(time.getHours() % 12 || 12)],
  ['hh', time => String(time.getHours() % 12 || 12).padStart(2, '0')],
  ['a', time => time.getHours() < 12 ? 'am' : 'pm'],
  ['A', time => time.getHours() < 12 ? 'AM' : 'PM'],
  ['m', time => String(time.getMinutes())],
  ['mm', time => String(time.getMinutes()).padStart(2, '0')],
  ['s', time => String(time.getSeconds())],
  ['ss', time => String(time.getSeconds()).padStart(2, '0')],
  ['S', time => String(time.getMilliseconds())],
  ['SS', time => String(time.getMilliseconds()).padStart(2, '0')],
  ['SSS', time => String(time.getMilliseconds()).padStart(3, '0')],
  ['T', time => `${String(time.getHours() % 12 || 12)}:${String(time.getMinutes()).padStart(2, '0')} ${time.getHours() < 12 ? 'AM' : 'PM'}`],
  ['t', time => `${String(time.getHours() % 12 || 12)}:${String(time.getMinutes()).padStart(2, '0')}:${String(time.getSeconds()).padStart(2, '0')} ${time.getHours() < 12 ? 'AM' : 'PM'}`],
  ['L', time => `${String(time.getMonth() + 1).padStart(2, '0')}/${String(time.getDate()).padStart(2, '0')}/${String(time.getFullYear())}`],
  ['l', time => `${String(time.getMonth() + 1)}/${String(time.getDate()).padStart(2, '0')}/${String(time.getFullYear())}`],
  ['LL', time => `${MONTHS[time.getMonth()]} ${String(time.getDate()).padStart(2, '0')}, ${String(time.getFullYear())}`],
  ['ll', time => `${MONTHS[time.getMonth()].slice(0, 3)} ${String(time.getDate()).padStart(2, '0')}, ${String(time.getFullYear())}`],
  ['LLL', time => `${MONTHS[time.getMonth()]} ${String(time.getDate()).padStart(2, '0')}, ${String(time.getFullYear())} ${String(time.getHours() % 12 || 12)}:${String(time.getMinutes()).padStart(2, '0')} ${time.getHours() < 12 ? 'AM' : 'PM'}`],
  ['lll', time => `${MONTHS[time.getMonth()].slice(0, 3)} ${String(time.getDate()).padStart(2, '0')}, ${String(time.getFullYear())} ${String(time.getHours() % 12 || 12)}:${String(time.getMinutes()).padStart(2, '0')} ${time.getHours() < 12 ? 'AM' : 'PM'}`],
  ['LLLL', time => `${DAYS[time.getDay()]}, ${MONTHS[time.getMonth()]} ${String(time.getDate()).padStart(2, '0')}, ${String(time.getFullYear())} ${String(time.getHours() % 12 || 12)}:${String(time.getMinutes()).padStart(2, '0')} ${time.getHours() < 12 ? 'AM' : 'PM'}`],
  ['llll', time => `${DAYS[time.getDay()].slice(0, 3)} ${MONTHS[time.getMonth()].slice(0, 3)} ${String(time.getDate()).padStart(2, '0')}, ${String(time.getFullYear())} ${String(time.getHours() % 12 || 12)}:${String(time.getMinutes()).padStart(2, '0')} ${time.getHours() < 12 ? 'AM' : 'PM'}`],
  ['Z', (time) => {
    const offset = time.getTimezoneOffset();
    return `${offset >= 0 ? '+' : '-'}${String(offset / -60).padStart(2, '0')}:${String(offset % 60).padStart(2, '0')}`;
  }],
  ['ZZ', (time) => {
    const offset = time.getTimezoneOffset();
    return `${offset >= 0 ? '+' : '-'}${String(offset / -60).padStart(2, '0')}:${String(offset % 60).padStart(2, '0')}`;
  }],
]);

class Moment {
  constructor(pattern) {
    this.pattern = pattern;
    this._templete = Moment._patch(pattern);
  }

  /**
   * Display the current date
   * @param {(Date|number|string)} [time=new Date()]
   * @returns {string}
   */
  display(time = new Date()) {
    return Moment._display(this._templete, time);
  }

  /**
   * Displays the current UTC date
   * @param {(Date|number|string)} [time = new Date()] The time to display in UTC
   * @returns {string}
   */
  displayUTC(time) {
    return Moment._display(this._templete, Moment.utc(time));
  }

  /**
   * Edits the current pattern
   * @param {string} pattern The new pattern
   * @returns {this}
   */
  edit(pattern) {
    this.pattern = pattern;
    this._templete = Moment._patch(pattern);
    return this;
  }

  toString() {
    return this.display();
  }

  static displayArbitrary(pattern, time = new Date()) {
    return Moment._display(Moment._patch(pattern), time);
  }

  static utc(time = new Date()) {
    time = Moment._resolveDate(time);
    return new Date(time.valueOf() + Moment.timezoneOffset);
  }

  static _display(templete, time) {
    let output = '';
    const parsedTime = Moment._resolveDate(time);
    for (const { content, type } of templete) output += content || tokens.get(type)(parsedTime);
    return output;
  }

  static _patch(pattern) {
    const templete = [];
    for (let i = 0; i < pattern.length; i += 1) {
      let current = '';
      const currentChar = pattern[i];
      const tokenMax = TOKENS.get(currentChar);

      if (typeof tokenMax === 'number') {
        current += currentChar;
        while (pattern[i + 1] === currentChar && current.length < tokenMax) current += pattern[++i];
        templete.push({ type: current, content: null });
      } else if (currentChar === '[') {
        while (i + 1 < pattern.length && pattern[i + 1] !== ']') current += pattern[++i];
        i += 1;
        templete.push({ type: 'literal', content: current });
      } else {
        current += currentChar;
        while (i + 1 < pattern.length && !TOKENS.has(pattern[i + 1]) && pattern[i + 1] !== '[') current += pattern[++i];
        templete.push({ type: 'literal', content: current });
      }
    }
    return templete;
  }

  static _resolveDate(time) {
    return time instanceof Date ? time : new Date(time);
  }
}

Moment.timezoneOffset = new Date().getTimezoneOffset() * 60000;
module.exports = Moment;
