const { Inhibitor, coreutil } = require('../index');
const { Permissions, Permissions: { FLAGS } } = require('discord.js');

module.exports = class extends Inhibitor {
  constructor(...args) {
    super(...args);

    this.impliedPermissions = new Permissions([
      'VIEW_CHANNEL', 'SEND_MESSAGES', 'EMBED_LINKS', 'ATTACH_FILES', 'READ_MESSAGE_HISTORY',
      'KICK_MEMBERS', 'BAN_MEMBERS', 'MANAGE_GUILD', 'MANAGE_MESSAGES', 'ADD_REACTIONS', 'USE_EXTERNAL_EMOJIS',
      'MENTION_EVERYONE', 'MANAGE_ROLES', 'VIEW_AUDIT_LOG']).freeze();

    this.friendlyPerms = Object.keys(FLAGS).reduce((obj, key) => {
      obj[key] = coreutil.capitalize(key);
      return obj;
    }, {});
  }

  run(message, cmd) {
    const missingPerms = message.channel.type === 'text' ?
      message.channel.permissionsFor(this.client.user).missing(cmd.requiredPerms, false) :
      this.impliedPermissions.missing(cmd.requiredPerms, false);

    if (missingPerms.length) {
      throw message.language.get('INHIBITOR_MISSING_BOT_PERMS', missingPerms.map(key => this.friendlyPerms[key]).join(', '));
    }
  }
};
