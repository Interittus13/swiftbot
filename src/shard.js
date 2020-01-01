const { ShardingManager } = require('discord.js');
const { SwiftConsole, config } = require('./index');

const sharder = new ShardingManager('./swift.js', {
  totalShards: 'auto',
  token: config.token,
  respawn: true,
});
const logger = new SwiftConsole();

sharder.on('shardCreate', shard => logger.log(`Shard ${shard.id + 1} of ${sharder.totalShards} spawned.`));

sharder.spawn({ amount: sharder.totalShards, delay: 5500, timeout: 30000 }).catch((err) => {
  logger.error(`An error occured while spawning clusters\n${err}`);
});

