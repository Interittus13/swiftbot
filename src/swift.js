const { SwiftClient, config } = require('./index');
const { Intents } = require('discord.js');
require('./lib/core/util/prototypes');
require('./extensions/SwiftGuild');
require('./extensions/SwiftMessage');
require('./extensions/SwiftTextChannel');
require('./extensions/SwiftGuildMember');
require('./extensions/SwiftUser');

const errorDirnameRegex = new RegExp(`${__dirname}/`, 'g');

const client = new SwiftClient({
  intents: [Intents.FLAGS.GUILDS,
    Intents.FLAGS.GUILD_MEMBERS,
    Intents.FLAGS.GUILD_MESSAGES,
    Intents.FLAGS.GUILD_MESSAGE_REACTIONS,
    Intents.FLAGS.DIRECT_MESSAGES],
  allowedMentions: { parse: ['users'] },
  typing: true,
  messageSweepInterval: 480,
  messageCacheLifetime: 300,
  commandMessageLifetime: 1300,

  gateways: {
    guilds: {},
    users: {},
    members: {},
    clientStorage: {},
  },
  providers: { default: 'mongodb' },
  owners: ['289633032745517056'],
  regexPrefix: new RegExp(/^((?:Hey |Ok )?Swift(?:,|!| ))/i),
  dashboard: {
    apiPrefix: 'api/',
    origin: '*',
    port: 7770,
    http2: false,
    serverOptions: {
      IncomingMessage: require('./lib/core/apiServer/SwiftIncomingMsg'),
      ServerResponse: require('./lib/core/apiServer/SwiftResponse'),
    },
  },
});

client.login(config.token);

client.on('shardDisconnect', () => client.logger.warn(`Shard ${client.shard.id}: Disconnected!!!`))
  .on('shardReconnecting', () => client.logger.log('Reconnecting...'))
  .on('shardError', (e, shardID) => client.logger.error(`Shard ${shardID}:`, e))
  .on('shardResume', () => client.logger.log(`Shard ${client.shard.id}: Reconnected!!!`))
  .on('warn', info => client.logger.warn(info));

process.on('uncaughtException', (err) => {
  const errMsg = err.stack.replace(errorDirnameRegex, './');
  client.logger.error(`Uncaught Exception: ${errMsg}`);
  process.exit(1);
});

process.on('unhandledRejection', client.logger.error);
