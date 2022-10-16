'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Comments', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      artworkId: {
        allowNull: false,
        type: Sequelize.INTEGER,
        references: {
          model: 'Artworks',
          key: 'id'
        }
      },
      content: {
        type: Sequelize.TEXT
      },
      name: {
        type: Sequelize.STRING
      },
      userId: {
        allowNull: true,
        type: Sequelize.INTEGER,
        references: {
          model: 'Users',
          key: 'id'
        }
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
    // this unique constraint enforces the requirement that a guest user may
    // only leave one comment per artwork
    // note that it works (and does not prevent registered users from
    // commenting repeatedly) because it does not restrict multiple
    // (artwork,null) pairs
    await queryInterface.addConstraint('Comments', {
      fields: ['artworkId', 'name'],
      type: 'unique',
      name: 'one_comment_per_art_per_guest_user'
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('Comments');
  }
};