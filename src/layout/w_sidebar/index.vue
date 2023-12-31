<script lang="ts" setup>
import { ref, onMounted } from "vue";
import "@/styles/index.scss";
import { themeSetting } from "@/store/theme.ts";
import { useMenusStore } from "@/store/menu.ts";
import { useRouter, RouteRecordSingleView } from "vue-router";
const menuStore = useMenusStore();
const router = useRouter();
// 主题
const theme = themeSetting();

// 后台名称
const BlogName = ref(import.meta.env.VITE_APP_WEB_TITLE);

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
  <div class="sidebar-box" v-if="theme.showSidebar">
    <div v-if="theme.showLogo" class="logo flex jcenter mb10">
      <img src="@/assets/SVG/head.svg" alt="" />
      <span v-if="!theme.shrinkSidebar" :class="['blogName', 'pl10']">{{
        BlogName + "·ADMIN"
      }}</span>
    </div>
    <el-menu
      :default-active="menuStore.chooseMenuName"
      unique-opened
      class="el-menu-vertical-demo"
      :collapse="theme.shrinkSidebar"
    >
      <template v-for="item in routes" :key="item.name">
        <!-- 当子菜单的数目大于1时 -->
        <el-sub-menu
          v-if="item.children && (item.children as RouteRecordSingleView[]).length >= 1"
          :index="item.name"
        >
          <template #title>
            <i class="iconfont icon mr10" v-html="item.meta?.icon"></i>
            <span>{{ item.meta?.title }}</span>
          </template>
          <el-menu-item-group :title="item.meta?.title"></el-menu-item-group>
        </el-sub-menu>
        <!-- 当子菜单数目小于1时 -->
        <el-menu-item v-else :index="item.name">
          <i class="iconfont icon mr10" v-html="item.meta?.icon"></i>
          <template #title>{{ item.meta?.title }}</template>
        </el-menu-item>
      </template>
    </el-menu>
  </div>
</template>

<style lang="scss" scoped>
.sidebar-box {
  height: 100%;
  background-color: $main;
  border-right: 1px solid rgba($color: #ffffff, $alpha: 0.2);
  // box-shadow: 0px 0px 12px rgba(0, 0, 0, 0.12);
  .logo {
    height: 60px;
    width: 100%;
    img {
      height: 40px;
    }
    .blogName {
      font-family: AlimamaShuHeiTi-Bold;
      font-size: 18px;
      color: $seconed;
    }
  }
}
.el-menu {
  border: none;
  background-color: $main;
}
.el-menu-vertical-demo:not(.el-menu--collapse) {
  width: 200px;
  min-height: 300px;
  background-color: $main;
}
.el-menu-item {
  margin-top: 10px;
  color: $primary;
  background-color: $main;
  transition: none;
  &:hover {
    background-color: $primary;
    color: $main;
    border-radius: 10px;
  }
}
.el-menu-item.is-active {
  background-color: $primary;
  color: $main;
  border-radius: 10px;
}
</style>
