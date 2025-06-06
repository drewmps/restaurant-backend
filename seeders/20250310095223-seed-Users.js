"use strict";

const { hashPassword } = require("../helpers/bcrypt");

const fs = require("fs").promises;
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    let rows = JSON.parse(await fs.readFile("./data/users.json", "utf8"));
    rows = rows.map((row) => {
      delete row.id;
      row.password = hashPassword(row.password);
      row.createdAt = new Date();
      row.updatedAt = new Date();
      return row;
    });
    await queryInterface.bulkInsert("Users", rows);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete("Users", null, {});
  },
};
