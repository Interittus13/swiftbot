const { Schema, constants: { MENTION_REGEX } } = require('../../../../index');

module.exports = new Schema()
  .add('userBlacklist', 'user', { array: true })
  .add('guildBlacklist', 'string', { array: true, filter: (__, value) => !MENTION_REGEX.snowflake.test(value) })
  .add('schedules', 'any', { array: true })

  // Notifications
  .add('holiday', 'string', { array: true })

  .add('counter', folder => folder
    .add('total', 'integer')
    .add('commands', 'any', { array: true }));
