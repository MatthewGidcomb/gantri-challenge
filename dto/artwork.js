
const Comment = require('./comment');

module.exports = class Artwork {
  constructor (id, title, artist, year, comments) {
    this.id = id;
    this.title = title;
    this.artist = artist;
    this.year = year;
    this.comments = comments;
  }

  static fromModel (model) {
    const comments = model.Comments ? model.Comments.map((model) => Comment.fromModel(model)) : [];
    return new this(model.id, model.title, model.artist, model.year, comments);
  }
}
