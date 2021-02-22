"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Silo extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      models.Silo.RawMaterial = models.Silo.belongsTo(models.RawMaterial);
    }
  }
  Silo.init(
    {
      row: DataTypes.INTEGER,
      code: DataTypes.STRING,
      name: DataTypes.STRING,
      rawMaterialId: DataTypes.INTEGER,
    },
    {
      sequelize,
      modelName: "Silo",
    }
  );
  return Silo;
};
