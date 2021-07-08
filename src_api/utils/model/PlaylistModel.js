const { nanoid } = require('nanoid');

class PlaylistModel {
  constructor(entry) {
    this.id = `playlist-${nanoid(10)}`;
    this.name = entry.name;
    this.owner = entry.owner;
  }

  getOwner() {
    return this.owner;
  }

  static instance4ExistingEntry(id, entry) {
    const existingModel = new PlaylistModel(entry);
    existingModel.id = id;
    return existingModel;
  }

  instanceToArray() {
    return [
      this.id,
      this.name,
      this.owner,
    ];
  }
}

module.exports = PlaylistModel;
