import { ipcRenderer } from "electron";
const MODULE_NAME = "production";

const state = {
  loading: false,
  prodOrders: [],
  error: null,
  notification: null,
  editMode: false,
  newMode: false,
  model: null,
};

const mutations = {
  setProdOrders: (state, items) => {
    state.prodOrders = items;
  },

  addItem: (state, item) => {
    state.prodOrders.push(item);
  },
  updateItem: (state, item) => {
    state.prodOrders = state.prodOrders.splice(
      state.prodOrders.indexOf((x) => x.id === item.id),
      1,
      item
    );
  },
  removeItem: (state, id) => {
    state.prodOrders.splice(
      state.prodOrders.find((x) => x.id === id),
      1
    );
  },
  setError: (state, error) => {
    state.error = error;
  },
  setLoadingStatus: (state, status) => {
    state.loading = status;
  },
  setNotification: (state, notify) => {
    state.notification = notify;
  },
  setFormMode: (state, { editMode, newMode, model }) => {
    state.editMode = editMode;
    state.newMode = newMode;
    state.model = model;
  },
};

const actions = {
  findAll: ({ commit }) => {
    commit("setLoadingStatus", true);

    ipcRenderer.once(MODULE_NAME + ".findAllCompleted", (_, result) => {
      commit("setProdOrders", result);
      commit("setLoadingStatus", false);
    });
    ipcRenderer.once(MODULE_NAME + ".findAllError", (_, error) => {
      commit("setError", error);
      commit("setLoadingStatus", false);
      commit("setNotification", {
        type: "error",
        message: "Hata oluştu !",
        description: error.message,
      });
    });
    ipcRenderer.send(MODULE_NAME + ".findAll");
  },
  findByPk: ({ commit }, id) => {
    commit("setLoadingStatus", true);

    ipcRenderer.once(MODULE_NAME + ".findByPkCompleted", (_, result) => {
      commit("setFormMode", { editMode: false, newMode: false, model: result });
      commit("setLoadingStatus", false);
    });
    ipcRenderer.once(MODULE_NAME + ".findByPkError", (_, error) => {
      commit("setError", error);
      commit("setLoadingStatus", false);
      commit("setNotification", {
        type: "error",
        message: "Hata oluştu !",
        description: error.message,
      });
    });
    ipcRenderer.send(MODULE_NAME + ".findByPk", id);
  },
  save: async ({ commit }, payload) => {
    return new Promise((resolve, reject) => {
      commit("setLoadingStatus", true);

      ipcRenderer.once(MODULE_NAME + ".saveCompleted", (_, result) => {
        commit("addItem", result);
        commit("setLoadingStatus", false);
        commit("setNotification", {
          type: "success",
          message: "Üretim Emirleri",
          description: "Kaydetme işlemi tamamlandı.",
        });
        commit("setFormMode", { editMode: false, newMode: false, model: null });
        resolve(result);
      });
      ipcRenderer.once(MODULE_NAME + ".saveError", (_, error) => {
        commit("setError", error);
        commit("setLoadingStatus", false);
        commit("setNotification", {
          type: "error",
          message: "Hata oluştu !",
          description: error.message,
        });
      });
      ipcRenderer.send(
        MODULE_NAME + ".save",
        JSON.parse(JSON.stringify(payload))
      );
    });
  },

  update: async ({ commit }, payload) => {
    return new Promise((resolve, reject) => {
      commit("setLoadingStatus", true);

      ipcRenderer.once(MODULE_NAME + ".updateCompleted", (_, result) => {
        commit("updateItem", result);
        commit("setLoadingStatus", false);
        commit("setNotification", {
          type: "success",
          message: "Üretim Emirleri",
          description: "Güncelleme işlemi tamamlandı.",
        });
        commit("setFormMode", { editMode: false, newMode: false, model: null });
        resolve(result);
      });
      ipcRenderer.once(MODULE_NAME + ".updateError", (_, error) => {
        commit("setError", error);
        commit("setLoadingStatus", false);
        commit("setNotification", {
          type: "error",
          message: "Hata oluştu !",
          description: error.message,
        });
      });
      ipcRenderer.send(
        MODULE_NAME + ".update",
        JSON.parse(JSON.stringify(payload))
      );
    });
  },

  remove: ({ commit }, id) => {
    commit("setLoadingStatus", true);

    ipcRenderer.once(MODULE_NAME + ".deleteCompleted", () => {
      commit("removeItem", id);
      commit("setLoadingStatus", false);
      commit("setNotification", {
        type: "success",
        message: "Üretim Emirleri",
        description: "Silme işlemi tamamlandı.",
      });
    });
    ipcRenderer.once(MODULE_NAME + ".deleteError", (_, error) => {
      commit("setError", error);
      commit("setLoadingStatus", false);
      commit("setNotification", {
        type: "error",
        message: "Hata oluştu !",
        description: error.message,
      });
    });
    ipcRenderer.send(MODULE_NAME + ".delete", id);
  },
};

export default { namespaced: true, state, mutations, actions };
