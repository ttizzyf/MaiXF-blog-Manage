<script setup lang="ts">
import "@/styles/index.scss";
import "@/plugins/mdPlugins.js";
import { useArticleStore } from "@/store/article.ts";
import { ref } from "vue";
import storage from "@/utils/storage";
import axios from "axios";

const articleStore = useArticleStore();
const toolbar = {
  leftToolbar:
    ' left-toolbar=" undo redo todo-list clear emoji | tip h bold italic strikethrough quote | ul ol table hr | link image media file code  | save ',
  rightToolbar: " preview toc sync-scroll fullscreen ",
  disabledMenus: [],
};

const editor = ref();

const emit = defineEmits(["update:value"]);

const content = ref("");

const handleUploadImage = (_event: any, _insertImage: any, files: any[]) => {
  // 拿到 files 之后上传到文件服务器，然后向编辑框中插入对应的内容
  let file = files[0];
  let param = new FormData(); // 创建form对象
  param.append("file", file, file.name); // 通过append向form对象添加数据
  let config = {
    headers: {
      "Content-Type": "multipart/form-data",
      authorization: storage.get("userInfo").token,
    },
  };
  axios.post(`/w1/w1/common/upload`, param, config).then(
    (response: {
      data: {
        status: any;
        data: {
          [x: string]: any;
          previewUrl: any;
          filename: any;
        };
      };
    }) => {
      if (response.data.status) {
        console.log(response);
        editor.value.insert((_selected: any) => {
          return {
            text: `<a href="${response.data.data.fileUrl}" target="_blank">
<img src="${response.data.data.fileUrl}" alt="${response.data.data.fileName}" width="750">
</a>`,
            selected: content,
          };
        });
      }
    }
  );
};

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
      ref="editor"
      height="400px"
      placeholder="请输入内容"
      :left-toolbar="toolbar.leftToolbar"
      :right-toolbar="toolbar.rightToolbar"
      :disabled-menus="toolbar.disabledMenus"
      @change="handleChange"
      @upload-image="handleUploadImage"
    ></v-md-editor>
  </div>
</template>

<style lang="scss" scoped></style>
