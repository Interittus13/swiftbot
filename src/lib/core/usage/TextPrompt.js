const quotes = ['"', "'", '“”', '‘’'];
const { Collection } = require('discord.js');

class TextPrompt {
  constructor(message, usage, options = {}) {
    Object.defineProperty(this, 'client', { value: message.client });

    this.message = message;
    this.target = options.target || message.author;
    this.channel = options.channel || message.channel;
    this.usage = usage;
    this.reprompted = false;
    this.flags = {};
    this.args = [];
    this.params = [];
    this.time = options.time || 30000;
    this.limit = options.limit || Infinity;
    this.quotedStringSupport = options.quotedStringSupport || false;
    this.flagSupport = options.flagSupport || true;

    this._repeat = false;
    this._required = 0;
    this._prompted = 0;
    this._currentUsage = {};

    this.responses = new Collection();
  }

  async run(prompt) {
    const message = await this.prompt(prompt);
    this.responses.set(message.id, message);
    this._setup(message.content);
    return this.validateArgs();
  }

  async prompt(text) {
    const message = await this.channel.send(text);
    const responses = await message.channel.awaitMessages(msg => msg.author === this.target, { time: this.time, max: 1 });
    message.delete();
    if (responses.size === 0) throw this.message.language.get('MESSAGE_PROMPT_TIMEOUT');
    return responses.first();
  }

  async reprompt(prompt) {
    this._prompted++;
    if (this.typing) this.message.channel.stopTyping();
    const possibleAbortOptions = this.message.language.get('TEXT_PROMPT_ABORT_OPTIONS');
    const edits = this.message.edit.length;
    const message = await this.prompt(
      this.message.language.get('MONITOR_CMD_HANDLER_REPROMPT', `<@!${this.target.id}>`, prompt, this.time / 1000, possibleAbortOptions)
    );
    if (this.message.edit.length !== edits || message.prefix || possibleAbortOptions.includes(message.content.toLowerCase())) throw this.message.language.get('MONITOR_CMD_HANDLER_ABORTED');

    this.responses.set(message.id, message);

    if (this.typing) this.message.channel.startTyping();
    this.args[this.args.lastIndexOf(null)] = message.content;
    this.reprompted = true;

    if (this.usage.parsedUsage[this.params.length].repeat) return this.repeatingPrompt(prompt);
    return this.validateArgs();
  }

  async repeatingPrompt() {
    if (this.typing) this.message.channel.stopTyping();
    let message;
    const possibleCancelOptions = this.message.language.get('TEXT_PROMPT_ABORT_OPTIONS');
    try {
      message = await this.prompt(
        this.message.language.get('MONITOR_CMD_HANDLER_REPEATING_REPROMPT', `<@!${this.message.author.id}>`, this._currentUsage.possibles[0].name, this.time / 1000, possibleCancelOptions)
      );
      this.responses.set(message.id, message);
    } catch (err) {
      return this.validateArgs();
    }

    if (possibleCancelOptions.includes(message.content.toLowerCase())) return this.validateArgs();

    if (this.typing) this.message.channel.startTyping();
    this.args.push(message.content);
    this.reprompted = true;

    return this.repeatingPrompt();
  }

  async validateArgs() {
    if (this.params.length >= this.usage.parsedUsage.length && this.params.length >= this.args.length) {
      return this.finalize();
    } else if (this.usage.parsedUsage[this.params.length]) {
      this._currentUsage = this.usage.parsedUsage[this.params.length];
      this._required = this._currentUsage.required;
    } else if (this._currentUsage.repeat) {
      this._required = 0;
      this._repeat = true;
    } else {
      return this.finalize();
    }

    this._prompted = 0;
    return this.multiPossibles(0);
  }

