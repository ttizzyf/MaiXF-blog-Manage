<script lang="ts" setup>
import { ref, onMounted } from "vue";
import "@/styles/index.scss";
import { useMenusStore } from "@/store/menu.ts";
import { themeSetting } from "@/store/theme.ts";
import { useRouter, RouteRecordSingleView } from "vue-router";
const theme = themeSetting();
const menuStore = useMenusStore();
const router = useRouter();

const routes = ref<Array<RouteRecordSingleView>>([]);

const getRoutes = () => {
  routes.value = (router.options.routes[0]?.children ||
    []) as Array<RouteRecordSingleView>;
  console.log(routes.value);
};

onMounted(() => {
  getRoutes();
});
</script>

<template>
  <el-menu
    :default-active="menuStore.chooseMenuName"
    mode="horizontal"
    @select="menuStore.chooseRouter"
    :router="true"
    :text-color="theme.theme.list[theme.themeIndex].text"
    :background-color="theme.theme.list[theme.themeIndex].bg"
    :ellipsis="false"
  >
    <template v-for="item in routes" :key="item.name">
      <template
        v-if="item.children && (item.children as RouteRecordSingleView[]).length >= 1"
      >
        <el-sub-menu :index="item.name">
          <template #title>
            <i class="iconfont icon" v-html="item.meta?.icon"></i>
            <span>{{ item.meta?.title }}</span>
          </template>
          <template v-for="itm in item.children as RouteRecordSingleView[]">
            <el-menu-item :index="itm.name">
              <i class="iconfont icon mr10" v-html="itm.meta?.icon"></i>
              <span>{{ itm.meta?.title }}</span>
            </el-menu-item>
          </template>
        </el-sub-menu>
      </template>
      <template v-else>
        <el-menu-item :index="item.name">
          <i class="iconfont icon" v-html="item.meta?.icon"></i>
          <span class="ml10">{{ item.meta?.title }}</span>
        </el-menu-item>
      </template>
    </template>
  </el-menu>
</template>

<style lang="scss" scoped>
.el-menu {
  background-color: $main;
  border: none;
  font-family: AlimamaShuHeiTi-Bold;
  font-size: 18px;
  color: $seconed;
}
.el-menu--horizontal > .el-sub-menu :deep(.el-sub-menu__title) {
  color: $seconed;
  &:hover {
    background-color: $main;
  }
}
.el-menu--horizontal > :deep(.el-menu-item) {
  color: $seconed !important;
  &:hover {
    background-color: $main;
  }
}
.el-menu--horizontal > .el-menu-item.is-active {
  // color: $primary;
  border-bottom-color: $primary;
}
.el-menu-item {
  transition: none;
}
.el-menu--horizontal .el-menu-item:not(.is-disabled):focus {
  background-color: $main;
}
.el-menu--horizontal > .el-sub-menu.is-active :deep(.el-sub-menu__title) {
  border-bottom: 1px solid $primary;
}
.el-menu--horizontal .el-menu-item:not(.is-disabled):hover {
  color: $main;
  background-color: $primary;
}
.el-menu--horizontal .el-menu .el-menu-item.is-active {
  color: $main;
  background-color: $primary;
}
</style>
