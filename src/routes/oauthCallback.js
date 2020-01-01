const { Route, coreutil: { encrypt }, constants: { RESPONSES }, config } = require('../index');
const fetch = require('node-fetch');

module.exports = class extends Route {
  constructor(...args) {
    super(...args, { route: 'oauth/callback' });
  }

  get oauthUser() {
    return this.store.get('oauthUser');
  }

  async post(req, res) {
    if (!req.body.code) return this.noCode(res);

    const url = new URL('https://discordapp.com/api/oauth2/token');
    url.search = new URLSearchParams([
      ['grant_type', 'authorization_code'],
      ['redirect_uri', req.body.redirectUri],
      ['code', req.body.code],
    ]);

    const r = await fetch(url, {
      headers: { Authorization: `Basic ${Buffer.from(`${this.client.user.id}:${config.clientSecret}`).toString('base64')}` },
      method: 'POST',
    });

    if (!r.ok) return res.end(RESPONSES.FETCHING_TOKEN);

    const { oauthUser } = this;
    if (!oauthUser) return this.notReady(res);

    console.log(`Body: ${r}`);
    const body = await r.json();
    const user = await oauthUser.api(body.access_token);


    return res.json({
      access_token: encrypt({
        token: body.access_token,
        scope: [user.id, ...user.guilds.filter(g => g.userCanManage).map(g => g.id)],
      }, config.clientSecret),
      user,
    });
  }


  notReady(res) {
    res.writeHead(500);
    return res.end(RESPONSES.NOT_READY);
  }

  noCode(res) {
    res.writeHead(400);
    return res.end(RESPONSES.NO_CODE);
  }
};
