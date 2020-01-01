const { Console } = require('console');
const moment = require('moment');
const { inspect } = require('util');

class SwiftConsole extends Console {
  constructor(client) {
    super(process.stdout, process.stderr);

    Object.defineProperty(this, 'client', { value: client });

    this.templete = 'DD-MMM-YYYY hh:mm:ss a';
  }

  get timestamp() {
    return moment().format(this.templete);
  }

  write(data, type = 'log') {
    type = type.toLowerCase();
    data = SwiftConsole.parseData(data);
    const { time, message } = SwiftConsole.COLORS[type];
    const timestamp = time(`[${this.timestamp}]`);
    super[SwiftConsole.TYPES[type] || 'log'](data.split('\n').map(str => `${timestamp} ${message(str)}`).join('\n'));
  }

  log(...data) {
    this.write(data, 'log');
  }

  success(...data) {
    this.write(data, 'success');
  }

  warn(...data) {
    this.write(data, 'warn');
  }

  error(...data) {
    this.write(data, 'error');
  }

  debug(...data) {
    this.write(data, 'debug');
  }

  static parseData(data) {
    if (typeof data === 'undefined' || typeof data === 'number' || data === null) return String(data);
    if (typeof data === 'string') return data;
    if (Array.isArray(data)) return data.map(SwiftConsole.parseData).join('\n');
    if (typeof data === 'object') return inspect(data, { depth: 0, colors: true });
    if (data && data.constructor === Error) return data.stack || data.message || String(data);
    return String(data);
  }
}

SwiftConsole.TYPES = {
  debug: 'log',
  error: 'error',
  log: 'log',
  success: 'info',
  warn: 'warn',
};

SwiftConsole.COLORS = {
  debug: {
    time: str => `\u001b[45m${str}\u001b[49m`,
    message: str => `\u001b[m${str}\u001b[m`,
  },
  error: {
    time: str => `\u001b[41m${str}\u001b[49m`,
    message: str => `\u001b[m${str}\u001b[m`,
  },
  log: {
    time: str => `\u001b[44m${str}\u001b[49m`,
    message: str => `\u001b[m${str}\u001b[m`,
  },
  success: {
    time: str => `\u001b[42m${str}\u001b[49m`,
    message: str => `\u001b[m${str}\u001b[m`,
  },
  warn: {
    time: str => `\u001b[103;30m${str}\u001b[49;39m`,
    message: str => `\u001b[m${str}\u001b[m`,
  },
};

module.exports = SwiftConsole;
