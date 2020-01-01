const { Schema, config } = require('../../../../index');

module.exports = new Schema()
  .add('prefix', 'string', { array: Array.isArray(config.defaultSettings.prefix), default: config.defaultSettings.prefix })
  .add('language', 'language', { default: 'en-US' })
  .add('disabledModules', 'string', { array: true, configurable: false })
  .add('disabledCmds', 'command', {
    array: true,
    filter: (client, command, piece, lang) => {
      if (command.guarded) throw lang.get('CMD_CONF_GUARDED', command.name);
    },
  })

// Logging
  .add('serverlogs', folder => folder
    .add('join', 'boolean', { default: false })
    .add('leave', 'boolean', { default: false })
    .add('moderation', 'boolean', { default: false })
    .add('channels', 'boolean', { default: false })
    .add('messages', 'boolean', { default: false })
    .add('automod', 'boolean', { default: false })
    .add('roles', 'boolean', { default: false }))

// Welcome & Leave Greetings
  .add('messages', folder => folder
    .add('join', 'string', { default: 'Welcome {USER_MENTION} to {GUILD_NAME}, we hope you enjoy your stay.' })
    .add('leave', 'string', { default: "It's sad to see you leave {USER_NAME}. hope to see you again." }))

// Pinboard
  .add('pinboard', folder => folder
    .add('channel', 'textchannel')
    .add('required', 'integer', { default: 3 }))

// Mod Logs
  .add('modlogs', 'any', { array: true, configurable: false })

// All Channels
  .add('channels', folder => folder
    .add('modlog', 'textchannel')
    .add('join', 'textchannel')
    .add('leave', 'textchannel')
    .add('log', 'textchannel'))

// Ignore channels
  .add('ignoreChannels', folder => folder
    .add('invites', 'textchannel', { array: true })
    .add('urls', 'textchannel', { array: true })
    .add('persistence', 'textchannel', { array: true }))

// Toggles
  .add('toggles', folder => folder
    .add('joinmsg', 'boolean', { default: false })
    .add('leavemsg', 'boolean', { default: false })
    .add('autorole', 'boolean', { default: false })
    .add('pinboard', 'boolean', { default: false })
    .add('persistence', 'boolean', { default: true })
    .add('log', 'boolean', { default: false })
    .add('modlog', 'boolean', { default: false })
    .add('levelup', 'boolean', { default: true })
    .add('levelrole', 'boolean', { default: false }))

// Automod
  .add('automod', folder => folder
    .add('invites', 'boolean', { default: false })
    .add('urls', 'boolean', { default: false }))

// Permissions
  .add('users', users => users
    .add('admin', 'user', { array: true })
    .add('mod', 'user', { array: true })
    .add('staff', 'user', { array: true }))

// Roles
  .add('roles', roles => roles
    .add('autorole', 'role', { array: true })
    .add('selfrole', 'role', { array: true })
    .add('levelrole', 'any', { array: true, configurable: false })
    .add('admin', 'role')
    .add('mod', 'role')
    .add('staff', 'role')
    .add('muted', 'role'))