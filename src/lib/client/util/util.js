const url = require('url');
const fetch = require('node-fetch');

class Util {
  constructor() {
    throw new Error('This is a static class & may not be initiated with new');
  }

  static randomNumber(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min)) + min;
  }

  static captcha(digits) {
    const generate = (n) => {
      const possibilities = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
      let OTP = '';
      for (let i = 0; i < n; i += 1) OTP += possibilities.charAt(Math.floor(Math.random() * possibilities.length));
      return OTP;
    };
    if (!digits || isNaN(digits)) digits = 5;
    const code = generate(digits); // generates 5 digit code
    return code;
  }

  static delay(ms) {
    return new Promise(r => setTimeout(r, ms));
  }

  static getAttachment(message) {
    const attach = message.attachments.filter(x => x.url && x.width && x.height);
    if (attach.size) return attach.first().url;
    const imageEmbeds = message.embeds.filter(x => x.image && x.image.url);
    if (imageEmbeds.length) return imageEmbeds[0].image.url;
    const urlEmbeds = message.embeds.filter(x => x.type === 'image' && x.url);
    if (urlEmbeds.length) return urlEmbeds[0].url;
    return null;
  }

  static async scrapeSubredditData(subreddit) {
    subreddit = typeof subreddit === 'string' && subreddit.length !== 0 ? subreddit : 'puppies';
    const { body } = await get(`https://reddit.com/r/${subreddit}/hot.json`);
    if (!body.data.children.length) return null;
    const posts = body.data.children;
    if (!posts.length) return null;
    return posts.random().data;
  }

  static isLink(arg) {
    const res = url.parse(arg);
    const goodUrl = res.protocol && res.hostname;
    return goodUrl && (res.protocol === 'https:' || res.protocol === 'http:');
  }

  static isImg(msg) {
    return msg.match(Util.REGEXIMG);
  }

  static shuffle(arr) {
    const array = [];
    arr.forEach(ele => array.push(ele));
    let currIndex = array.length, tempValue, randIndex;
    while(0 !== currIndex) {
      randIndex = Math.floor(Math.random() * currIndex);
      currIndex -= 1;

      tempValue = array[currIndex];
      array[currIndex] = array[randIndex];
      array[randIndex] = tempValue;
    }
    return array;
  }

  static parseTime(milliseconds) {
    const round = milliseconds > 0 ? Math.floor : Math.ceil;
    const days = round(milliseconds / 86400000);
    const hours = round(milliseconds / 3600000) % 24;
    const minutes = round(milliseconds / 60000) % 60;
    const seconds = round(milliseconds / 1000) % 60;

    let result;
    if (!days > 0) result = '';
    else if (hours > 0 || minutes > 0) result += `${days} days `;
    else result += `${days} days `;

    if (!hours > 0) result += '';
    else if (minutes > 0) result += `${hours} hours `;
    else result += `${hours} hours `;

    if (!minutes > 0) result += '';
    else result += `${minutes} minutes `;

    if (seconds !== 0) result += `${seconds} seconds `;

    return result;
  }
}

Util.REGEXIMG = /https?:\/\/(?:\w+\.)?[\w-]+\.[\w]{2,3}(?:\/[\w-_.]+)+\.(?:png|jpg|jpeg|gif|webp)/;

module.exports = Util;
