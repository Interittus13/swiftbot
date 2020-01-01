const { Command, coreutil } = require('../../index');
const { inspect } = require('util');

class Evaluate extends Command {
  constructor(...args) {
    super(...args, {
      name: 'eval',
      description: language => language.get('CMD_EVAL_DESCRIPTION'),
      category: 'Developer',
      aliases: ['ev'],
      botPerms: ['ATTACH_FILES'],
      permLevel: 10,
      guarded: true,
      usage: 'eval <code>',
    });
  }

  async run(message, args) { // eslint-disable-line no-unused-vars
    const code = args.join(' ');

    const token = this.client.token.split('').join('[^]{0,2}');
    const rev = this.client.token.split('').reverse().join('[^]{0,2}');
    const filter = new RegExp(`${token}|${rev}`, 'g');
    try {
      let output = eval(code);
      if (output instanceof Promise || (Boolean(output) && typeof output.then === 'function' && typeof output.catch === 'function')) output = await output;
      output = inspect(output, { depth: 0, maxArrayLength: null });
      output = output.replace(filter, '[TOKEN]');
      output = coreutil.clean(output);

      if (output.length > 2000) {
        if (message.guild) {
          message.channel.send({ files: [{ attachment: Buffer.from(output), name: 'evalOutput.txt' }] });
        }
      } else message.channel.send(`\`SUCCESS\` \`\`\`js\n${output}\n\`\`\``);
    } catch (err) {
      message.channel.send(`\`ERROR\` \`\`\`xl\n${err.stack}\n\`\`\``);
    }
  }
}

module.exports = Evaluate;
