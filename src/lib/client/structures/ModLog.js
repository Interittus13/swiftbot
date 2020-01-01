const { MessageEmbed } = require('discord.js');
const Duration = require('../../client/util/Duration');

module.exports = class ModLog {
  constructor(guild) {
    this.guild = guild;
    this.client = guild.client;

    this.id = null;
    this.evidenceId = null;
    this.case = null;
    this.type = null;
    this.user = null;
    this.moderator = null;
    this.reason = [];
    this.status = null;
    this.timestamp = null;

    this.discipline = {};
    this.addonDiscipline = null;
    this.channel = null;
    this.rules = [];
    this.channelRestrictions = [];
    this.permissions = [];

    this.muteDuration = null;
    this.expiration = null;
    this.expired = null;

    this.resEmbedId = null;
  }

  setType(type) {
    this.type = type;
    if (type === 'mute') this.status = 'Muted';
    else if (type === 'unmute') this.status = 'UnMuted';
    return this;
  }

  setId(id) {
    this.id = id;
    return this;
  }

  setEvidence(id) {
    this.evidenceId = id;
    return this;
  }

  setUser(user) {
    this.user = { id: user.id, tag: user.tag };
    return this;
  }

  setModerator(user) {
    this.moderator = { id: user.id, tag: user.tag, avatar: user.displayAvatarURL({ dynamic: true }) };
    return this;
  }

  setReason(reason = null) {
    if (Array.isArray(reason)) reason = reason.join(' ');
    this.reason.push(reason);
    return this;
  }

  setMuteDuration(time) {
    this.muteDuration = time;
    this.expired = false;
    return this;
  }

  // setExpiration() {
  //   // if (!this.punishedFor) return null;
  //   const expireAt = new Moment('t').display(Date.now() + this.punishedFor);
  //   this.expiration = expireAt;
  //   return this;
  // }

  setDiscipline(discipline) {
    this.discipline = discipline;
    return this;
  }

  setAddonDiscipline(addon = null) {
    if (Array.isArray(addon)) addon = addon.join('; ');
    this.addonDiscipline = addon;
    return this;
  }

  setChannel(channel) {
    this.channel = channel;
    return this;
  }

  setRules(list) {
    this.rules = list;
    return this;
  }

  setChannelRestrictions(list) {
    this.channelRestrictions = list;
    return this;
  }

  setPerms(list) {
    this.permissions = list;
    return this;
  }

  /**
   * Sends an embed to Mod log channel
   * @returns {Promise<SwiftMessage>}
   */
  async send() {
    const channel = this.guild.channels.cache.get(this.guild.settings.get('channels.modlog'));

    // checks if ticket is running
    const logs = await this.guild.settings.modlogs;
    const active = logs.find(s => s.id === this.id && s.user === this.user.id && !s.expired);

    // return console.log('active' + Date.now());

    if (active) { // if active ticket is found
      console.log('inside');
      await this.editCase(active);
      // edit the embed msg
      const msg = await channel.messages.fetch(active.embedId);
      msg.edit({ embeds: [this.embed] });
    } else {
      await this.getCase();
      if (!channel) return;
      if (!channel.embedable) return;

      const mid = await channel.send({ embeds: [this.embed] });
      this.resEmbedId = mid.id;
      this.save();
    }
  }

  get embed() {
    const embed = new MessageEmbed()
      .setTitle('Voilation')
      .setAuthor(this.user.tag, this.user.avatar)
      .setColor(ModLog.color(this.type))
      .addField('Comments', this.reason.join('\n'))
      .addField('Action', this.type, true)
      .setFooter(`Case ${this.case}`);
    if (this.muteDuration) embed.addField('Muted For', Duration.toNow(Date.now() - this.muteDuration), true);

    return embed;
  }

  /**
   * Fetches the new Case number if its a New voilation
   * @returns {SwiftMessage}
   */
  async getCase() {
    this.case = this.guild.settings.get('modlogs').length + 1;
    this.timestamp = new Date().getTime();

    // await this.guild.settings.update('modlogs', this.caseInfo).catch(e => this.client.logger.error(`[Modlog] ${e}`));
    return this.case;
  }

  /**
   * Update the modlog Data and edits the embed message
   * @returns {SwiftMessage}
   */
  async editCase(oldCase) {
    const r = this.client.providers.default.db;

    await r.collection('guilds')
      .findOneAndUpdate({ id: this.guild.id, 'modlogs.embedId': oldCase.embedId },
        { $push: { 'modlogs.$.reason': { $each: [this.reason.join('')], $position: 0 } },
          $set: { 'modlogs.$.expired': true, 'modlogs.$.status': this.status } });

    await this.guild.settings.sync(true);

    // get updated data
    const log = await this.guild.settings.modlogs;
    const modlog = log.find(s => s.id === this.id && s.user === this.user.id);

    this.expired = true;
    this.case = modlog.case;
    this.reason = modlog.reason;
    this.muteDuration = modlog.muteDuration;
    return modlog;
  }

  /**
   * Save the new case info in DB
   */
  async save() {
    await this.guild.settings.update('modlogs', this.caseInfo).catch(e => this.client.logger.error(`[Modlog] ${e}`));
  }

  /**
   * Pack all the case information in an Object
   */
  get caseInfo() {
    return {
      id: this.id,
      eId: this.evidenceId,
      type: this.type,
      user: this.user.id,
      moderator: this.moderator.id,
      reason: this.reason,
      case: this.case,
      timestamp: this.timestamp,
      muteDuration: this.muteDuration,
      status: this.status,
      expired: this.expired,
      embedId: this.resEmbedId,
    };
  }

  /**
   * Gives embed color corresponding to a type
   * @param {string} type the type of case
   * @returns {string}
   */
  static color(type) {
    switch (type) {
      case 'warn': return '#fcc141';
      case 'mute': return '#d6534f';
      case 'unmute': return '#ab9292';
      case 'kick': return '#d9534f';
      case 'softban': return '#d87370';
      case 'ban': return '#ddfcdc';
      case 'unban': return '#ab9292';
      default: return '#ffffff';
    }
  }
};
