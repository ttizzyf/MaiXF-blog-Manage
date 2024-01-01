<script setup lang="ts">
import "./assets/font/index.scss";
import { onMounted } from "vue";
import { themeSetting } from "./store/theme";
import { useRouter } from "vue-router";
import storage from "./utils/storage";
const theme = themeSetting();
const router = useRouter();
// 加载主题色
onMounted(() => {
  // 首次加载需要让主题色为最后一个,因为changeColor默认index+1
  theme.themeIndex = theme.theme.list.length - 1;
  theme.ChangeColor();
  // 获取token,如果没有token,就去登录注册页面
  let token = storage.get("userInfo")?.token;
  console.log(token);
  if (!token) {
    router.push("login");
  }
});
</script>

<template>
  <router-view></router-view>
</template>

<style lang="scss">
body {
  font-family: MULPX5na6Lbx;
}
:root {
  --el-menu-bg-color: $main;
  --el-border-color-light: rgba(255, 255, 255, 0.2);
  // --el-bg-color-overlay: $main !important;
  // --el-border-color-light: $main;
}
</style>
