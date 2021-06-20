import { ipcRenderer } from "electron";
import _ from "lodash";
import moment from "moment-timezone";
const MODULE_NAME = "production";

const state = {
  loading: false,
  prodOrders: [],
  error: null,
  notification: null,
  editMode: false,
  newMode: false,
  model: null,
  selected: null,
  filterDate: {
    productionDate: moment()._d,
  },
};

const mutations = {
  setProdOrders: (state, items) => {
    state.prodOrders = items;
  },

  addItem: (state, item) => {
    state.prodOrders.push(item);
  },
  updateItem: (state, item) => {
    state.prodOrders = _(state.prodOrders).splice(
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
  setSelectedItem: (state, id) => {
    state.prodOrders = state.prodOrders.map((x) => {
      if (x.id === id) x.selected = true;
      else x.selected = false;
      return x;
    });

    state.selected = state.prodOrders.find((x) => x.id === id);

    ipcRenderer.send(
      "GET_SELECTED_ORDER",
      JSON.parse(JSON.stringify(state.selected))
    );
  },
  sendSelectedProdOrderToMain: (state, item) => {
    state.selected = item;
    ipcRenderer.send(
      "GET_SELECTED_ORDER",
      JSON.parse(JSON.stringify(state.selected))
    );
  },
};

const actions = {
  findAll: ({ commit }, criteria) => {
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
    ipcRenderer.send(
      MODULE_NAME + ".findAll",
      JSON.parse(JSON.stringify(criteria))
    );
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
  getActiveOrder: async ({ commit }) => {
    return new Promise((resolve, reject) => {
      commit("setLoadingStatus", true);
      ipcRenderer.once(
        MODULE_NAME + ".getActiveOrderCompleted",
        (_, result) => {
          commit("setLoadingStatus", false);
          resolve(result);
        }
      );
      ipcRenderer.once(MODULE_NAME + ".getActiveOrderError", (_, error) => {
        commit("setError", error);
        commit("setLoadingStatus", false);
        commit("setNotification", {
          type: "error",
          message: "Hata oluştu !",
          description: error.message,
        });
      });
      ipcRenderer.send(MODULE_NAME + ".getActiveOrder");
    });
  },
  selectOrder: async ({ commit }, id) => {
    commit("setLoadingStatus", true);

    ipcRenderer.once(MODULE_NAME + ".updateCompleted", () => {
      commit("setSelectedItem", id);
      commit("setLoadingStatus", false);
      commit("setFormMode", { editMode: false, newMode: false, model: null });
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
    ipcRenderer.send(MODULE_NAME + ".selectOrder", id);
  },
  getSelectedOrder: async ({ commit }) => {
    commit("setLoadingStatus", true);
    ipcRenderer.once(MODULE_NAME + ".getSelectedOrderCompleted", (_, item) => {
      commit("setLoadingStatus", false);
      commit("sendSelectedProdOrderToMain", item);
    });

    ipcRenderer.once(MODULE_NAME + ".getSelectedOrderError", (_, error) => {
      commit("setError", error);
      commit("setLoadingStatus", false);
      commit("setNotification", {
        type: "error",
        message: "Hata oluştu !",
        description: error.message,
      });
    });

    ipcRenderer.send(MODULE_NAME + ".getSelectedOrder");
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
