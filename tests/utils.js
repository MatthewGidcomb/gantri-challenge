const Umzug = require('umzug');
const path = require('path');

const { sequelize, Sequelize } = require('../db/models');

module.exports.resetDb = async function () {
  const umzug = new Umzug({
    migrations: {
      path: path.join('db', 'migrations'),
      params: [
        sequelize.getQueryInterface(),
        Sequelize
      ]
    },
    storage: 'sequelize',
    storageOptions: {
      sequelize
    }
  });
  await umzug.down({ to: 0 });
  await umzug.up();
};

module.exports.createUser = async function (user) {
  return await sequelize.models.User.create(user);
}

module.exports.createArt = async function (art) {
  return await sequelize.models.Artwork.create(art);
}

module.exports.createComment = async function (artworkId, comment) {
  const artwork = await sequelize.models.Artwork.findByPk(artworkId);
  return await artwork.createComment(comment);
}