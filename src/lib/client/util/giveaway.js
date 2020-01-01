const { MessageEmbed } = require('discord.js');

module.exports = {

  async run(client) {
    setInterval(async () => {
      const all = client.giveaway.filter(g => !g.ended);
      all.forEach(async (give) => {
        const endAt = give.createdAt + give.time;
        const remaining = endAt - Date.now();

        const chan = client.channels.get(give.cID);
        if (!chan) return this.giveawayEnded(client, give);

        const msg = await chan.messages.fetch(give.mID);
        if (!msg) return this.giveawayEnded(client, give);

        const sentence = client.utils.parseTime(remaining);
        if (remaining < 0) return this.endGiveaway(client, give, chan, msg, endAt);
        const embed = new MessageEmbed()
          .setAuthor(give.prize)
          .setColor('GREEN')
          .setFooter(`${give.winners} winners | Ends at`)
          .setDescription(`React with 🎁 to participate!\nTime remaining: **${sentence}**`)
          .setTimestamp(new Date(endAt).toISOString());
        msg.edit({ embed });

        if (remaining < 20000) {
          setTimeout(() => {
            this.endGiveaway(client, give, chan, msg, endAt);
          }, remaining);
        }
      });
    }, 20000);
  },

  async endGiveaway(client, give, chan, msg, endAt) {
    const react = await msg.reactions.find(r => r.emoji.name === '🎁').users.fetch();
    let users;
    if (react) users = react.filter(u => !u.bot && chan.guild.members.get(u.id));
    const embed = new MessageEmbed();
    if (users.size > 0) {
      const winners = users.random(give.winners).filter(u => u).map(w => `<@${w.id}>`).join(', ');
      const str = `${'winners'.substr(0, 1).toUpperCase()}${'winners'.substr(1, 'winners'.length)}: ${winners}`;
      embed.setColor('GREEN')
        .setDescription(str)
        .setFooter('Ended')
        .setTimestamp(new Date(endAt).toISOString());
      msg.edit(`Congratulations, ${winners}! You won **${give.prize}**!`, { embed });
      this.giveawayEnded(client, give);
    } else {
      embed.setAuthor(give.prize)
        .setColor('GREEN')
        .setDescription('Giveaway cancelled, no valid participations.')
        .setFooter('Ended')
        .setTimestamp(new Date(endAt).toISOString());
      msg.edit({ embed });
      this.giveawayEnded(client, give);
    }
  },

  async giveawayEnded(client, give) {
    const data = client.giveaway.find(g => g.createdAt === give.createdAt);
    data.ended = true;
    client.giveaway.set(`${give.gID}-${give.createdAt}`, data);
    console.log(client.giveaway.get(`${give.gID}-${give.createdAt}`));
  },
};
