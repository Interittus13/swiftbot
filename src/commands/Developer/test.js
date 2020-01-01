const { Permissions: { FLAGS } } = require('discord.js');
const { Command, Moment, Duration, ModLog } = require('../../index');
// const holidays = require('../../lib/client/constants/holidays.json');
// const Embed = require('../../util/embedBuilder');

class Testing extends Command {
  constructor(...args) {
    super(...args, {
      name: 'test',
      description: language => language.get('CMD_TEST_DESCRIPTION'),
      extended: language => language.get('CMD_TEST_EXTENDED'),
      category: 'Developer',
      permLevel: 9,
      requiredPerms: ['ADMINISTRATOR', 'EMBED_LINKS'],
    });
    this.statuses = [
      "Ready",
      "Connecting",
      "Reconnecting",
      "Idle",
      "Nearly",
      "Disconnected"
    ];
  }

  async run(message, args) {

    // await this.client.shard.broadcastEval((c) => {
    //   if (c.shard.ids !== this.shard.ids) console.log(c.shard.ids);
    //   else console.log('What ?');
    // });

    // const date = new Moment('t').display(Date.now() + 300000);
    // const isHoliday = this.client.settings.holiday;
    // console.log(isHoliday.includes(holidays[date]));

    // const duration = Duration.toNow(Date.now() - 300000);
    // const duration = new Duration('min').dateFrom(Date.now() + 3252.7068208);
    // return message.channel.send(`That is: ${duration}`);

    const guild = await this.client.guilds.cache.get('433338283863441439');
    // const member = await guild.members.fetch('289633032745517056');
    // member.roles.add('433341707636178975');

    const role = await guild.roles.cache.get('465412333464715274');
    const ifHas = role.permissions.has(FLAGS.MANAGE_GUILD);

    return message.channel.send(`${ifHas ? 'Yes' : 'No'} Permission.`);

    const r = this.client.providers.default.db; // get('mongodb');

    // const change = ['this'];
    const data = await r.collection('guilds')
      .findOneAndUpdate({ id: message.guild.id, 'modlogs.case': 1 }, { $set: { 'modlogs.$.reason': 'that' } });

    // const logs = message.guild.settings.modlogs;
    // const data = logs.find(s => s.status === 1);

    // const channel = message.guild.channels.cache.get(message.guild.settings.get('channels.modlog'));

    // const msg = await channel.messages.fetch(data.embedId);

    return console.log(data.value.modlogs);

    // const embed = new Embed()
    //   .addField('HI', 'HELLLLO')
    //   .setDescription('Bruhh.. lovely');
    // const values = await this.client.shard.fetchClientValues(`
    // [
    //   this.shard.id,
    //   this.guilds.size
    // ]
    // `);

    // let out = '**SHARD STATUS**\n';
    // values.forEach((v) => {
    //   out += `SHARD #${v[0]} | Server Count: ${v[1]}\n`;
    // });

    await this.client.ws.shards.map((s) => {
      return message.channel.send(`${s.ping}`);
    });

    // const { shards } = this.client.ws;
    // for (let i = 0; i < shards.length; i += 1) {
    //   out.push(`Shard ${i}: ${this.statuses[shards[i].status]}, serving ${counts[i]} guilds`);
    // }
    // const userPerms = this.client.permLevels.find(perm => perm.level === level)
  }

  async resolve(message, memberOrRole) {
    const member = await this.client.resolveMember(message, memberOrRole);
    if (member) {
      return member;
    }

    const role = await this.client.resolveRole(message, memberOrRole);
    if (role) {
      return role;
    }

    return false;
  }
}

module.exports = Testing;
