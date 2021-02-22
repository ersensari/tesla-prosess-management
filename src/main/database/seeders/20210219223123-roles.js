"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert(
      "Roles",
      [
        {
          name: "admin",
          title: "Yönetici",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          name: "operator",
          title: "Operatör",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          name: "reporter",
          title: "Rapor Kullanıcısı",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ],
      {}
    );
  },

  down: async (queryInterface, Sequelize) => {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
  },
};
