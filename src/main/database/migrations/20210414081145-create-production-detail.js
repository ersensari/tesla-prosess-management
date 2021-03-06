"use strict";

const { DataTypes } = require("sequelize");

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable("ProductionDetails", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER,
      },
      productionGroupId: {
        type: DataTypes.INTEGER,
        onDelete: "CASCADE",
        references: {
          model: {
            tableName: "ProductionGroups",
            schema: "dbo",
          },
          key: "id",
        },
        allowNull: false,
      },
      groupId: {
        type: DataTypes.INTEGER,
        references: {
          model: {
            tableName: "DosingGroups",
            schema: "dbo",
          },
          key: "id",
        },
        allowNull: false,
      },
      siloId: {
        type: DataTypes.INTEGER,
        references: {
          model: {
            tableName: "Silos",
            schema: "dbo",
          },
          key: "id",
        },
        allowNull: true,
      },
      rawMaterialId: {
        type: DataTypes.INTEGER,
        references: {
          model: {
            tableName: "RawMaterials",
            schema: "dbo",
          },
          key: "id",
        },
        allowNull: false,
      },

      dosingOrder: {
        type: DataTypes.INTEGER,
        allowNull: false,
        default: 0,
      },
      amount: {
        type: DataTypes.DECIMAL(10, 3),
        allowNull: false,
        default: 0,
      },
      consumptionAmount: {
        type: DataTypes.DECIMAL(10, 3),
        allowNull: false,
        default: 0,
      },
      diffAmount: {
        type: DataTypes.DECIMAL(10, 3),
        allowNull: false,
        default: 0,
      },
      diffPercent: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
        default: 0,
      },
      createdAt: {
        allowNull: false,
        type: DataTypes.DATE,
      },
      updatedAt: {
        allowNull: false,
        type: DataTypes.DATE,
      },
    });
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable("ProductionDetails");
  },
};
