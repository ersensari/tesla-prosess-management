"use strict";
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable("DosingGroupSilos", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      siloId: {
        type: Sequelize.INTEGER,
        references: {
          model: {
            tableName: "Silos",
            schema: "dbo",
          },
          key: "id",
        },
        allowNull: false,
      },
      dosingGroupId: {
        type: Sequelize.INTEGER,
        references: {
          model: {
            tableName: "DosingGroups",
            schema: "dbo",
          },
          key: "id",
        },
        allowNull: false,
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
    });
    await queryInterface.addConstraint("DosingGroupSilos", {
      fields: ["siloId", "dosingGroupId"],
      type: "unique",
      name: "UK_DosingGroupSilos",
    });
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable("DosingGroupSilos");
  },
};
