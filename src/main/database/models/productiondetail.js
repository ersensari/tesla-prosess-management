"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class ProductionDetail extends Model {
    static associate(models) {
      models.ProductionDetail.ProductionGroup = models.ProductionDetail.belongsTo(
        models.ProductionGroup
      );

      models.ProductionDetail.Silo = models.ProductionDetail.belongsTo(
        models.Silo
      );

      models.ProductionDetail.RawMaterial = models.ProductionDetail.belongsTo(
        models.RawMaterial
      );
    }
  }
  ProductionDetail.init(
    {
      productionGroupId: DataTypes.INTEGER,
      siloId: DataTypes.INTEGER,
      rawMaterialId: DataTypes.INTEGER,
      dosingOrder: DataTypes.INTEGER,
      amount: DataTypes.DECIMAL(10, 3),
      consumptionAmount: DataTypes.DECIMAL(10, 3),
      diffAmount: DataTypes.DECIMAL(10, 3),
      diffPercent: DataTypes.DECIMAL(10, 2),
    },
    {
      sequelize,
      modelName: "ProductionDetail",
    }
  );
  return ProductionDetail;
};
