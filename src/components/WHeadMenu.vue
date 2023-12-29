<script lang="ts" setup>
import { ref, onMounted } from "vue";
import "@/styles/index.scss";
import { useMenusStore } from "@/store/menu.ts";
import { useRouter, RouteRecordSingleView } from "vue-router";
const menuStore = useMenusStore();
const router = useRouter();

const routes = ref<Array<RouteRecordSingleView>>([]);

const getRoutes = () => {
  let route = router.getRoutes();
  route.forEach((item: any) => {
    if (!item.meta.hidden) {
      routes.value.push(item);
    }
  });
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
    :ellipsis="false"
  >
    <template v-for="item in routes" :key="item.name">
      <template
        v-if="item.children && (item.children as RouteRecordSingleView[]).length >= 1"
      >
        <el-sub-menu :index="item.name"></el-sub-menu>
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
    background-color: $primary;
  }
}
.el-menu--horizontal > :deep(.el-menu-item) {
  color: $seconed !important;
  &:hover {
    background-color: $primary;
  }
}
.el-menu--horizontal > .el-sub-menu :deep(.el-sub-menu__title) {
  color: $seconed;
}
.el-menu--horizontal > .el-menu-item.is-active {
  // color: $primary;
  border-bottom-color: $primary;
}
.el-menu--horizontal .el-menu-item:not(.is-disabled):focus,
.el-menu--horizontal .el-menu-item:not(.is-disabled):hover {
  background-color: $primary;
  color: $primary;
}
</style>
