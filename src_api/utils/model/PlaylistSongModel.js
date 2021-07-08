const { nanoid } = require('nanoid');

class PlaylistModel {
  constructor(entry) {
    this.id = `playlist_song-${nanoid(10)}`;
    this.playlistId = entry.playlistId;
    this.songId = entry.songId;
  }

  instanceToArray() {
    return [
      this.id,
      this.playlistId,
      this.songId,
    ];
  }
}

module.exports = PlaylistModel;
