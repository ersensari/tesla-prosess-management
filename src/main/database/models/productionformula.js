"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class ProductionFormula extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      models.ProductionFormula.DosingGroup = models.ProductionFormula.belongsTo(
        models.DosingGroup,
        {
          foreignKey: "groupId",
        }
      );

      models.ProductionFormula.Silo = models.ProductionFormula.belongsTo(
        models.Silo,
        {
          foreignKey: "siloId",
        }
      );

      models.ProductionFormula.RawMaterial = models.ProductionFormula.belongsTo(
        models.RawMaterial,
        {
          foreignKey: "rawMaterialId",
        }
      );

      models.ProductionFormula.Production = models.ProductionFormula.belongsTo(
        models.Production,
        {
          foreignKey: "productionId",
        }
      );
    }
  }
  ProductionFormula.init(
    {
      productionId: DataTypes.INTEGER,
      groupId: DataTypes.INTEGER,
      siloId: DataTypes.INTEGER,
      rawMaterialId: DataTypes.INTEGER,
      dosingOrder: DataTypes.INTEGER,
      amount: DataTypes.DECIMAL(10, 3),
      shutoff1: DataTypes.DECIMAL(10, 3),
      shutoff2: DataTypes.DECIMAL(10, 3),
      shutoff3: DataTypes.DECIMAL(10, 3),
      tolerance: DataTypes.DECIMAL(10, 3),
    },
    {
      sequelize,
      modelName: "ProductionFormula",
    }
  );
  return ProductionFormula;
};
