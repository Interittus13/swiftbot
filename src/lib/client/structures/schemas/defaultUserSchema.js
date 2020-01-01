const { Schema } = require('../../../../index');

module.exports = new Schema()
// User Profiles
  .add('daily', 'integer', { default: 0, configurable: false })
  .add('xp', 'integer', { default: 0, configurable: false })
  .add('credits', 'integer', { default: 0, configurable: false })
  .add('level', 'integer', { default: 0, configurable: false })
  .add('profile', 'string', { default: 'default', configurable: false })
  .add('about', 'string', { default: 'No set', configurable: false, min: 4, max: 30 })

// Inventory
  .add('inventory', folder => folder
    .add('backgrounds', 'string', { array: true }))

// AFK
  .add('afk', folder => folder
    .add('time', 'integer', { configurable: false })
    .add('reason', 'string', { configurable: false }))