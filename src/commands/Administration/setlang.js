const { Command } = require('../../index');

module.exports = class extends Command {
  constructor(...args) {
    super(...args, {
      name: 'setlang',
      description: language => language.get('CMD_SETLANG_DESCRIPTION'),
      usage: 'setlang <english | hindi>',
      aliases: ['lang', 'changelang', 'updatelang'],
      example: ['setlang english',
        'setlang hindi'],
      permLevel: 6,
    });
  }

  async run(message, [language]) {
    if (!language) return message.channel.send(message.language.get('CMD_SETLANG_LIST'));

    if (/english|eng|en|en-us/i.test(language)) {
      await this.changeLang(message, 'en-US');
    } else if (/hindi|hi|hi-in|हिन्दी/i.test(language)) {
      await this.changeLang(message, 'hi-IN');
    } else {
      throw message.language.get('CMD_SETLANG_ERROR');
    }
  }

  async changeLang(message, language) {
    let currLang = message.guild.settings.language;
    if (currLang === language) throw message.language.get('CMD_SETLANG_USING');

    await message.guild.settings.update('language', language)
    .then(() => currLang = message.guild.settings.language);

    return message.reply(message.language.get('CMD_SETLANG_SUCCESS', currLang));
  }
};
