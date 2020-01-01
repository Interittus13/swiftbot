const { MessageEmbed } = require('discord.js');

module.exports = class EmbedBuilder {
  constructor() {
    /* this.data = data;
    this.embed = new MessageEmbed();

    if (this.data.color) this.embed.setColor(this.data.color);
    else this.embed.setColor('RANDOM');

    if (this.data.timestamp) this.embed.setTimestamp(this.data.timestamp);
    else this.embed.setTimestamp();

    if (this.data.author) this.embed.setAuthor(this.data.author.name, this.data.author.image);
    if (this.data.title) this.embed.setTitle(this.data.title);
    if (this.data.url) this.embed.setURL(this.data.url);
    if (this.data.description) this.embed.setDescription(this.data.description);
    if (this.data.thumbnail) this.embed.setThumbnail(this.data.thumbnail);
    if (this.data.image) this.embed.setImage(this.data.image);
    if (this.data.footer) this.embed.setFooter(this.data.footer.name, this.data.footer.image);

    if (this.data.fields) {
      for (const field of this.data.fields) this.embed.addField(field.name, field.value, field.inline);
    }
    return this.embed; */
    this.color = 'RANDOM';
    this.timestamp = Date.now();
    this.data = {};
    this.data.fields = [];
    this.data.blankFields = [];
  }

  setColor(color) {
    this.color = color;
    return this;
  }

  setAuthor(name = null, iconurl = null) {
    this.data.author = { name, avatar: iconurl };
    return this;
  }

  setDescription(message = null) {
    this.data.message = message.length > 1500 ? `${message.substring(0, 1500)}\n...` : message;
    return this;
  }

  setFooter(name = null, iconurl = null) {
    this.data.footer = { name, avatar: iconurl };
    return this;
  }

  setURL(url = null) {
    this.data.url = url;
    return this;
  }

  setTitle(title = null) {
    this.data.title = title;
    return this;
  }

  setImage(img = null) {
    this.data.image = img;
    return this;
  }

  setThumbnail(thumbnail = null) {
    this.data.thumbnail = thumbnail;
    return this;
  }

  addField(name = null, value = null, inline = false) {
    this.data.fields.push({ name, value, inline });
    return this;
  }

  addBlankField(inline = false) {
    this.data.blankFields.push({ inline });
    return this;
  }

  setTimestamp(timestamp) {
    this.data.timestamp = timestamp;
    return this;
  }

  async send(channel) {
    if (channel.postable) return channel.send(this.embed);
  }

  get embed() {
    const embed = new MessageEmbed()
      .setColor(this.color)
      .setTimestamp(this.timestamp);

    if (this.data.title) embed.setTitle(this.data.title);
    if (this.data.message) embed.setDescription(this.data.message);
    if (this.data.author) embed.setAuthor(this.data.author.name, this.data.author.avatar);
    if (this.data.thumbnail) embed.setThumbnail(this.data.thumbnail);
    if (this.data.image) embed.setImage(this.data.image);
    if (this.data.url) embed.setURL(this.data.url);
    if (this.data.footer) embed.setFooter(this.data.footer.name, this.data.footer.avatar);
    if (this.data.fields) {
      for (const field of this.data.fields) {
        embed.addField(field.name, field.value, field.inline);
      }
    }
    if (this.data.blankFields) {
      for (const blankField of this.data.blankFields) {
        embed.addBlankField(blankField.inline);
      }
    }
    return embed;
  }
};
