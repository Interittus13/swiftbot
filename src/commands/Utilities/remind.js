const { Command, config: { emojis } } = require('../../index');
const ms = require('ms');

class Remind extends Command {
  constructor(...args) {
    super(...args, {
      name: 'remind',
      description: language => language.get('CMD_REMIND_DESCRIPTION'),
      usage: 'remind <-list> | <reminder>',
      category: 'Utilities',
      aliases: ['remindme'],
      example: ['remind -list',
        'remind me to check my mails in 1 day',
        'remind me to clean my room in 30 minutes'],
      requiredPerms: ['EMBED_LINKS'],
    });
  }

  async regCheck(reminder) {
    const remind = /(([0-9]{1,3}) ?((?:s(?:ec(?:ond)?)?|(m(?:in(?:ute)?)?|h(?:our)?|d(?:ay)?|w(?:eek)?|m(?:onth)?|y(?:ear)?))s?))\b/gi.exec(reminder);
    if (!remind) return false;
    const time = remind[0];
    // .replace(/ ms?\b/, ' min')
    // .replace(/\ba ?((?:m(?:in(?:ute)?)?|h(?:our)?|d(?:ay)?|w(?:eek)?|m(?:onth)?|y(?:ear)?)s?)\b/g, '1 $1').trim();
    const input = remind.input
      .replace(/\b(in|me|to)\b/g, '')
      .replace(remind[0], '')
      .replace(/ +/, '');
    if (ms(time) < 10000) return false;
    if (input.length === 0) return false;
    return `${input}#${time}`;
  }

  async run(message, [action, ...args]) {
    try {
      // if (action === 'list') {
      //   const reminders = this.client.reminders.findAll('id', message.author.id);
      //   if (!reminders.length) return message.channel.send(`${this.client.config.emojis.error} **${message.author.username}**, You don't have any reminders.`);
      //   const pages = [];

      //   const sort = reminders.sort((a, b) => b.sendAt - a.sendAt);

      //   for (let i = 0; i < sort.length; i += 10) {
      //     const sliced = sort.slice(i, i + 10);

      //     const up = [];
      //     const old = [];
      //     sliced.map((r) => {
      //       if (!r.sent) up.push(`${r.msg}   -    ${moment(r.sendAt).fromNow()}`);
      //       else old.push(`${r.msg}    -    ${moment(r.createdAt).fromNow()}`);
      //     });

      //     if (!up.length) up.push('No upcoming reminders');
      //     if (!old.length) old.push('None');

      //     pages.push({
      //       title: `🗓 **Reminder list for ${message.author.username}**`,
      //       description: `**Upcoming Reminders**\n${up.join('\n')}\n\n**Old Reminders**\n${old.join('\n')}`,
      //     });
      //   }
      //   const paginatorStart = new Paginator(message, pages, '#9ADBAD');
      //   paginatorStart.start();
      //   return null;
      // }

      const blah = await this.regCheck(args.join(' '));
      if (!blah) return this.cmdError(message, this.name);

      const time = Date.now() + ms(blah.split('#')[1]);

      await this.client.schedule.create('reminders', time, {
        data: {
          channel: message.channel.id,
          user: message.author.id,
          text: blah.split('#')[0],
        },
      });

      message.channel.send(`${emojis.success} **Reminder Set**\nI will remind you to \`${blah.split('#')[0]}\`, in ${blah.split('#')[1]} from now.`);
    } catch (error) {
      throw error;
    }
  }
}

module.exports = Remind;
