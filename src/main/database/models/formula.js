"use strict";
const { Model } = require("sequelize");
const moment = require("moment");
const db = require("..");
module.exports = (sequelize, DataTypes) => {
  class Formula extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      models.Formula.Details = models.Formula.hasMany(models.FormulaDetail, {
        as: "Details",
        foreignKey: "formulaId",
        onDelete: "CASCADE",
      });
    }
  }

  Formula.init(
    {
      formulaNo: DataTypes.STRING,
      version: DataTypes.STRING,
      name: DataTypes.STRING,
      shortName: DataTypes.STRING,
      explanation: DataTypes.STRING,
      formulaDate: {
        type: DataTypes.DATE,
        get() {
          return moment(this.getDataValue("formulaDate"))._d;
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
    },
    {
      sequelize,
      modelName: "Formula",
    }
  );
  return Formula;
};
