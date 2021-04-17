import { ipcRenderer } from "electron";
const MODULE_NAME = "formulas";

const state = {
  loading: false,
  formulas: [],
  error: null,
  notification: null,
  editMode: false,
};

const mutations = {
  setFormulas: (state, items) => {
    state.formulas = items;
  },
  addItem: (state, item) => {
    state.formulas.push(item);
  },
  updateItem: (state, item) => {
    state.formulas = state.formulas.splice(
      state.formulas.indexOf((x) => x.id === item.id),
      1,
      item
    );
  },
  removeItem: (state, id) => {
    state.formulas.splice(
      state.formulas.find((x) => x.id === id),
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
  setEditMode: (state, mode) => {
    state.editMode = mode;
  },
};

const actions = {
  findAll: ({ commit }) => {
    commit("setLoadingStatus", true);

    ipcRenderer.once(MODULE_NAME + ".findAllCompleted", (_, result) => {
      commit("setFormulas", result);
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
  save: async ({ commit }, payload) => {
    return new Promise((resolve, reject) => {
      commit("setLoadingStatus", true);

      ipcRenderer.once(MODULE_NAME + ".saveCompleted", (_, result) => {
        commit("addItem", result);
        commit("setLoadingStatus", false);
        commit("setNotification", {
          type: "success",
          message: "Formüller",
          description: "Kaydetme işlemi tamamlandı.",
        });
        commit("setEditMode", false);
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
          message: "Formüller",
          description: "Güncelleme işlemi tamamlandı.",
        });
        commit("setEditMode", false);
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
        message: "Formüller",
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
