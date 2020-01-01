const { Command } = require('../../index');

class EnablePiece extends Command {
  constructor(...args) {
    super(...args, {
      name: 'enable',
      description: language => language.get('CMD_ENABLE_DESCRIPTION'),
      category: 'Developer',
      guarded: true,
      permLevel: 10,
      usage: '<Piece:piece>',
    });
  }

  async run(message, [piece]) {
    piece.enable();
    if (this.client.shard) {
      await this.client.shard.broadcastEval(`
      if (this.shard.id) !== ${this.client.shard.id}) this.${piece.store}.get('${piece.name}').enable();
      `);
    }
    return message.channel.send('Done enabled.');
  }
}

module.exports = EnablePiece;
