const db = require("../index");
module.exports = {
  queries: {
    findAll: async () => {
      return await db.Production.findAll({
        order: ["productionDate"],
        include: [
          {
            model: db.ProductionFormula,
            as: "Details",
            include: [
              {
                model: db.Silo,
                include: ["RawMaterial"],
              },
              "RawMaterial",
            ],
          },
          {
            model: db.ProductionGroup,
            as: "Groups",
            include: [
              "DosingGroup",
              {
                model: db.ProductionDetail,
                as: "Details",
                include: ["Silo", "RawMaterial"],
              },
            ],
          },
        ],
      });
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

  mutations: {
    save: async (payload) => {
      return await db.Production.create(payload, {
        include: [
          {
            model: db.ProductionFormula,
            as: "Details",
          },
        ],
      }).catch((err) => console.log(err));
    },
    update: async (payload) => {
      await db.Production.update(payload, {
        where: { id: payload.id },
      }).catch((err) => {
        console.log(err);
      });
    },
    delete: async (id) => {
      await db.Production.destroy({ where: { id: id } });
    },
  },
};
