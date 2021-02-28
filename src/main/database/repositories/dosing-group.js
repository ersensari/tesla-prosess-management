const db = require("../index");
const Model = db.DosingGroup;
const Silo = db.Silo;

module.exports = {
  queries: {
    findAll: async () => {
      return await Model.findAll({
        order: ["row"],
        include: [
          {
            model: db.Silo,
            include: db.RawMaterial,
            through: {
              attributes: [],
            },
          },
        ],
      });
    },
  },

  mutations: {
    save: async (payload) => {
      return await Model.create(payload);
    },
    update: async (payload) => {
      return await Model.update(payload, { where: { id: payload.id } });
    },
    delete: async (id) => {
      await Model.destroy({ where: { id: id } });
    },
    assignRawToSilo: async (siloId, rawMaterialId) => {
      await Silo.update({ rawMaterialId }, { where: { id: siloId } });
    },
  },
};
