import { ref, Ref } from "vue";
import { defineStore } from "pinia";
import storage from "@/utils/storage";
import { useRouter, RouteRecordName } from "vue-router";
import { useMenusStore } from "./menu";

interface tabsItem {
  title: string;
  name: RouteRecordName | undefined;
  path: string;
}

// 根据路径从数组中移除对应的项
function removeFromArrayByPath(arr: Array<tabsItem>, pathToDelete: string) {
  const indexToDelete = arr.findIndex((item) => item.path === pathToDelete);
  if (indexToDelete !== -1) {
    arr.splice(indexToDelete, 1);
  }
}

export const useBreadcrumb = defineStore("useBreadcrumb", () => {
  const menuStore = useMenusStore();
  const router = useRouter();
  // 去重函数，根据 key 去重
  function uniquePaths(tabsList: Array<tabsItem>) {
    const uniquePathsSet = new Set<string>();
    const uniqueTabsList: tabsItem[] = [];
    for (const tab of tabsList) {
      if (!uniquePathsSet.has(tab.path)) {
        uniquePathsSet.add(tab.path);
        uniqueTabsList.push(tab);
      }
    }
    return uniqueTabsList;
  }
  // 默认的 tabs
  let defaultTabs: Array<tabsItem> = [
    {
      title: "首页",
      name: "/home",
      path: "/home",
    },
  ];

  // tabs列表
  let tabsList: Ref<Array<tabsItem>> = ref([]);
  // 选中的tabs
  let current = ref(defaultTabs[0].path);
  // 初始化 tabs
  function initTabs() {
    tabsList.value = [];
    const storedTabs = storage.get("tabs");
    const tabs = storedTabs || defaultTabs;
    tabsList.value = tabs;
    current.value = tabs[0].path;
    storage.set("tabs", tabs);
  }
  initTabs();
  // 重新设置tabs
  function resetTabs() {
    tabsList.value = [];
    defaultTabs = [
      {
        title: "首页",
        name: "index",
        path: "/index",
      },
    ];
    tabsList.value = defaultTabs;
    current.value = defaultTabs[0].path;
  }
  // 添加新的 tab
  function addTabs(item: tabsItem) {
    if (item.path === "/home") return;
    tabsList.value.push(item);
    tabsList.value = uniquePaths(tabsList.value);
    current.value = item.path;
    storage.set("tabs", tabsList.value);
  }
  // 设置当前选中的 tab
  function currentSet(path: string) {
    //设置tabs和侧边栏的激活菜单
    menuStore.chooseMenuName = path;
    current.value = path;
    router.push(path);
  }
  function removeTabs(key: string) {
    const tabIndex = tabsList.value.findIndex((item) => item.path === key);
    const currentIndex = tabsList.value.findIndex(
      (item) => item.path === current.value
    );

    // 先进行删除
    removeFromArrayByPath(tabsList.value, key);
    storage.set("tabs", tabsList.value);

    // 再设置激活项
    if (tabIndex >= 0) {
      // 后一个 下标
      const tabNextIndex = Math.min(tabIndex + 1, tabsList.value.length - 1);
      // 前一个 下标
      const tabPreIndex = Math.max(tabIndex - 1, 0);
      const tabNextItem = tabsList.value[tabNextIndex];
      const tabPreIndexItem = tabsList.value[tabPreIndex];
      // 选中项和将要删除的项不是同一个则不改变激活项
      if (currentIndex !== tabIndex) {
        return currentSet(current.value);
      }
      // 如果前后都无法找到则设置激活项为第一个 （激活首页）
      currentSet(
        tabNextItem
          ? tabNextItem.path
          : tabPreIndexItem
          ? tabPreIndexItem.path
          : tabsList.value[0].path
      );
    } else {
      currentSet(tabsList.value[0].path);
    }
  }
  return {
    tabsList,
    current,
    defaultTabs,
    initTabs,
    addTabs,
    currentSet,
    resetTabs,
    removeTabs,
  };
});
