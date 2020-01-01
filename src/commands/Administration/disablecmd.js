const { Command } = require('../../index');

module.exports = class extends Command {
  constructor(...args) {
    super(...args, {
      name: 'disablecmd',
      discription: language => language.get('CMD_DISABLECMD_DESCRIPTION'),
      permLevel: 6,
      guarded: true,
    });
  }

  async run(message, [cmd]) {
    cmd = this.client.commands.get(cmd);

    if (message.guild.settings.get('disabledCmds').indexOf(cmd.name) === -1) {
      await this.dbQuery(message, cmd, 'add');
      message.channel.send(message.language.get('CMD_DISABLEDCMD_DISABLED', cmd.name));
    } else {
      await this.dbQuery(message, cmd, 'remove');
      return message.channel.send(message.language.get('CMD_DISABLEDCMD_ENABLED', cmd.name));
    }
  }

  async dbQuery(message, cmd, action) {
    const curr = message.guild.settings.disabledCmds;

    if (action === 'add') {
      curr.push(cmd.name);
    } else if (action === 'remove') {
      const index = curr.indexOf(cmd.name);
      if (index !== -1) curr.splice(index, 1);
      else throw 'Item does not exist in array';
    } else throw 'Invalid Opreation.';

    const query = await message.guild.settings.update({ disabledCmds: curr })
      .catch((e) => {
        this.client.logger.error(`${this.name} error:\n${e}`);
        throw `There was an error, please contact our support server.${e}`;
      });

    await message.guild.settings.sync(true);
    return query;
  }
};
