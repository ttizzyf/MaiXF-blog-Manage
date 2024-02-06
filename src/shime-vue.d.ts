declare module "*.vue" {
  import type { DefineComponent } from "vue";
  const comment: DefineComponent<{}, {}, any>;

  export default comment;
}

declare module "@kangc/v-md-editor/lib/theme/vuepress.js";
declare module "@kangc/v-md-editor/lib/plugins/line-number/index";
declare module "@kangc/v-md-editor/lib/plugins/todo-list/index";
declare module "@kangc/v-md-editor/lib/plugins/emoji/index";
declare module "@kangc/v-md-editor/lib/plugins/highlight-lines/index";
declare module "@kangc/v-md-editor/lib/plugins/copy-code/index";
declare module "@kangc/v-md-editor";
