const { Schema } = require('../../../../index');

module.exports = new Schema()
// Member Profiles - per guild
  .add('score', 'integer', { default: 0, configurable: false })
  .add('points', 'integer', { default: 0, configurable: false })
  .add('rank', 'integer', { default: 0, configurable: false })