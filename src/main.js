import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
import { createI18n } from "vue-i18n";
import messages from "./locales"
import router from "./router";

const i18n = createI18n({
    legacy: false,
    locale: "zh",
    fallbackLocale: "en",
    messages,
  });
const app = createApp(App);
app.use(router);
app.use(i18n);
app.mount('#app');
