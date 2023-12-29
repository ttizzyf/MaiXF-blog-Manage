import { createRouter, createWebHashHistory } from "vue-router";
import routes from "./routes.ts";

const router = createRouter({
  history: createWebHashHistory(import.meta.env.BASE_URL),
  scrollBehavior(_to, _from, savedPosition) {
    if (savedPosition) {
      return savedPosition;
    } else {
      return { left: 0, top: 0 };
    }
  },
  routes,
});

router.beforeEach((to, _from, next) => {
  // 如果没有权限,返回404页面
  if (to.matched.length === 0) {
    next("/404");
  } else {
    // 修改标题
    window.document.title =
      (to.query.title ? to.query.title : to.meta.title) +
      import.meta.env.VITE_APP_WEB_TITLE;
    next();
  }
});

export default router;
