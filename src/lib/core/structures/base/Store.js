const { join, extname, relative, sep, dirname } = require('path');
const { Collection } = require('discord.js');
const fs = require('fs-nextra');
const { isClass } = require('../../util/util');

class Store extends Collection {

  constructor(client, name, holds) {
    super();
    Object.defineProperty(this, 'client', { value: client });
    Object.defineProperty(this, 'name', { value: name });
    Object.defineProperty(this, 'holds', { value: holds });

    this.userBaseDirectory = dirname(require.main.filename);
  }

  get userDirectory() {
    return join(this.userBaseDirectory, this.name);
  }

  init() {
    return Promise.all(this.map(piece => piece.enabled ? piece.init() : piece.unload()));
  }

  load(directory, file) {
    const loc = join(directory, ...file);
    let piece = null;
    try {
      const Piece = (req => req.default || req)(require(loc));
      if (!isClass(Piece)) throw new TypeError('The exported structure is not a class.');
      piece = this.set(new Piece(this, file, directory));
    } catch (error) {
      this.client.logger.error(`Failed to load file '${loc}'. Error:\n${error.stack || error}`);
    }
    delete require.cache[loc];
    module.children.pop();
    return piece;
  }

  async loadAll() {
    this.clear();
    await Store.walk(this);
    return this.size;
  }

  set(piece) {
    if (!(piece instanceof this.holds)) throw new TypeError(`Only ${this} may be stored in this Store.`);
    const existing = this.get(piece.name);
    if (existing) this.delete(existing);
    else if (this.client.listenerCount('pieceLoaded')) this.client.emit('pieceLoaded', piece);
    super.set(piece.name, piece);
    return piece;
  }

  delete(name) {
    const piece = this.resolve(name);
    if (!piece) return false;
    super.delete(piece.name);
    return true;
  }

  resolve(name) {
    if (name instanceof this.holds) return name;
    return this.get(name);
  }

  toString() {
    return this.name;
  }

  static async walk(store, directory = store.userDirectory) {
    const files = await fs.scan(directory, { filter: (stats, path) => stats.isFile() && extname(path) === '.js' })
      .catch(() => { if (store.client.options.createPiecesFolders) fs.ensureDir(directory).catch(err => store.client.emit('error', err)); });
    if (!files) return true;

    return Promise.all([...files.keys()].map(file => store.load(directory, relative(directory, file).split(sep))));
  }

  static get [Symbol.species]() {
    return Collection;
  }
}

module.exports = Store;
