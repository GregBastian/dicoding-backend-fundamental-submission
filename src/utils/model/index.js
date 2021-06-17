const { nanoid } = require('nanoid');

class SongModel {
  constructor(entry) {
    this.id = nanoid(10);
    this.title = entry.title;
    this.year = entry.year;
    this.performer = entry.performer;
    this.genre = entry.genre;
    this.duration = entry.duration;

    const currentTime = new Date().toISOString();
    this.insertedAt = currentTime;
    this.updatedAt = currentTime;
  }

  instanceToArray() {
    return [
      this.id,
      this.title,
      this.year,
      this.performer,
      this.genre,
      this.duration,
      this.insertedAt,
      this.updatedAt,
    ];
  }

  static allSongsMapDBToModel({ id, title, performer }) {
    return { id, title, performer };
  }
}

module.exports = SongModel;
