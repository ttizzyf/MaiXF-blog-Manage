import { ref } from "vue";
import { defineStore } from "pinia";

export const themeSetting = defineStore("themeSetting", () => {
  // 抽屉状态
  const drawerStatus = ref(false);
  // 打开抽屉
  const openDrawer = () => {
    drawerStatus.value = true;
  };
  // 通过索引顺序排列颜色
  const theme = {
    list: [
      { desc: "帅气逼人", bg: "#212121", text: "#ffffff", primary: "#64ff66" },
      { desc: "啊啊啊啊", bg: "#2e050c", text: "#ffccd5", primary: "#f50" },
      { desc: "英俊潇洒", bg: "#210", text: "#f60", primary: "#00ffff" },
      { desc: "虎头蛇尾", bg: "#444", text: "#eee", primary: "#00ffff" },
      { desc: "牛头马面", bg: "#eef6f6", text: "black", primary: "#0000ff" },
    ],
  };
  // 主题索引
  const themeIndex = ref(0);
  const ChangeColor = (index: number | undefined) => {
    console.log(index);
    let colorGroup;
    if (typeof index === "number" || index === 0) {
    } else {
      if (themeIndex.value >= theme.list.length - 1) {
        themeIndex.value = 0;
      } else {
        themeIndex.value++;
      }
    }
    colorGroup = theme.list[themeIndex.value];
    document
      .getElementsByTagName("body")[0]
      .style.setProperty("--primary", `${colorGroup.primary}`);
    document
      .getElementsByTagName("body")[0]
      .style.setProperty("--main", `${colorGroup.bg}`);
    document
      .getElementsByTagName("body")[0]
      .style.setProperty("--seconed", `${colorGroup.text}`);
  };
  // 展示侧边栏或者顶部栏
  const showSidebar = ref(false);
  // 收缩侧边栏-
  const shrinkSidebar = ref(true);
  // 是否展示面包屑
  const showBread = ref(false);
  // 是否展示LOGO
  const showLogo = ref(true);

  return {
    drawerStatus,
    openDrawer,
    ChangeColor,
    themeIndex,
    theme,
    showSidebar,
    shrinkSidebar,
    showBread,
    showLogo,
  };
});
