import VueMarkdownEditor from "@kangc/v-md-editor";
import "@kangc/v-md-editor/lib/style/base-editor.css";
import vuepressTheme from "@kangc/v-md-editor/lib/theme/vuepress.js";
import "@kangc/v-md-editor/lib/theme/style/vuepress.css";

import Prism from "prismjs";
// highlight code
import "prismjs/components/prism-json";

//行号
import createLineNumbertPlugin from "@kangc/v-md-editor/lib/plugins/line-number/index";
//任务todo
import createTodoListPlugin from "@kangc/v-md-editor/lib/plugins/todo-list/index";
import "@kangc/v-md-editor/lib/plugins/todo-list/todo-list.css";
//表情
import createEmojiPlugin from "@kangc/v-md-editor/lib/plugins/emoji/index";
import "@kangc/v-md-editor/lib/plugins/emoji/emoji.css";
//高亮某行
import createHighlightLinesPlugin from "@kangc/v-md-editor/lib/plugins/highlight-lines/index";
import "@kangc/v-md-editor/lib/plugins/highlight-lines/highlight-lines.css";
//一键复制代码
import createCopyCodePlugin from "@kangc/v-md-editor/lib/plugins/copy-code/index";
import "@kangc/v-md-editor/lib/plugins/copy-code/copy-code.css";

VueMarkdownEditor.use(vuepressTheme, {
  Prism,
  extend(md: any) {
    // md为 markdown-it 实例，可以在此处进行修改配置,并使用 plugin 进行语法扩展
    // md.set(option).use(plugin);
  },
});

// 一键复制代码
VueMarkdownEditor.use(createCopyCodePlugin());
// 引入行号
VueMarkdownEditor.use(createLineNumbertPlugin());
// todolist
VueMarkdownEditor.use(createTodoListPlugin());
// 引入Emoji表情
VueMarkdownEditor.use(createEmojiPlugin());
// 引入代码高亮
VueMarkdownEditor.use(createHighlightLinesPlugin());

export default VueMarkdownEditor;
