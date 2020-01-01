const Argument = require('./Argument');

class ArgumentMulti extends Argument {
  get base() {
    throw new Error('A "base" getter must be implemented in extended classes.');
  }

  async run(argument, possible, message) {
    const structures = [];
    const { min, max } = possible;
    const { args, usage: { usageDelim } } = message.prompter;
    const index = args.indexOf(argument);
    const rest = args.splice(index, args.length - index);
    const { base } = this;
    let i = 0;

    for (const arg of rest) {
      if (max && i >= max) break;
      try {
        const structure = await base.run(arg, possible, message);
        structures.push(structure);
        i += 1;
      } catch (error) {
        break;
      }
    }

    args.push(rest.splice(0, structures.length).join(usageDelim), ...rest);
    if ((min && structures.length < min) || !structures.length) throw message.language.get('RESOLVER_MULTI_TOO_FEW', base.name, min);
    return structures;
  }
}

module.exports = ArgumentMulti;
