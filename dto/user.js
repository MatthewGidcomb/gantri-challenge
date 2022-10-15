
module.exports = class User {
  constructor (id, name, age, location) {
    this.id = id;
    this.name = name;
    this.age = age;
    this.location = location;
  }

  static fromModel (model) {
    return new this(model.id, model.name, model.age, model.location);
  }
}
