'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    const NOW = new Date();
    await queryInterface.bulkInsert('Users', [
      {
        name: 'Ahren',
        age: 24,
        location: 'San Francisco',
        createdAt: NOW,
        updatedAt: NOW
      },
      {
        name: 'John',
        age: 28,
        location: 'San Francisco',
        createdAt: NOW,
        updatedAt: NOW
      }
    ]);
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('Users', null, {});
  }
};
