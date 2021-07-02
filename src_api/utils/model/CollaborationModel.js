const { nanoid } = require('nanoid');

class CollaborationModel {
  constructor(entry) {
    this.id = `collab-${nanoid(10)}`;
    this.playlistId = entry.playlistId;
    this.userId = entry.userId;
  }

  instanceToArray() {
    return [
      this.id,
      this.playlistId,
      this.userId,
    ];
  }
}

module.exports = CollaborationModel;
