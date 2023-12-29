<script lang="ts" setup>
import { ref, onMounted } from "vue";
import "@/styles/index.scss";
import { themeSetting } from "@/store/theme";
import { Application } from "@splinetool/runtime";
const theme = themeSetting();
const BlogName = ref(import.meta.env.VITE_APP_WEB_TITLE);
const Version = ref(import.meta.env.VITE_APP_WEB_VERSION);

onMounted(() => {
  const canvas = document.getElementById("canvas3d");
  if (canvas !== null && canvas instanceof HTMLCanvasElement) {
    const spline = new Application(canvas);
    spline.load(
      "https://draft.spline.design/H5IfSovQP67I666r/scene.splinecode"
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
    <div class="login-box">
      <div class="center-box flex jcenter">
        <div class="canvas3d-box flex column center">
          <canvas style="height: 400px" id="canvas3d"></canvas>
          <div class="title fz24 text-seconed fw700">
            {{ BlogName }}的后台管理系统
          </div>
          <div class="fz14 text-seconed">
            ✨✨✨欢迎光临{{ BlogName + Version }}
          </div>
        </div>
        <div class="login-form-box text-seconed fz14"></div>
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
    .center-box {
      .canvas3d-box {
        height: 400px;
        .introduce {
        }
      }
      .login-form-box {
        padding: 60px;
      }
    }
  }
}
</style>
