const PermissionLevels = require('../../core/permissions/Permissions');

module.exports = new PermissionLevels()
// Everyone
  .add(0, () => true)

// Member is a SwiftBot Moderator in the guild
  .add(4, ({ member, guild }) => {
    if (!guild || !member) return false;
    return member.roles.cache.has(guild.settings.get('roles.mod')) || guild.settings.get('users.mod').includes(member.id);
  }, { fetch: true })

// Member must have Kick/Ban permissions
  .add(5, ({ member, guild }) => {
    if (!guild || !member) return false;
    return member.roles.cache.has(guild.settings.get('roles.mod')) || guild.settings.get('users.mod').includes(member.id) || (member.permissions.has('BAN_MEMBERS') && member.permissions.has('KICK_MEMBERS'));
  }, { fetch: true })

// Member muust have 'MANAGE_GUILD' or 'ADMINISTRATOR' permisisons
  .add(6, ({ member, guild }) => {
    if (!guild || !member) return false;
    return member.roles.cache.has(guild.settings.get('roles.admin')) || guild.settings.get('users.admin').includes(member.id) || (member.permissions.has('ADMINISTRATOR') && member.permissions.has('MANAGE_GUILD'));
  }, { fetch: true })

// Member using this command must be the Guild owner
  .add(7, ({ member, guild }) => {
    if (!guild || !member) return false;
    return member === guild.owner;
  }, { fetch: true })

// Allows the Bot Owner to use any lower commands
  .add(9, ({ author, client }) => client.owners.has(author), { break: true })

// Allows the Bot Owner to use Owner only commands, which silently fail for others
  .add(10, ({ author, client }) => client.owners.has(author));
