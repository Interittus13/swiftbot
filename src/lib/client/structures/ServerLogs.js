const { MessageEmbed } = require('discord.js');

module.exports = class ModLog {
  constructor(guild) {
    this.guild = guild;
    this.client = guild.client;

    this.type = null;
    this.color = null;
    this.name = null;
    this.user = null;
    this.data = {};
    this.data.fields = [];
  }

  setType(type) {
    this.type = type;
    return this;
  }

  setColor(type) {
    this.color = this.getColor(type);
    return this;
  }

  setTitle(title = null) {
    this.data.title = title;
    return this;
  }

  setDescription(message = null) {
    this.description = message.length > 1500 ? `${message.substring(0, 1500)}\n...` : message;
    return this;
  }

  setAuthor(name = null, iconURL = null) {
    this.data.author = { name, avatar: iconURL };
    return this;
  }

  addField(name = null, value = null, inline = false) {
    this.data.fields.push({ name, value, inline });
    return this;
  }

  setFooter(name = null) {
    if (Array.isArray(name)) name = name.join(' ');
    this.name = name;
    return this;
  }

  async send() {
    if (!this.guild.settings.get(`serverlogs.${this.type}`)) return;
    const channel = this.guild.channels.cache.get(this.guild.settings.get('channels.log'));
    if (!channel) return;

    if (!channel.embedable) return;
    channel.send({ embeds: [this.embed] });
  }

  get embed() {
    const embed = new MessageEmbed()
      .setColor(this.color)
      .setDescription(this.description)
      .setFooter(this.name, this.client.user.displayAvatarURL({ dynamic: true }));

    if (this.data && this.data.author) embed.setAuthor(this.data.author.name, this.data.author.avatar);
    if (this.data && this.data.title) embed.setTitle(this.data.title);
    if (this.data && this.data.thumbnail) embed.setThumbnail(this.data.thumbnail);
    if (this.data && this.data.fields) {
      for (const field of this.data.fields) {
        embed.addField(field.name, field.value, field.inline);
      }
    }

    return embed;
  }

  getColor(type) {
    switch (type) {
      default: return '#d9534f';
    }
  }
};
