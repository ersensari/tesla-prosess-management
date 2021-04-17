"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable("ProductionGroups", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      productionId: {
        type: Sequelize.INTEGER,
        onDelete: "CASCADE",
        references: {
          model: {
            tableName: "Productions",
            schema: "dbo",
          },
          key: "id",
        },
        allowNull: false,
      },
      groupId: {
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
      batchNumber: {
        type: Sequelize.INTEGER,
        allowNull: false,
        default: 1,
      },
      started: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        default: false,
      },
      finished: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        default: false,
      },
      startedAt: {
        allowNull: true,
        type: Sequelize.DATE,
      },
      finishedAt: {
        allowNull: true,
        type: Sequelize.DATE,
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
    await queryInterface.addConstraint("ProductionGroups", {
      fields: ["batchNumber", "productionId"],
      type: "unique",
      name: "UK_ProductionGroups",
    });
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable("ProductionGroups");
  },
};
