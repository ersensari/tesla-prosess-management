'use strict';
const { Model } = require('sequelize');
const moment = require('moment');
const db = require('..');
module.exports = (sequelize, DataTypes) => {
  class Production extends Model {
    static associate(models) {
      models.Production.Groups = models.Production.hasMany(models.ProductionGroup, {
        as: 'Groups',
        foreignKey: 'productionId',
        onDelete: 'CASCADE',
      });
      models.Production.Details = models.Production.hasMany(models.ProductionFormula, {
        as: 'Details',
        foreignKey: 'productionId',
        onDelete: 'CASCADE',
      });
      models.Production.StartedUser = models.Production.belongsTo(models.User, {
        foreignKey: 'startedBy',
        as: 'StartedUser',
      });
    }
  }

  Production.init(
    {
      formulaNo: DataTypes.STRING,
      version: DataTypes.STRING,
      name: DataTypes.STRING,
      shortName: DataTypes.STRING,
      explanation: DataTypes.STRING,
      formulaDate: {
        type: DataTypes.DATE,
        get() {
          return moment(this.getDataValue('formulaDate'))._d;
        },
      },
      sapCode: DataTypes.STRING,
      sampleRate: DataTypes.INTEGER,
      mixerBottomCoverOpeningTime: DataTypes.INTEGER,
      mixerLowSpeedRunSet: DataTypes.INTEGER,
      mixerHighSpeedRunSet: DataTypes.INTEGER,
      mixerMixTime: DataTypes.INTEGER,
      chopperEnginesRuningTime: DataTypes.INTEGER,
      chopperEngine1Permit: DataTypes.BOOLEAN,
      chopperEngine2Permit: DataTypes.BOOLEAN,
      chopperEngine3Permit: DataTypes.BOOLEAN,
      dustExtractionPermit: DataTypes.BOOLEAN,
      batchCount: DataTypes.INTEGER,
      productionDate: {
        type: DataTypes.DATE,
        get() {
          return moment(this.getDataValue('productionDate'))._d;
        },
      },
      productionAmount: DataTypes.DECIMAL(10, 3),
      selected: DataTypes.BOOLEAN,
      startedAt: {
        type: DataTypes.DATE,
        get() {
          const date = this.getDataValue('startedAt');
          if (date) return moment(date)._d;
          else return null;
        },
      },
      finishedAt: {
        type: DataTypes.DATE,
        get() {
          const date = this.getDataValue('finishedAt');
          if (date) return moment(date)._d;
          else return null;
        },
      },
      startedBy: DataTypes.INTEGER,
    },
    {
      sequelize,
      modelName: 'Production',
    }
  );
  return Production;
};
