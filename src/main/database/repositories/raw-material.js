const db = require("../index");
const Model = db.RawMaterial;

module.exports = {
  queries: {
    findAll: async () => {
      return await Model.findAll({ order: ["rawNo"], raw: true });
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
  },
};
