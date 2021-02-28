import { ipcRenderer } from "electron";
const MODULE_NAME = "dosinggroup";
const TITLE = "Silo Tanımlama";
const state = {
  loading: false,
  items: [],
  rawMaterials: [],
  error: null,
  notification: null,
  assignModalVisible: false,
};

const mutations = {
  setRawMaterials: (state, items) => {
    state.rawMaterials = items;
  },
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
  setAssignModalVisible: (state, mode) => {
    state.assignModalVisible = mode;
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
  findAllRawMaterials: ({ commit }) => {
    ipcRenderer.once("rawmaterials.findAllCompleted", (_, result) => {
      commit("setRawMaterials", result);
    });
    ipcRenderer.once("rawmaterials.findAllError", (_, error) => {
      commit("setError", error);
      commit("setNotification", {
        type: "error",
        message: "Hata oluştu !",
        description: error.message,
      });
    });
    ipcRenderer.send("rawmaterials.findAll");
  },

  assignRaw: ({ commit }, payload) => {
    commit("setLoadingStatus", true);

    ipcRenderer.once(MODULE_NAME + ".assignRawCompleted", () => {
      commit("setLoadingStatus", false);
      commit("setNotification", {
        type: "success",
        message: TITLE,
        description: "Kaydetme işlemi tamamlandı.",
      });
      commit("setAssignModalVisible", false);
    });
    ipcRenderer.once(MODULE_NAME + ".assignRawError", (_, error) => {
      commit("setError", error);
      commit("setLoadingStatus", false);
      commit("setNotification", {
        type: "error",
        message: "Hata oluştu !",
        description: error.message,
      });
    });
    ipcRenderer.send(MODULE_NAME + ".assignRaw", payload);
  },
};

export default { namespaced: true, state, mutations, actions };
