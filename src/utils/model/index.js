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

  static instance4ExistingEntry(id, entry) {
    const existingModel = new SongModel(entry);
    existingModel.id = id;
    return existingModel;
  }

  instanceToArray4NewEntry() {
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

  instanceToArray4ExistingEntry() {
    return [
      this.title,
      this.year,
      this.performer,
      this.genre,
      this.duration,
      this.updatedAt,
      this.id,
    ];
  }

  static mapDBToModel4SingleSong(dbObject) {
    const model = { ...dbObject, insertedAt: dbObject.inserted_at, updatedAt: dbObject.updated_at };
    delete model.inserted_at;
    delete model.updated_at;
    return model;
  }
}

module.exports = SongModel;
