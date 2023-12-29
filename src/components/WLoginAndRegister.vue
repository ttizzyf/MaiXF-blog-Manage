<script lang="ts" setup>
import { ref, onMounted } from "vue";
import "@/styles/index.scss";
import { themeSetting } from "@/store/theme";
import { Application } from "@splinetool/runtime";
import WLoginAndRegisterForm from "./WLoginAndRegisterForm.vue";
const theme = themeSetting();
const BlogName = ref(import.meta.env.VITE_APP_WEB_TITLE);
const Version = ref(import.meta.env.VITE_APP_WEB_VERSION);

onMounted(() => {
  const canvas = document.getElementById("canvas3d");
  if (canvas !== null && canvas instanceof HTMLCanvasElement) {
    const spline = new Application(canvas);
    spline.load(
      "https://draft.spline.design/fZ6cg6mQqRUdzCo4/scene.splinecode"
    );
  }
});
</script>

<template>
  <div class="loginControl bg-main">
    <div class="header">
      <div class="logo-box flex start mr20 pl20">
        <img v-if="theme.showLogo" src="@/assets/SVG/head.svg" alt="" />
        <span :class="['blogName', 'pl10']">{{ BlogName + "·ADMIN" }}</span>
      </div>
    </div>
    <div class="login-box flex jcenter">
      <div class="center-box flex start">
        <canvas id="canvas3d"></canvas>
        <div class="login-form-box poa">
          <div class="por flex column login-form">
            <div class="title fz24 text-primary fw700">
              {{ BlogName }}的后台管理系统
            </div>
            <WLoginAndRegisterForm></WLoginAndRegisterForm>
            <div class="flex column center poa login-footer">
              <div class="fz14 text-seconed">
                ✨✨✨欢迎光临{{ BlogName + Version }}
              </div>
              <div class="gitee-image-box mt10">
                <a
                  class="mr10"
                  href="https://gitee.com/yequcailingzhi/MaiXF-blog-Manage"
                >
                  <img
                    src="https://gitee.com/yequcailingzhi/MaiXF-blog-Manage/badge/star.svg"
                    alt=""
                  />
                </a>
                <a href="https://gitee.com/yequcailingzhi/MaiXF-blog-Manage">
                  <img
                    src="https://gitee.com/yequcailingzhi/MaiXF-blog-Manage/badge/fork.svg"
                    alt=""
                  />
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.loginControl {
  height: 100vh;
  width: 100vw;
  .header {
    height: 80px;
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
  .login-box {
    height: calc(100vh - 80px);
    .login-form-box {
      right: 200px;
      height: 600px;
      width: 450px;
      // background-color: rgba($color: #ffffff, $alpha: 0.3);
      box-shadow: 0 2px 2px #ffffff;
      padding: 40px;
      animation-name: boxShadowShrink;
      animation-duration: 2s;
      animation-iteration-count: infinite;
      animation-timing-function: linear;
      .login-form {
        height: 100%;
        .login-footer {
          bottom: 0;
        }
      }
    }
  }
}
</style>
