const db = require("../index");
const Model = db.Formula;

module.exports = {
  queries: {
    findAll: async () => {
      return await Model.findAll({
        order: ["formulaNo", ["Details", "Silo", "row", "asc"]],
        include: [
          {
            model: db.FormulaDetail,
            as: "Details",
            include: [
              {
                model: db.Silo,
                include: ["RawMaterial"],
              },
              "DosingGroup",
              "RawMaterial",
            ],
          },
        ],
      });
    },
    findById: async (id) => {
      return await Model.findByPk(id, {
        include: [
          {
            model: db.FormulaDetail,
            as: "Details",
            include: [
              {
                model: db.Silo,
                include: ["RawMaterial"],
              },
              "DosingGroup",
              "RawMaterial",
            ],
          },
        ],
      });
    },
  },

  mutations: {
    save: async (payload) => {
      return await Model.create(payload, {
        include: [
          {
            association: db.Formula.Details,
            model: db.FormulaDetail,
            as: "Details",
          },
        ],
      });
    },
    update: async (payload) => {
      await Model.update(payload, {
        where: { id: payload.id },
      })
        .then(() => {
          payload.Details.map((d) =>
            db.FormulaDetail.findByPk(d.id).then(function (obj) {
              if (obj && d.deleted) {
                return db.FormulaDetail.destroy({ where: { id: obj.id } });
              }
              if (obj) return obj.update(d);
              return db.FormulaDetail.create(d);
            })
          );
        })
        .catch((err) => {
          console.log(err);
        });
    },
    delete: async (id) => {
      await Model.destroy({ where: { id: id } });
    },
  },
};
