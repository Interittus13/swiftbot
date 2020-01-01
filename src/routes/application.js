const { Route, Duration } = require('../index');

module.exports = class extends Route {
  constructor(...args) {
    super(...args, { route: 'application' });
  }

  get(req, res) {
    return res.end(JSON.stringify({
      users: this.client.users.cache.size,
      guilds: this.client.guilds.cache.size,
      channels: this.client.channels.cache.size,
      shards: this.client.options.shardCount,
      uptime: Duration.toNow(Date.now() - (process.uptime() * 1000)),
      latency: this.client.ws.ping.toFixed(0),
      memory: process.memoryUsage().heapUsed / 1024 / 1024,
      ...this.client.application,
    }));
  }
};
