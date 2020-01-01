const { Route, coreutil: { encrypt }, constants: { RESPONSES }, config } = require('../index');
const { inspect } = require('util');
const fetch = require('node-fetch');

module.exports = class extends Route {
  constructor(...args) {
    super(...args, {
      route: 'oauth/user',
      authenticated: true,
    });
  }

  async api(token) {
    token = `Bearer ${token}`;
    const user = await fetch('https://discordapp.com/api/users/@me', { headers: { Authorization: token } })
      .then(result => result.json());

    await this.client.users.fetch(user.id);
    user.guilds = await fetch('https://discordapp.com/api/users/@me/guilds', { headers: { Authorization: token } })
      .then(result => result.json());

    return this.client.dashboardUsers.add(user);
  }

  async get(req, res) {
    let dashboardUser = this.client.dashboardUsers.cache.get(req.auth.scope[0]);

    if (!dashboardUser) {
      dashboardUser = await this.api(req.auth.token);
      res.setHeader('Authorization', encrypt({
        token: req.auth.token,
        scope: [dashboardUser.id, ...dashboardUser.guilds.filter(g => g.userCanManage).map(g => g.id)],
      }, config.clientSecret));
    }

    return res.end(dashboardUser);
  }

  async post(req, res) {
    const user = await this.client.users.fetch(req.body.id);
    const updated = await user.settings.update(req.body.data, { action: 'overwrite' });
    const errored = Boolean(updated.errors.length);

    if (errored) this.client.logger.error(`${user.username}[${user.id}] failed updating user config via dashboard with error:\n${inspect(updated.errors)}`);

    return res.end(RESPONSES.UPDATED[Number(!errored)]);
  }
};