  async multiPossibles(index) {
    const possible = this._currentUsage.possibles[index];
    const custom = this.usage.customResolvers[possible.type];
    const resolver = this.client.arguments.get(custom ? 'custom' : possible.type);

    if (possible.name in this.flags) this.args.splice(this.params.length, 0, this.flags[possible.name]);
    if (!resolver) {
      this.client.logger.warn(`Unknown Argument Type encountered: ${possible.type}`);
      if (this._currentUsage.possibles.length === 1) return this.pushParam(undefined);
      return this.multiPossibles(++index);
    }

    try {
      const res = await resolver.run(this.args[this.params.length], possible, this.message, custom);
      if (typeof res === 'undefined' && this._required === 1) this.args.splice(this.params.length, 0, undefined);
      return this.pushParam(res);
    } catch (err) {
      if (index < this._currentUsage.possibles.length - 1) return this.multiPossibles(++index);
      if (!this._required) {
        this.args.splice(...this._repeat ? [this.params.length, 1] : [this.params.length, 0, undefined]);
        return this._repeat ? this.validateArgs() : this.pushParam(undefined);
      }

      const { response } = this._currentUsage;
      const error = typeof response === 'function' ? response(this.message, possible) : response;

      if (this._required === 1) return this.handleError(error || err);
      if (this._currentUsage.possibles.length === 1) {
        return this.handleError(error || (this.args[this.params.length] === undefined ? this.message.language.get('CMDMESSAGE_MISSING_REQUIRED', possible.name) : err));
      }
      return this.handleError(error || this.message.language.get('CMDMESSAGE_NOMATCH', this._currentUsage.possibles.map(poss => poss.name).join(', ')));
    }
  }

  pushParam(param) {
    this.params.push(param);
    return this.validateArgs();
  }

  async handleError(err) {
    this.args.splice(this.params.length, 1, null);
    if (this.limit && this._prompted < this.limit) return this.reprompt(err);
    throw err;
  }

  finalize() {
    for (let i = this.params.length - 1; i >= 0 && this.params[i] === undefined; i--) this.params.pop();
    for (let i = this.args.length - 1; i >= 0 && this.args[i] === undefined; i--) this.args.pop();
    return this.params;
  }

  _setup(original) {
    const { content, flags } = this.flagSupport ? this.constructor.getFlags(original, this.usage.usageDelim) : { content: original, flags: {} };
    this.flags = flags;
    this.args = this.quotedStringSupport ?
      this.constructor.getQuotedStringArgs(content, this.usage.usageDelim).map(arg => arg.trim()) :
      this.constructor.getArgs(content, this.usage.usageDelim).map(arg => arg.trim());
  }

  static getFlags(content, delim) {
    const flags = {};
    content = content.replace(this.flagRegex, (match, fl, ...quote) => {
      flags[fl] = (quote.slice(0, -2).find(el => el) || fl).replace(/\\/g, '');
      return '';
    });
    if (delim) content = content.replace(this.delims.get(delim) || this.generateNewDelim(delim), '$1').trim();
    return { content, flags };
  }

  static getArgs(content, delim) {
    const args = content.split(delim !== '' ? delim : undefined);
    return args.length === 1 && args[0] === '' ? [] : args;
  }

  static getQuotedStringArgs(content, delim) {
    if (!delim || delim === '') return [content];

    const args = [];

    for (let i = 0; i < content.length; i++) {
      let current = '';
      if (content.slice(i, i + delim.length) === delim) {
        i += delim.length - 1;
        continue;
      }
      const quote = quotes.find(qt => qt.includes(content[i]));
      if (quote) {
        const qts = quote.split('');
        while (i + 1 < content.length && (content[i] === '\\' || !qts.includes(content[i + 1]))) current += content[++i] === '\\' && qts.includes(content[i + 1]) ? '' : content[i];
        i++;
        args.push(current);
      } else {
        current += content[i];
        while (i + 1 < content.length && content.slice(i + 1, i + delim.length + 1) !== delim) current += content[++i];
        args.push(current);
      }
    }

    return args.length === 1 && args[0] === '' ? [] : args;
  }

  static generateNewDelim(delim) {
    const regex = new RegExp(`(${delim})(?:${delim})+`, 'g');
    this.delims.set(delim, regex);
    return regex;
  }
}

TextPrompt.delims = new Map();
TextPrompt.flagRegex = new RegExp(`(?:--|—)(\\w[\\w-]+)(?:=(?:${quotes.map(qu => `[${qu}]((?:[^${qu}\\\\]|\\\\.)*)[${qu}]`).join('|')}|([\\w<>@#&!-]+)))?`, 'g');

module.exports = TextPrompt;
