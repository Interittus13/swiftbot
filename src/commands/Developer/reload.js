const { Command, Store } = require('../../index');

class Reload extends Command {
  constructor(...args) {
    super(...args, {
      name: 'reload',
      description: language => language.get('CMD_RELOAD_DESCRIPTION'),
      example: ['reload help',
        'reload ping'],
      category: 'Developer',
      permLevel: 10,
      guarded: true,
      usage: '<store | piece>',
    });
  }

  async run(message, [piece]) {
    piece = await this.resolve(piece);

    if (piece instanceof Store) {
      await piece.loadAll();
      await piece.init();
      if (this.client.shard) {
        await this.client.shard.broadcastEval((c) => {
          if (c.shard.ids !== this.shard.ids) this[`${piece.name}`].loadAll().then(() => this[`${piece.name}`].loadAll());
        });
      }
      return message.channel.send(message.language.get('CMD_RELOAD_ALL', piece));
    }

    try {
      const item = await piece.reload();
      if (this.client.shard) {
        await this.client.shard.broadcastEval((c) => {
          if (c.shard.ids !== this.shard.ids) this[`${piece.store}`].get(`${piece.name}`).reload();
        });
      }
      this.client.logger.log(`Successfully reloaded ${item.type} ${item.name}`);
      return message.channel.send(message.language.get('CMD_RELOAD_ITEM', item.type, item.name));
    } catch (err) {
      piece.store.set(piece);
      message.channel.send(message.language.get('CMD_RELOAD_FAILED', piece.type, piece.name));
      return this.client.logger.error(err);
    }
  }

  async resolve(pieceOrStore) {
    const store = this.client.pieceStores.get(pieceOrStore);
    if (store) return store;

    for (const store of this.client.pieceStores.values()) {
      const piece = store.get(pieceOrStore);
      if (piece) return piece;
    }

    return false;
  }
}

module.exports = Reload;
