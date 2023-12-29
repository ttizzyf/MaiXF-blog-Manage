<script lang="ts" setup>
import WHeader from "./w_header/index.vue";
import WMain from "./w_main/index.vue";
import WSidebar from "./w_sidebar/index.vue";
</script>

<template>
  <div class="common-layout">
    <el-container>
      <el-aside><WSidebar></WSidebar></el-aside>
      <el-container>
        <el-header><WHeader></WHeader></el-header>
        <el-main><WMain></WMain></el-main>
      </el-container>
    </el-container>
  </div>
</template>

<style lang="scss" scoped>
.el-container {
  height: 100vh;
}
.el-aside {
  width: auto;
}
.el-header {
  padding: 0px;
}
.common-layout {
  background-color: $main;
  width: 100%;
  transition: all 0.4s linear;
  .el-header {
    height: 64px;
    padding: 0px;
  }
  .el-main {
    height: auto;
    padding: 0px;
    overflow: unset;
  }
}
</style>
