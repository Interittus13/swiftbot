const { MessageEmbed } = require('discord.js');

module.exports = class Paginator {
  constructor(message, pages = [], color, reactionsDisabled = false) {
    this.message = message;
    this.rCollector = null;
    this.sentMsg = null;
    this.reactor = message.author;
    this.pages = pages;
    this.currentPage = 0;
    this.pageColor = color;
    this.enabled = false;
    this.awaiting = false;
    this.usingCustom = false;
    this.reactionsDisabled = reactionsDisabled;
    this.emotes = ['⏪', '⬅', '➡', '⏩', '⏸', '🔢'];
  }

  async start() {
    if (!this.enabled) await this.switchPage(0);
    if (this.reactionsDisabled) return;
    this.rCollector = this.sentMsg.createReactionCollector((reaction, user) => this.emotes.includes(reaction.emoji.name) && user.id === this.reactor.id, { time: 120000 });
    this.rCollector.on('collect', async (r, user) => {
      r.users.remove(user);
      switch (r.emoji.name) {
        case '⏪': { await this.firstPage(); break; }
        case '⬅': { await this.backward(); break; }
        case '➡': { await this.forward(); break; }
        case '⏩': { await this.lastPage(); break; }
        case '⏸': { await this.end(); break; }
        case '🔢': { await this.userInputPageSwitch(); break; }
      }
    });
    this.rCollector.on('end', async () => {
      this.enabled = false;
      if (!this.sentMsg.deleted) this.sentMsg.reactions.removeAll();
    });
  }

  async switchPage(pageNum) {
    this.currentPage = pageNum;
    if (this.enabled) {
      if (this.currentPage.toString().match(/-[0-9]/)) return undefined;
      if (this.currentPage < 0 || this.currentPage > this.pages.length) return undefined;
      const embed = new MessageEmbed()
        .setColor(this.pageColor)
        .setFooter(`Showing page ${this.currentPage + 1} of ${this.pages.length}.`)
        .addField(this.pages[this.currentPage].title, this.pages[this.currentPage].description)
        .setImage(this.pages[this.currentPage].image)
        .setThumbnail(this.pages[this.currentPage].thumbnail)
        .addBlankField()
        .addField('Note', 'This menu will expire in 2 Minutes');
      this.sentMsg.edit({ embed });
    } else {
      this.enabled = true;
      this.sentMsg = await this.message.channel.send(new MessageEmbed()
        .setColor(this.pageColor)
        .setFooter(`Showing page ${this.currentPage + 1} of ${this.pages.length}.`)
        .addField(this.pages[this.currentPage].title, this.pages[this.currentPage].description)
        .setImage(this.pages[this.currentPage].image)
        .setThumbnail(this.pages[this.currentPage].thumbnail)
        .addBlankField()
        .addField('Note', 'This menu will expire in 2 Minutes'));
      if (this.reactionsDisabled) return;
      for (const e of this.emotes) {
        if (['⏪', '⏩', '🔢'].includes(e) && this.pages.length <= 5) {} else {
          await this.sentMsg.react(e).catch(() => {});
        }
      }
    }
  }

  async forward() {
    if (this.currentPage !== this.pages.length - 1) return await this.switchPage(this.currentPage + 1);
  }

  async backward() {
    if (this.currentPage > 0) return await this.switchPage(this.currentPage - 1);
  }

  async lastPage() {
    return await this.switchPage(this.pages.length - 1);
  }

  async firstPage() {
    return await this.switchPage(0);
  }

  async userInputPageSwitch() {
    if (this.awaiting) return;
    this.awaiting = true;
    const prompt = await this.message.channel.send('What page would you like to go to? **NOTE: This times out in 10 seconds.**');
    const collected = await this.message.channel.awaitMessages(m => m.author.id === this.reactor.id, { max: 1, time: 10000 });
    this.awaiting = false;
    await prompt.delete();
    if (!collected.size) return;
    const newPage = parseInt(collected.first().content);
    collected.first().delete();
    if (newPage && newPage > 0 && newPage <= this.pages.length) {
      this.switchPage(newPage - 1);
    }
    /* this.mCollector.on('collect', (m) => {
      const userEnd = /cancel|stop/.exec(m.content);
      if (userEnd) {
        tm.delete();
        return this.mCollector.stop();
      }
      if (!this.pages[parseInt(m.content) - 1]) {
        let NAN = false;
        if (isNaN(m.content)) {
          NAN = true;
        } else { NAN = false; }
        return this.message.channel.send(`Invalid page provided \`[${NAN === true ? m.content : parseInt(m.content)}/${this.pages.length}\`]`)
          .then((mm) => {
            setTimeout(() => mm.delete(), 1500);
          });
      } else { this.switchPage(parseInt(m.content) - 1); }
      tm.delete();
      this.mCollector.stop();
    });
    this.mCollector.on('end', (c) => {
      if (c.size === 0) {
        return this.message.channel.send('The selection timed out!')
          .then((m) => {
            setTimeout(() => {
              tm.delete();
              m.delete();
            }, 1500);
          });
      }
    }); */
  }

  async end() {
    this.rCollector.stop();
    this.enabled = false;
    if (!this.sentMsg.deleted) this.sentMsg.reactions.removeAll();
  }
};
