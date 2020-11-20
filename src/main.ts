import "./components-hooks";
import "reflect-metadata";
import Vue from "vue";
import Vuetify from "vuetify/lib";
import App from "./App.vue";

import "vuetify/dist/vuetify.css";
import router from "./router";
import { vueInversifyPlugin } from "@vanroeybe/vue-inversify-plugin";
import { container } from "./inversify.config";

import store from "./store";
Vue.config.productionTip = false;
Vue.config.devtools = false;

Vue.use(Vuetify);
import fr from "vuetify/src/locale/fr";
Vue.use(vueInversifyPlugin(container));

Vue.filter("capitalize", (value: string) => {
  if (!value) return "";
  value = value.toString();
  return value.charAt(0).toUpperCase() + value.slice(1);
});

new Vue({
  el: "#app",
  router,
  render: (h) => h(App),
  vuetify: new Vuetify({
    lang: {
      locales: { fr },
      current: "fr",
    },
    //theme: { dark: true },
  }),
  store: store,
});
