import { createApp } from "vue";
import App from "./App";
import router from "./router";
import store from "./store";
import "./scss/main.scss";
import moment from "moment";

const formatDate = (date) => (date ? moment(date).format("DD.MM.YYYY") : "");
const formatDateTime = (date) =>
  date ? moment(date).format("DD.MM.YYYY HH:mm") : "";

const app = createApp(App);
app.config.globalProperties.$filters = {
  formatDate,
  formatDateTime,
};

app.provide("filters", app.config.globalProperties.$filters);
app.use(store).use(router).mount("#app");
