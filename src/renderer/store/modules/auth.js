import { ipcRenderer } from "electron";
import { ref } from "vue";

const AUTH_KEY = "tesla_auth_token";
let loading = ref(false);
const state = {
  authenticating: ref(loading),
  token: undefined,
  user: undefined,
  error: undefined,
};

const mutations = {
  setError: (state, error) => {
    state.error = error;
    state.user = undefined;
    state.token = undefined;
    window.localStorage.removeItem(AUTH_KEY);
  },
  setToken: (state, context) => {
    window.localStorage.setItem(AUTH_KEY, context.token);
    state.token = context.token;
    state.user = context.user;
    state.error = undefined;
  },
  removeToken: (state) => {
    window.localStorage.removeItem(AUTH_KEY);
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
