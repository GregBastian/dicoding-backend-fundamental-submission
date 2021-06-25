const { nanoid } = require('nanoid');

class UserModel {
  constructor(payload, hashedPassword) {
    this.id = `user-${nanoid(10)}`;
    this.username = payload.username;
    this.password = hashedPassword;
    this.fullname = payload.fullname;
  }

  static instance4ExistingEntry(id, entry) {
    const existingModel = new UserModel(entry);
    existingModel.id = id;
    return existingModel;
  }

  instanceToArray() {
    return [
      this.id,
      this.username,
      this.password,
      this.fullname,
    ];
  }

  static mapDBToModel4SingleSong(dbObject) {
    const model = { ...dbObject, insertedAt: dbObject.inserted_at, updatedAt: dbObject.updated_at };
    delete model.inserted_at;
    delete model.updated_at;
    return model;
  }
}

module.exports = UserModel;
