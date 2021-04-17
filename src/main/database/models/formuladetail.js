"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class FormulaDetail extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      models.FormulaDetail.Group = models.FormulaDetail.belongsTo(
        models.DosingGroup,
        {
          foreignKey: "groupId",
        }
      );
      models.FormulaDetail.Silo = models.FormulaDetail.belongsTo(models.Silo);

      models.FormulaDetail.RawMaterial = models.FormulaDetail.belongsTo(
        models.RawMaterial
      );

      models.FormulaDetail.Formula = models.FormulaDetail.belongsTo(
        models.Formula
      );
    }
  }
  FormulaDetail.init(
    {
      formulaId: DataTypes.INTEGER,
      groupId: DataTypes.INTEGER,
      siloId: DataTypes.INTEGER,
      rawMaterialId: DataTypes.INTEGER,
      dosingOrder: DataTypes.INTEGER,
      amount: DataTypes.DECIMAL(10, 2),
      shutoff1: DataTypes.DECIMAL(10, 2),
      shutoff2: DataTypes.DECIMAL(10, 2),
      shutoff3: DataTypes.DECIMAL(10, 2),
      tolerance: DataTypes.DECIMAL(10, 2),
    },
    {
      sequelize,
      modelName: "FormulaDetail",
    }
  );
  return FormulaDetail;
};
