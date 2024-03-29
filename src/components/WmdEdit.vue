<script setup lang="ts">
import "@/styles/index.scss";
import "@/plugins/mdPlugins.js";
import { useArticleStore } from "@/store/article.ts";
import { ref, watchEffect, computed } from "vue";
import storage from "@/utils/storage";
import axios from "axios";

const props = defineProps({
  mdContent: {
    type: String,
    default() {
      return "";
    },
  },
  mode: {
    type: String,
    default() {
      //可选值：edit(纯编辑模式) editable(编辑与预览模式) preview(纯预览模式)。
      return "editable";
    },
  },
  type: {
    type: String,
    default() {
      // article 时为文章编辑 , other为其余为传入
      return "article";
    },
  },
});

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

let uploadUrl = ref(
  process.env.NODE_ENV === "development"
    ? "/w1/w1/common/upload"
    : "http://www.maixf.top:4089/w1/common/upload"
);

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
  axios.post(uploadUrl.value, param, config).then(
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

const editorContent = computed({
  get() {
    // 如果type为article,绑定值为articleStore数据
    if (props.type === "article") {
      return articleStore.editArticleData.content;
    } else {
      return content.value;
    }
  },
  set(value) {
    if (props.type === "article") {
      articleStore.editArticleData.content = value;
    } else {
      content.value = value as string;
    }
  },
});

watchEffect(() => {
  content.value = props.mdContent;
});

// 双向数据绑定
const handleChange = (val: any) => {
  // 父组件使用 v-model:value  或者 @update:value
  emit("update:value", val);
};
</script>

<template>
  <div>
    <v-md-editor
      v-model="editorContent"
      ref="editor"
      height="400px"
      :mode="mode"
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
