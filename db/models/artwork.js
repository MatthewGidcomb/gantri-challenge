'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Artwork extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Artwork.hasMany(models.Comment, { foreignKey: 'artworkId' });
    }
  }
  Artwork.init({
    title: DataTypes.STRING,
    artist: DataTypes.STRING,
    year: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'Artwork',
  });
  return Artwork;
};