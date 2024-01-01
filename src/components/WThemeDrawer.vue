<script lang="ts" setup>
import { Close } from "@element-plus/icons-vue";
import { themeSetting } from "@/store/theme.ts";
import "@/styles/index.scss";
const theme = themeSetting();
</script>

<template>
  <el-drawer v-model="theme.drawerStatus" :with-header="false" size="310">
    <div class="drawer-header flex between mb10">
      <div class="title">布局样式</div>
      <el-icon class="pointer fz18" @click="theme.drawerStatus = false"
        ><Close
      /></el-icon>
    </div>
    <el-divider>样式布局</el-divider>
    <div class="Containers mt10 flex between">
      <div
        :class="[
          'Container-default',
          'containerItem',
          'pointer',
          { isActiveContainer: theme.showSidebar },
        ]"
        @click="theme.showSidebar = true"
      >
        <div class="center flex start">
          <div class="sidebar"></div>
          <div class="right">
            <div class="header"></div>
            <div class="main"></div>
          </div>
        </div>
        <div class="intro flex jcenter">默认</div>
      </div>
      <div
        :class="[
          'Container-seconed',
          'containerItem',
          'pointer',
          { isActiveContainer: !theme.showSidebar },
        ]"
        @click="theme.showSidebar = false"
      >
        <div class="header"></div>
        <div class="main"></div>
        <div class="intro flex jcenter">单栏</div>
      </div>
    </div>
    <el-divider>主题选择</el-divider>
    <div class="flex jcenter">
      <span class="fz12 pr10 w80">主题选择</span>
      <el-select
        v-model="theme.themeIndex"
        @change="theme.ChangeColor(theme.themeIndex)"
      >
        <el-option
          v-for="(item, index) in theme.theme.list"
          :key="item.bg"
          :label="item.desc"
          :value="index"
        ></el-option>
      </el-select>
    </div>
    <el-divider>其他配置</el-divider>
    <div class="flex start">
      <span class="fz12 pr10 w80">展示面包屑</span>
      <el-switch v-model="theme.showBread" />
    </div>
    <div class="flex start">
      <span class="fz12 pr10 w80">展示LOGO</span>
      <el-switch v-model="theme.showLogo" />
    </div>
  </el-drawer>
</template>

<style lang="scss" scoped>
.drawer-header {
  color: #72767b;
  font-size: 14px;
}
.Containers {
  .containerItem {
    height: 100px;
    width: 130px;
    background-color: #fff;
    border: 1px solid #e4e7ed;
  }
  .Container-default {
    position: relative;
    .center {
      height: 100%;
      .sidebar {
        background-color: #ebeef5;
        width: 18%;
        height: 100%;
      }
      .right {
        width: 82%;
        height: 100%;
        .header {
          width: 100%;
          height: 10%;
          background-color: #dcdfe6;
        }
        .main {
          width: 100%;
          height: 90%;
          background-color: #f2f6fc;
        }
      }
    }
  }
  .intro {
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
    height: 50px;
    width: 50px;
    border-radius: 50%;
    border: 1px solid #79bbff;
    color: #79bbff;
  }
  .Container-seconed {
    position: relative;
    .header {
      height: 10%;
      width: 100%;
      background-color: #dcdfe6;
    }
    .main {
      height: 90%;
      width: 100%;
      background-color: #f2f6fc;
    }
  }
}
.isActiveContainer {
  border: 1px solid $primary !important;
}
</style>
