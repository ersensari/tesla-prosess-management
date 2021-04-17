"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class DosingGroupSilo extends Model {
    static associate(models) {
      models.DosingGroupSilo.belongsTo(models.Silo, { as: "Silo" });
      models.DosingGroupSilo.belongsTo(models.DosingGroup, { as: "Dosing" });
    }
  }
  DosingGroupSilo.init(
    {
      siloId: DataTypes.INTEGER,
      dosingGroupId: DataTypes.INTEGER,
    },
    {
      sequelize,
      modelName: "DosingGroupSilo",
    }
  );
  return DosingGroupSilo;
};
