import { createStore } from 'vuex';
import VuexPersistence from 'vuex-persist';
const persist = new VuexPersistence({
  key: 'tesla-storage',
  modules: ['auth', 'production', 'reports'],
  asyncStorage: false,
}).plugin;

import auth from './modules/auth';
import rawMaterial from './modules/raw-material';
import dosingGroup from './modules/dosing-group';
import formula from './modules/formula';
import production from './modules/production';
import reports from './modules/reports';
import user from './modules/user';
export default createStore({
  modules: {
    auth,
    rawMaterial,
    dosingGroup,
    formula,
    production,
    reports,
    user,
  },
  plugins: [persist],
});
