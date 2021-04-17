"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable("Formulas", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      formulaNo: {
        allowNull: false,
        type: Sequelize.STRING,
      },
      version: {
        type: Sequelize.INTEGER,
        allowNull: false,
        default: 1,
      },
      name: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      shortName: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      explanation: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      formulaDate: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      sapCode: {
        type: Sequelize.STRING,
      },
      sampleRate: {
        type: Sequelize.INTEGER,
        allowNull: false,
        default: 0,
      },
      mixerBottomCoverOpeningTime: {
        type: Sequelize.INTEGER,
        allowNull: false,
        default: 0,
      },
      mixerLowSpeedRunSet: {
        type: Sequelize.INTEGER,
        allowNull: false,
        default: 0,
      },
      mixerHighSpeedRunSet: {
        type: Sequelize.INTEGER,
        allowNull: false,
        default: 0,
      },
      mixerMixTime: {
        type: Sequelize.INTEGER,
        allowNull: false,
        default: 0,
      },
      chopperEnginesRuningTime: {
        type: Sequelize.INTEGER,
        allowNull: false,
        default: 0,
      },
      chopperEngine1Permit: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        default: false,
      },
      chopperEngine2Permit: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        default: false,
      },
      chopperEngine3Permit: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        default: false,
      },
      dustExtractionPermit: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        default: false,
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
    await queryInterface.addConstraint("Formulas", {
      fields: ["formulaNo", "version"],
      type: "unique",
      name: "UK_Formulas",
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable("Formulas");
  },
};
