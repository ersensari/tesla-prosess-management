import { ipcRenderer } from "electron";
const MODULE_NAME = "rawmaterials";

const state = {
  loading: false,
  items: [],
  error: null,
  notification: null,
  editMode: false,
};

const mutations = {
  setItems: (state, items) => {
    state.items = items;
  },
  addItem: (state, item) => {
    state.items.push(item);
  },
  updateItem: (state, item) => {
    state.items = state.items.map((el) => (el.id === item.id ? item : el));
  },
  removeItem: (state, id) => {
    state.items.splice(
      state.items.find((x) => x.id === id),
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
      commit("setItems", result);
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

  save: ({ commit }, payload) => {
    commit("setLoadingStatus", true);

    ipcRenderer.once(MODULE_NAME + ".saveCompleted", (_, result) => {
      commit("addItem", result);
      commit("setLoadingStatus", false);
      commit("setNotification", {
        type: "success",
        message: "Hammaddeler",
        description: "Kaydetme işlemi tamamlandı.",
      });
      commit("setEditMode", false);
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
    ipcRenderer.send(MODULE_NAME + ".save", payload);
  },

  update: ({ commit }, payload) => {
    commit("setLoadingStatus", true);

    ipcRenderer.once(MODULE_NAME + ".updateCompleted", () => {
      commit("updateItem", payload);
      commit("setLoadingStatus", false);
      commit("setNotification", {
        type: "success",
        message: "Hammaddeler",
        description: "Güncelleme işlemi tamamlandı.",
      });
      commit("setEditMode", false);
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
    ipcRenderer.send(MODULE_NAME + ".update", payload);
  },

  remove: ({ commit }, id) => {
    commit("setLoadingStatus", true);

    ipcRenderer.once(MODULE_NAME + ".deleteCompleted", () => {
      commit("removeItem", id);
      commit("setLoadingStatus", false);
      commit("setNotification", {
        type: "success",
        message: "Hammaddeler",
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
