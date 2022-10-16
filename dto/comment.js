
module.exports = class Comment {
  constructor (id, content, name, userID) {
    this.id = id;
    this.content = content;
    this.name = name;
    if (userID) {
      this.userID = userID;
    }
  }

  static fromModel (model) {
    return new this(model.id, model.content, model.name, model.userId);
  }
}
