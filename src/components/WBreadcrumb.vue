<script setup lang="ts">
import { useRouter } from "vue-router";
import { useMenusStore } from "../store/menu.ts";
import { useBreadcrumb } from "../store/breadcrumb.ts";
import "@/styles/index.scss";
const router = useRouter();
const menusStore = useMenusStore();
const breadcrumb = useBreadcrumb();

const tabsChange = (e: string) => {
  router.push(e);
  menusStore.chooseMenuName = e;
};
</script>

<template>
  <el-tabs
    v-model="breadcrumb.current"
    type="card"
    class="demo-tabs"
    @tab-remove="breadcrumb.removeTabs"
    @tab-change="tabsChange"
  >
    <el-tab-pane
      v-for="item in breadcrumb.tabsList"
      :closable="item.path !== '/home'"
      :key="item.name"
      :label="item.title"
      :name="item.name"
    >
    </el-tab-pane>
  </el-tabs>
</template>

<style lang="scss" scoped>
:deep(.el-tabs) {
  --el-tabs-header-height: 64px !important;
}
:deep(.el-tabs__header) {
  margin-bottom: 0px;
}
:deep(.el-tabs__item) {
  color: $seconed;
}
:deep(.el-tabs--card > .el-tabs__header) {
  border: none;
}
:deep(.el-tabs__item.is-active) {
  color: $primary;
  border-bottom-color: $primary !important;
}
</style>
