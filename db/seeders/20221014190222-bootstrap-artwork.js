'use strict';

const csv = require('csv-parse/sync');
const { promises: fs } = require('fs');
const path = require('path');

const DATA_PATH = path.join('data', 'the-tate-collection.csv');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    return fs.readFile(DATA_PATH).then(function (data) {
      return csv.parse(data, { columns: true, delimiter: ';' });
    }).then(function (data) {
      const NOW = new Date();
      return queryInterface.bulkInsert('Artworks', data.map((row) => ({
        title: row.title,
        artist: row.artist,
        year: parseInt(row.year) || null,
        createdAt: NOW,
        updatedAt: NOW
      })));
    });
  },

  async down (queryInterface, Sequelize) {
    return queryInterface.bulkDelete('Arts', null, {});
  }
};
