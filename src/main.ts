import { createApp } from "vue";
import ElementPlus from "element-plus";
import { createPinia } from "pinia";
import "element-plus/dist/index.css";
import "styles/main.scss";
import App from "./App.vue";
import router from "./router";
import plugins from "@/plugins";
const app = createApp(App);

const pinia = createPinia();

app.use(pinia).use(router).use(plugins).use(ElementPlus).mount("#app");
