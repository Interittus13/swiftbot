const { Command } = require('../../index');

class DisablePiece extends Command {
  constructor(...args) {
    super(...args, {
      name: 'disable',
      description: language => language.get('CMD_DISABLE_DESCRIPTION'),
      category: 'Developer',
      usage: '<Piece:piece>',
      guarded: true,
      permLevel: 10,
    });
  }

  async run(message, [piece]) {
    if ((piece.type === 'event' && piece.name === 'message') || (piece.type === 'monitor' && piece.type === 'cmdHandler')) return message.channel.send('def');

    piece.disable();
    if (this.client.shard) {
      await this.client.shard.broadcastEval(`
      if (String(this.options.shards) !== '${this.client.options.shards}') this.${piece.store}.get('${piece.name}').disable();
      `);
    }
    return message.channel.send('Done disabled.');
  }

  resolvePiece(arg) {
    for (const store of this.client.pieceStores.values()) {
      const piece = store.get(arg);
      if(piece) return piece;
    }
  }
}

module.exports = DisablePiece;
