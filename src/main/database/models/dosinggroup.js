"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class DosingGroup extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      models.DosingGroup.Silos = models.DosingGroup.belongsToMany(models.Silo, {
        through: models.DosingGroupSilo,
      });
    }
  }
  DosingGroup.init(
    {
      name: DataTypes.STRING,
      explanation: DataTypes.STRING,
      row: DataTypes.INTEGER,
      manual: DataTypes.BOOLEAN,
    },
    {
      sequelize,
      modelName: "DosingGroup",
    }
  );
  return DosingGroup;
};
