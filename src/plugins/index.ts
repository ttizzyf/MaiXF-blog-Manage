import { App } from "vue";
// @ts-ignore
import VueMarkdownEditor from "./mdPlugins";

const pluginList = [
  VueMarkdownEditor,
  // 如果有使用到别的插件，引入放在这个位置就好
];

const plugins = {
  install(app: App<Element>) {
    // 批量注册插件  改用自动引入
    Object.entries(pluginList).forEach(([, v]) => {
      app.use(v);
    });
  },
};

export default plugins;
