import { ipcRenderer } from "electron";
import moment from "moment";
const MODULE_NAME = "reports";

const state = {
  loading: false,
  result: [],
  error: null,
  notification: null,
  criteria: {
    beginDate: moment()._d,
    endDate: moment()._d,
  },
};

const mutations = {
  setResult: (state, items) => {
    state.result = items;
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
};

const actions = {
  flatProductionList: ({ commit }, criteria) => {
    return new Promise((resolve, reject) => {
      commit("setLoadingStatus", true);

      ipcRenderer.once(
        MODULE_NAME + ".flatProductionListCompleted",
        (_, result) => {
          resolve(result);
          commit("setLoadingStatus", false);
        }
      );
      ipcRenderer.once(MODULE_NAME + ".flatProductionListError", (_, error) => {
        commit("setError", error);
        commit("setLoadingStatus", false);
        commit("setNotification", {
          type: "error",
          message: "Hata oluştu !",
          description: error.message,
        });
        reject(error);
      });
      ipcRenderer.send(
        MODULE_NAME + ".flatProductionList",
        JSON.parse(JSON.stringify(criteria))
      );
    });
  },
  groupedProductionList: ({ commit }, criteria) => {
    return new Promise((resolve, reject) => {
      commit("setLoadingStatus", true);

      ipcRenderer.once(
        MODULE_NAME + ".groupedProductionListCompleted",
        (_, result) => {
          resolve(result);
          commit("setLoadingStatus", false);
        }
      );
      ipcRenderer.once(
        MODULE_NAME + ".groupedProductionListError",
        (_, error) => {
          commit("setError", error);
          commit("setLoadingStatus", false);
          commit("setNotification", {
            type: "error",
            message: "Hata oluştu !",
            description: error.message,
          });
          reject(error);
        }
      );
      ipcRenderer.send(
        MODULE_NAME + ".groupedProductionList",
        JSON.parse(JSON.stringify(criteria))
      );
    });
  },

  findByPk: ({ commit }, id) => {
    new Promise((resolve, reject) => {
      commit("setLoadingStatus", true);

      ipcRenderer.once(MODULE_NAME + ".findByPkCompleted", (_, result) => {
        resolve(result);
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
        reject(error);
      });
      ipcRenderer.send(MODULE_NAME + ".findByPk", id);
    });
  },
};

export default { namespaced: true, state, mutations, actions };
