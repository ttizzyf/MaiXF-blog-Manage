<script lang="ts" setup>
import { ref } from "vue";
import { Operation, Tools } from "@element-plus/icons-vue";
import { themeSetting } from "@/store/theme.ts";
import { useUserStore } from "@/store/user.ts";
import WHeadMenu from "@/components/WHeadMenu.vue";
import WThemeDrawer from "@/components/WThemeDrawer.vue";
import { useRouter } from "vue-router";
import WBreadcrumb from "@/components/WBreadcrumb.vue";
import "@/styles/index.scss";
import "animate.css";
const theme = themeSetting();
const user = useUserStore();
const router = useRouter();

const BlogName = ref(import.meta.env.VITE_APP_WEB_TITLE);

// 退出登录
const exitLogin = () => {
  user.removeLogin();
  router.push("/login");
};
</script>

<template>
  <div
    class="header"
    :style="{
      width: !theme.showSidebar
        ? '100vw'
        : theme.shrinkSidebar
        ? 'calc(100vw - 64px)'
        : 'calc(100vw - 200px)',
    }"
  >
    <div class="flex between tac head-box">
      <div class="header-left flex jcenter">
        <div class="shrink">
          <el-icon
            v-if="theme.showSidebar"
            class="pointer text-seconed"
            :size="20"
            @click="theme.shrinkSidebar = !theme.shrinkSidebar"
            ><Operation
          /></el-icon>
        </div>
        <div v-if="!theme.showSidebar" class="un-shrink-menu flex start">
          <div class="logo-box flex jcenter mr20">
            <img v-if="theme.showLogo" src="@/assets/SVG/head.svg" alt="" />
            <span :class="['blogName', 'pl10']">{{ BlogName + "·ADMIN" }}</span>
          </div>
          <el-scrollbar>
            <div class="head-menu">
              <WHeadMenu></WHeadMenu>
            </div>
          </el-scrollbar>
        </div>
        <div
          v-if="theme.showSidebar && theme.showBread"
          class="breadcrumnb-box"
        >
          <WBreadcrumb></WBreadcrumb>
        </div>
      </div>

      <div class="flex start control-box pointer">
        <el-popover placement="top-start" trigger="hover">
          <template #reference>
            <div :class="['userInfo', 'flex', 'start', 'pd10']">
              <div class="avatar">
                <el-image
                  style="height: 25px; width: 25px"
                  :src="user.LoginInfo?.avatar"
                  fit="cover"
                />
              </div>
              <span class="ml10 fz12 text-seconed w64">{{
                user.LoginInfo?.nickname
              }}</span>
            </div>
          </template>
          <div class="flex jcenter pointer" @click="exitLogin">
            <i class="iconfont mr10">&#xe676;</i>
            <span>退出登录</span>
          </div>
        </el-popover>
        <div :class="['icon-box', 'flex', 'pointer']" @click="theme.openDrawer">
          <el-icon size="18" class="headShake text-seconed"><Tools /></el-icon>
        </div>
        <div class="icon-box flex pointer">
          <i
            @click="theme.ChangeColor"
            class="headShake text-seconed fz18 iconfont icon"
            >&#xe611;</i
          >
        </div>
      </div>
    </div>
  </div>
  <WThemeDrawer></WThemeDrawer>
</template>

<style lang="scss" scoped>
.header {
  z-index: 2000;
  position: fixed;
  height: 64px;
  width: 100%;
  padding: 0 20px;
  background-color: $main;
  border-bottom: 1px solid rgba($color: #ffffff, $alpha: 0.2);
}
.head-box {
  height: 100%;
  .header-left {
    .shrink {
      color: $main;
      display: flex;
      align-items: center;
    }
    .un-shrink-menu {
      .logo-box {
        width: 200px;
        height: 100%;
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
    .breadcrumnb-box {
      margin-left: 20px;
    }
  }

  .control-box {
    width: auto;
    height: 100%;
    .userInfo {
      height: 100%;
      .avatar {
        height: 25px;
        width: 25px;
        border-radius: 13px;
        overflow: hidden;
      }
    }
    .icon-box {
      height: 100%;
      padding: 10px;
    }
  }
}
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s;
}
.fade-enter,
.fade-leave-to {
  opacity: 0;
}
</style>
