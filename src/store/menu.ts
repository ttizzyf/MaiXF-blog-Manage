import { ref } from "vue";
import { defineStore } from "pinia";

export const useMenusStore = defineStore("useMenusStore", () => {
  const page = ref("");
  const menuIndex = ref(0);
  // 选择的菜单栏名称
  const chooseMenuName = ref("home");

  return { page, menuIndex, chooseMenuName };
});
