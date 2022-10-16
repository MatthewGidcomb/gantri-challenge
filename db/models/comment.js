'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Comment extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Comment.belongsTo(models.Artwork, { foreignKey: 'artworkId' });
      Comment.belongsTo(models.User, { foreignKey: 'userId' });
    }
  }
  Comment.init({
    content: DataTypes.TEXT,
    name: {
      type: DataTypes.STRING,
      // comments can be made by registered or "guest" users
      // for the latter, their name is stored in the "name" column
      // this getter abstracts away the complexity of determining where the
      // name should come from
      get () {
        const userId = this.getDataValue('userId');
        if (userId && this.User) return this.User.name;
        else return this.getDataValue('name');
      }
    },
    userId: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'Comment',
  });
  return Comment;
};