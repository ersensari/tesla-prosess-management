import { createStore } from "vuex";
import VuexPersistence from "vuex-persist";
const persist = new VuexPersistence({
  key: "tesla-storage",
  modules: ["auth"],
  asyncStorage: false,
}).plugin;

import auth from "./modules/auth";
import rawMaterial from "./modules/raw-material";
import dosingGroup from "./modules/dosing-group";

export default createStore({
  modules: {
    auth,
    rawMaterial,
    dosingGroup,
  },
  plugins: [persist],
});
