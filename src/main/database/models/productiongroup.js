"use strict";
const moment = require("moment");
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class ProductionGroup extends Model {
    static associate(models) {
      models.ProductionGroup.DosingGroup = models.ProductionGroup.belongsTo(
        models.DosingGroup,
        {
          foreignKey: "groupId",
        }
      );

      models.ProductionGroup.Production = models.ProductionGroup.belongsTo(
        models.Production,
        {
          foreignKey: "productionId",
        }
      );

      models.ProductionGroup.Details = models.ProductionGroup.hasMany(
        models.ProductionDetail,
        {
          as: "Details",
          foreignKey: "productionGroupId",
          onDelete: "CASCADE",
        }
      );
    }
  }
  ProductionGroup.init(
    {
      productionId: DataTypes.INTEGER,
      groupId: DataTypes.INTEGER,
      batchNumber: DataTypes.INTEGER,
      started: DataTypes.BOOLEAN,
      finished: DataTypes.BOOLEAN,
      startedAt: {
        type: DataTypes.DATE,
        get() {
          const date = this.getDataValue("startedAt");
          if (date) return moment(date)._d;
          else return null;
        },
      },
      finishedAt: {
        type: DataTypes.DATE,
        get() {
          const date = this.getDataValue("finishedAt");
          if (date) return moment(date)._d;
          else return null;
        },
      },
    },
    {
      sequelize,
      modelName: "ProductionGroup",
    }
  );
  return ProductionGroup;
};
