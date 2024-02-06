<script setup lang="ts">
import "@/styles/index.scss";
import "@/plugins/mdPlugins.js";
import { useArticleStore } from "@/store/article.ts";
const articleStore = useArticleStore();
const toolbar = {
  leftToolbar:
    ' left-toolbar=" undo redo todo-list clear emoji | tip h bold italic strikethrough quote | ul ol table hr | link image media file code  | save ',
  rightToolbar: " preview toc sync-scroll fullscreen ",
  disabledMenus: [],
};

const emit = defineEmits(["update:value"]);

// 双向数据绑定
const handleChange = (val: any) => {
  // 父组件使用 v-model:value  或者 @update:value
  emit("update:value", val);
};
</script>

<template>
  <div>
    <v-md-editor
      v-model="articleStore.editArticleData.content"
      ref="preview"
      height="400px"
      placeholder="请输入内容"
      :left-toolbar="toolbar.leftToolbar"
      :right-toolbar="toolbar.rightToolbar"
      :disabled-menus="toolbar.disabledMenus"
      @change="handleChange"
    ></v-md-editor>
  </div>
</template>

<style lang="scss" scoped></style>
