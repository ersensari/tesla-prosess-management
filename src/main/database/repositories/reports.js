const db = require("../index");
const moment = require("moment");
const { QueryTypes } = require("sequelize");
module.exports = {
  queries: {
    flatProductionList: async (criteria) => {
      let endDate =
        criteria.beginDate === criteria.endDate
          ? moment(criteria.beginDate).add(23, "h").add(59, "m")._d
          : criteria.endDate;

      const result = await db.sequelize.query(
        "select fpl.* from FLAT_PRODUCTION_LIST fpl WHERE fpl.startedAt >= :beginDate and fpl.finishedAt <= :endDate ORDER BY fpl.startedAt desc",
        {
          replacements: {
            beginDate: new Date(
              moment(criteria.beginDate).format("YYYY-MM-DD HH:mm")
            ),
            endDate: new Date(moment(endDate).format("YYYY-MM-DD HH:mm")),
          },
          type: QueryTypes.SELECT,
        }
      );

      return result;
    },
    findByPk: async (id) => {
      return await db.Production.findByPk(id, {
        include: [
          {
            model: db.ProductionGroup,
            as: "Groups",
            include: [
              {
                model: db.DosingGroup,
              },
              {
                model: db.ProductionDetail,
                as: "Details",
                include: [
                  {
                    model: db.Silo,
                    include: ["RawMaterial"],
                  },
                  "RawMaterial",
                ],
              },
            ],
          },
          {
            model: db.ProductionFormula,
            as: "Details",
            include: ["Silo", "RawMaterial"],
          },
        ],
      });
    },
  },
};
