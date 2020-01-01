const { Command } = require('../../index');

class Loader extends Command {
  constructor(...args) {
    super(...args, {
      name: 'loader',
      description: language => language.get('CMD_LOAD_DESCRIPTION'),
      aliases: ['load'],
      example: ['reload events',
        'reload monitors'],
      category: 'Developer',
      permLevel: 10,
      usage: '<Store:store> <path:...string>',
    });
    this.regExp = /\\\\?|\//g;
  }

  async run(message, [store, path]) {
    store = await this.resolve(store);
    path = (path.endsWith('.js') ? path : `${path}.js`).split(this.regExp);
    const piece = await store.load(store.userDirectory, path);

    try {
      if (!piece) throw message.language.get('CMD_LOAD_FAIL');
      await piece.init();

      this.client.logger.log(`Successfully loaded ${store.name} ${piece.name}.`);
      return message.channel.send(message.language.get('CMD_LOAD_SUCCESS', store.name, piece.name));
    } catch (e) {
      return message.channel.send(`Error Loading files, ${e.message}`);
    }
  }

  async resolve(pieceOrStore) {
    const store = this.client.pieceStores.get(pieceOrStore);
    if (store) return store;

    return false;
  }
}

module.exports = Loader;
