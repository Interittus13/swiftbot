const { promisify } = require('util');
const { exec } = require('child_process');
const { Guild, GuildChannel, Message } = require('discord.js');
const { randomBytes, createCipheriv, createDecipheriv } = require('crypto');

const zws = String.fromCharCode(8203);
let sensitivePattern;
const TOTITLECASE = /[A-Za-zÀ-ÖØ-öø-ÿ]\S*/g;
const REGEXPESC = /[-/\\^$*+?.()|[\]{}]/g;
const [SLASH, COLON] = [47, 58];

class Util {
  constructor() {
    throw new Error('The class may not be initiated with new');
  }

  static clean(text) {
    return text.replace(sensitivePattern, '「ｒｅｄａｃｔｅｄ」').replace(/`/g, `\`${zws}`).replace(/@/g, `@${zws}`);
  }

  static initClean(client) {
    sensitivePattern = new RegExp(Util.regExpEsc(client.token), 'gi');
  }

  static toTitleCase(str) { // hello world => Hello World
    return str.replace(TOTITLECASE, txt => Util.titleCaseVariants[txt] || txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase());
  }
      
  static capitalize(str) { // hello_world => Hello World
    return str.split('_').map(Util.toTitleCase).join(' ');
  }

  static regExpEsc(str) {
    return str.replace(REGEXPESC, '\\$&');
  }

  static chunk(entries, chunkSize) {
    if (!Array.isArray(entries)) throw new TypeError('entries is not an array.');
    if (!Number.isInteger(chunkSize)) throw new TypeError('chunkSize is not an integer.');
    const clone = entries.slice();
    const chunks = [];
    while (clone.length) chunks.push(clone.splice(0, chunkSize));
    return chunks;
  }

  static mergeObjs(objTarget = {}, objSource) {
    for (const key in objSource) objTarget[key] = Util.isObj(objSource[key]) ? Util.mergeObjs(objTarget[key], objSource[key]) : objSource[key];
    return objTarget;
  }

  static deepClone(source) {
    // Check if it's a primitive (with exception of function and null, which is typeof object)
    if (source === null || Util.isPrimitive(source)) return source;
    if (Array.isArray(source)) {
      const output = [];
      for (const value of source) output.push(Util.deepClone(value));
      return output;
    }
    if (Util.isObject(source)) {
      const output = {};
      for (const [key, value] of Object.entries(source)) output[key] = Util.deepClone(value);
      return output;
    }
    if (source instanceof Map) {
      const output = new source.constructor();
      for (const [key, value] of source.entries()) output.set(key, Util.deepClone(value));
      return output;
    }
    if (source instanceof Set) {
      const output = new source.constructor();
      for (const value of source.values()) output.add(Util.deepClone(value));
      return output;
    }
    return source;
  }

  static isFn(input) {
    return typeof input === 'function';
  }

  static isClass(input) {
    return typeof input === 'function' &&
    typeof input.prototype === 'object' &&
    input.toString().substring(0, 5) === 'class';
  }

  static isObj(input) {
    return input && input.constructor === Object;
  }

  static isNum(input) {
    return typeof input === 'number' && !isNaN(input) && Number.isFinite(input);
  }

  static isPrimitive(value) {
    return Util.PRIMITIVE_TYPES.includes(typeof value);
  }

  static isThenable(input) {
    if (!input) return false;
    return (input instanceof Promise) ||
			(input !== Promise.prototype && Util.isFn(input.then) && Util.isFn(input.catch));
  }

  static tryParse(value) {
    try {
      return JSON.parse(value);
    } catch (err) {
      return value;
    }
  }

  static makeObj(path, value, obj = {}) {
    if (path.indexOf('.') === -1) {
      obj[path] = value;
    } else {
      const route = path.split('.');
      const lastKey = route.pop();
      let reference = obj;
      for (const key of route) {
        if (!reference[key]) reference[key] = {};
        reference = reference[key];
      }
      reference[lastKey] = value;
    }
    return obj;
  }

  static objToTuples(object, prefix = '') {
    const entries = [];
    for (const [key, value] of Object.entries(object)) {
      if (Util.isObj(value)) {
        entries.push(...Util.objToTuples(value, `${prefix}${key}.`));
      } else {
        entries.push([`${prefix}${key}`, value]);
      }
    }

    return entries;
  }

  static arrayStrictEquals(arr1, arr2) {
    if (arr1 === arr2) return true;
    if (arr1.length !== arr2.length) return false;

    for (let i = 0; i < arr1.length; i++) {
      if (arr1[i] !== arr2[i]) return false;
    }
    return true;
  }

  static mergeDefault(def, given) {
    if (!given) return Util.deepClone(def);
    for (const key in def) {
      if (typeof given[key] === 'undefined') given[key] = Util.deepClone(def[key]);
      else if (Util.isObj(given[key])) given[key] = Util.mergeDefault(def[key], given[key]);
    }

    return given;
  }

  static resolveGuild(client, guild) {
    const type = typeof guild;
    if (type === 'object' && guild !== null) {
      if (guild instanceof Guild) return guild;
      if ((guild instanceof GuildChannel) ||
      (guild instanceof Message)) return guild.guild;
    } else if (type === 'string' && /^\d{17,19}$/.test(guild)) {
      return client.guilds.cache.get(guild) || null;
    }
    return null;
  }

  static split(url) {
    if (url.length === 1 && url.charCodeAt(0) === SLASH) return [url];
    else if (url.charCodeAt(0) === SLASH) url = url.substring(1);
    return url.split('/');
  }

  static parsePart(val) {
    const type = Number(val.charCodeAt(0) === COLON);
    if (type) val = val.substring(1);
    return { val, type };
  }

  static parse(url) {
    return Util.split(url).map(Util.parsePart);
  }

  static encrypt(data, secret) {
    const iv = randomBytes(16);
    const cipher = createCipheriv('aes-256-cbc', secret, iv);
    return `${cipher.update(JSON.stringify(data), 'utf8', 'base64') + cipher.final('base64')}.${iv.toString('base64')}`;
  }

  static decrypt(token, secret) {
    const [data, iv] = token.split('.');
    const decipher = createDecipheriv('aes-256-cbc', secret, Buffer.from(iv, 'base64'));
    return JSON.parse(decipher.update(data, 'base64', 'utf8') + decipher.final('utf8'));
  }
}
Util.exec = promisify(exec);
Util.wait = promisify(setTimeout);

Util.titleCaseVariants = {
  textchannel: 'TextChannel',
  voicechannel: 'VoiceChannel',
  categorychannel: 'CategoryChannel',
  guildmember: 'GuildMember',
};

Util.PRIMITIVE_TYPES = ['string', 'bigint', 'number', 'boolean'];

module.exports = Util;
