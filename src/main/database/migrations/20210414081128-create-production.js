'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('Productions', {
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
      batchCount: {
        type: Sequelize.INTEGER,
        allowNull: false,
        default: 1,
      },
      productionDate: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      productionAmount: {
        type: Sequelize.DECIMAL(10, 3),
        allowNull: true,
        default: 0,
      },
      selected: {
        type: Sequelize.BOOLEAN,
        allowNull: true,
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
      startedBy: {
        type: Sequelize.INTEGER,
        allowNull: true,
      },
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('Productions');
  },
};
