
module.exports = class Artwork {
  constructor (id, title, artist, year) {
    this.id = id;
    this.title = title;
    this.artist = artist;
    this.year = year;
  }

  static fromModel (model) {
    return new this(model.id, model.title, model.artist, model.year);
  }
}
