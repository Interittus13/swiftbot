const { Route, constants: { RESPONSES } } = require('../index');
const { inspect } = require('util');

module.exports = class extends Route {
  constructor(...args) {
    super(...args, {
      route: 'oauth/user/guilds',
      authenticated: true,
    });
  }

  async post(req, res) {
    const guild = this.client.guilds.get(req.body.id);
    const updated = await guild.settings.update(req.body.data, { action: 'overwrite' });
    const errored = Boolean(updated.errors.legth);

    if (errored) this.client.logger.error(`${guild.name}[${guild.id}] failed updating guild configs via dashboard with error:\n${inspect(updated.errors)}`);

    return res.end(RESPONSES.UPDATED[Number(!errored)]);
  }
};
