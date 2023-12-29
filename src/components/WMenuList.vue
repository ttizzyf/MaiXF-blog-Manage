<script setup lang="ts">
import { ref, onMounted } from "vue";
import { useRouter } from "vue-router";
import { useMenusStore } from "../store/menu.ts";
import "@/styles/index.scss";

const router = useRouter();
const menusAction = useMenusStore();

// 定义菜单项数据
const menuItems = [
  { name: "HOME", id: "home", path: "/home" },
  { name: "ABOUT", id: "about", path: "/about" },
  { name: "BLOG", id: "blog", path: "/blog" },
  { name: "GAMES", id: "games", path: "/games" },
  { name: "MESSAGEBOARD", id: "messageBoard", path: "/messageBoard" },
];

// 响应式数据，用于存储当前鼠标悬停的选项的索引、底纹的位置和宽度，以及默认激活的菜单项索引
// 默认设置为第一个菜单项

const activeIndex = ref(menusAction.menuIndex);
const overlayLeft = ref(0);
const overlayTop = ref(0);
const overlayWidth = ref(0);
const overlayHeight = ref(0);
const menuItemRefs = ref<HTMLElement[]>([]);
const menuItem = ref(null);

const outOverlay = () => {
  const menuItem: HTMLElement = menuItemRefs.value[activeIndex.value];
  if (menuItem) {
    overlayLeft.value = menuItem.offsetLeft;
    overlayTop.value = menuItem.offsetTop;
    overlayWidth.value = menuItem.offsetWidth;
    overlayHeight.value = menuItem.offsetHeight;
  }
};

// 方法，显示选项底纹
const showOverlay = (index: number) => {
  const menuItem: HTMLElement = menuItemRefs.value[index];
  if (menuItem) {
    overlayLeft.value = menuItem.offsetLeft;
    overlayTop.value = menuItem.offsetTop;
    overlayWidth.value = menuItem.offsetWidth;
    overlayHeight.value = menuItem.offsetHeight;
  }
};

// 方法，激活菜单项
const activateMenuItem = (
  index: number,
  item: { name: string; id: string; path: string } | null = null
) => {
  menusAction.menuIndex = index;
  activeIndex.value = index;
  const menuItem: HTMLElement = menuItemRefs.value[index];
  if (menuItem) {
    overlayLeft.value = menuItem.offsetLeft;
    overlayTop.value = menuItem.offsetTop;
    overlayWidth.value = menuItem.offsetWidth;
    overlayHeight.value = menuItem.offsetHeight;
  }
  if (!item) return;
  if (item.path) {
    router.push(item.path);
  } else {
    menusAction.page = item.id;
  }
};

// 在组件挂载时获取所有菜单项的引用
onMounted(() => {
  if (menuItem.value) {
    let index = menusAction.menuIndex;
    activateMenuItem(index, menuItems[index]);
    menuItemRefs.value = [...menuItem.value];
  }
});
</script>

<template>
  <div class="menu">
    <div
      v-for="(item, index) in menuItems"
      :key="index"
      class="menu-item caps"
      :class="{ active: activeIndex === index }"
      @mouseover="showOverlay(index)"
      @mouseleave="outOverlay"
      @click="activateMenuItem(index, item)"
      ref="menuItem"
    >
      {{ item.name }}
    </div>
    <div
      class="overlay"
      :style="{
        top: overlayTop + 'px',
        left: overlayLeft + 'px',
        width: overlayWidth + 'px',
        height: overlayHeight + 'px',
      }"
    ></div>
  </div>
</template>

<style lang="scss" scoped>
.menu {
  display: flex;
  width: 100%;
  height: 100%;
  background-color: transparent;
}

.menu-item {
  position: relative;
  padding: 0 10px;
  cursor: pointer;
  line-height: 45px;
  background-color: transparent;
  color: $seconed;
  font-family: "Poppins", sans-serif;
  text-transform: uppercase;
  font-size: 12px;
  // letter-spacing: 0.09em;
  transition: all 0.3s linear;
  &:hover {
    color: $primary;
  }
}

.overlay {
  position: absolute;
  top: 0;
  left: 0;
  height: 100%;
  pointer-events: none;
  border-radius: 3px;
  border-bottom: 3px solid $primary;
  transition: left 0.2s ease-in, width 0.2s ease-in;
}

.active {
  color: $primary;
  border-radius: 3px;
  border-bottom: 3px solid $primary;
  font-weight: 700;
  transition: left 0.2s ease-in, width 0.2s ease-in;
}
</style>
