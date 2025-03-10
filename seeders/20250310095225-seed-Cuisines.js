"use strict";
const fs = require("fs").promises;
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    let rows = JSON.parse(await fs.readFile("./data/cuisines.json", "utf8"));
    rows = rows.map((row) => {
      delete row.id;
      row.createdAt = new Date();
      row.updatedAt = new Date();
      return row;
    });
    await queryInterface.bulkInsert("Cuisines", rows);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete("Cuisines", null, {});
  },
};
