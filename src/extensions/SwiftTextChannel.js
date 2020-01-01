const { Structures, Permissions: { FLAGS } } = require('discord.js');

module.exports = Structures.extend('TextChannel', (TextChannel) => {
  class SwiftTextChannel extends TextChannel {
    get readable() {
      return this.permissionsFor(this.guild.me).has(FLAGS.VIEW_CHANNEL, false);
    }

    get postable() {
      return (this.readable && this.permissionsFor(this.guild.me).has(FLAGS.SEND_MESSAGES, false));
    }

    get embedable() {
      return (this.postable && this.permissionsFor(this.guild.me).has(FLAGS.EMBED_LINKS, false));
    }

    get attachable() {
      return (this.postable && this.permissionsFor(this.guild.me).has(FLAGS.ATTACH_FILES, false));
    }
  }
  return SwiftTextChannel;
});
