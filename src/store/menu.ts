import { ref } from "vue";
import { defineStore } from "pinia";
import { useRouter } from "vue-router";
import { useBreadcrumb } from "./breadcrumb";

export const useMenusStore = defineStore("useMenusStore", () => {
  const router = useRouter();
  const breadcrumb = useBreadcrumb();
  let routes = router.getRoutes();
  const page = ref("");
  const menuIndex = ref(0);
  // 选择的菜单栏名称
  const chooseMenuName = ref("/home");
  // 选择菜单栏
  const chooseRouter = (e: string) => {
    chooseMenuName.value = e;
    let currentIndex = routes.findIndex((item) => item.path === e);
    let route = routes[currentIndex];
    // console.log(route);
    breadcrumb.addTabs({
      title: route.meta.title as string,
      name: route.name,
      path: route.path,
    });
    // console.log(breadcrumb.tabsList);
  };

  return { page, menuIndex, chooseMenuName, chooseRouter };
});
