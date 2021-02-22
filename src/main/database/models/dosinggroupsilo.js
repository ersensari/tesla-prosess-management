"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class DosingGroupSilo extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {}
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
