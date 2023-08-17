import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";
import "bootstrap/dist/css/bootstrap.css";
import "bootstrap/dist/js/bootstrap.js";
import { createPinia } from "pinia";
import ButtonCustom from "@/components/CommonComp/ButtonCustom.vue";

// Vuetify
import "vuetify/styles";
import { createVuetify } from "vuetify";
import * as components from "vuetify/components";
import * as directives from "vuetify/directives";

const pinia = createPinia();

const vuetify = createVuetify({
  components,
  directives,
});

const app = createApp(App);

// Global component registration
app.component("ButtonCustom", ButtonCustom);

app.use(router).use(vuetify).use(pinia).mount("#app");
