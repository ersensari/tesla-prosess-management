import { ipcRenderer } from "electron";
import { ref } from "vue";

const loading = ref(false);
const state = {
  authenticating: loading,
  token: undefined,
  user: undefined,
  error: undefined,
};

const mutations = {
  setError: (state, error) => {
    state.error = error;
    state.user = undefined;
    state.token = undefined;
  },
  setToken: (state, context) => {
    state.token = context.token;
    state.user = context.user;
    state.error = undefined;
  },
  removeToken: (state) => {
    state.token = undefined;
    state.user = undefined;
    state.error = undefined;
  },
};

const actions = {
  login: ({ commit }, payload) => {
    ipcRenderer.once("loginCompleted", (_, context) => {
      commit("setToken", context);
      loading.value = false;
    });
    ipcRenderer.once("loginError", (_, error) => {
      commit("setError", error);
      loading.value = false;
    });
    ipcRenderer.send("login", JSON.stringify(payload));
    loading.value = true;
  },

  logout: ({ commit }) => {
    commit("removeToken");
  },
};

export default { namespaced: true, state, mutations, actions };
