"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class RawMaterial extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  RawMaterial.init(
    {
      name: DataTypes.STRING,
      shortName: DataTypes.STRING,
      sapCode: DataTypes.STRING,
      rawNo: DataTypes.STRING,
      explanation: DataTypes.STRING,
      density: DataTypes.DECIMAL(10, 3),
    },
    {
      sequelize,
      modelName: "RawMaterial",
    }
  );
  return RawMaterial;
};
