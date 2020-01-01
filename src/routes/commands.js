const { Route } = require('../index');

module.exports = class extends Route {
  constructor(...args) {
    super(...args, { route: 'commands' });
  }

  get(req, res) {
    const { cat, lang } = req.query;

    const language = (lang && this.client.languages.get(lang)) ? this.client.languages.get(lang) : this.client.languages.default;

    const commands = (cat ?
      this.client.commands.filter(cmd => cmd.category === cat) :
      this.client.commands
    ).filter(cmd => cmd.permLevel < 9);

    const cmds = commands.map(cmd => ({
      name: cmd.name,
      description: cmd.description(language),
      extended: cmd.extended(language),
      category: cmd.category,
      usage: cmd.usage,
      example: cmd.example,
      bucket: cmd.bucket,
      cooldown: cmd.cooldown,
      subcommands: cmd.subcommands,
      runIn: cmd.runIn,
      permLevel: cmd.permLevel,
      requiredPerms: cmd.requiredPerms.toArray(false),
      requiredSettings: cmd.requiredSettings.slice(0),
      nsfw: cmd.nsfw,
      hidden: cmd.hidden,
      guarded: cmd.guarded,
    }));
    return res.end(JSON.stringify(cmds));
  }
};
