/**
 * 在主框架内显示
 * 路由配置说明
 * {
      path: '/dir-demo-info',    // 页面地址（唯一）
      name: 'dir-demo-info',     // 页面名称（唯一）
      hidden: false,              // 隐藏（不展示在侧边栏菜单）
      meta: {
          title: '用户管理',       // 页面标题
          icon: 'yonghuguanli',  // 页面图标
          cache: true,          // 页面是否进行缓存 默认true
          link: false,          // 页面是否是外链 默认false
          frameSrc: false,      // 页面是否是内嵌 默认false
          requiresAuth: true,   // 页面是否是需要登录 默认true
          perms: [               // 页面的操作的权限列表
              'sys:users:list',   // 查询
              'sys:users:create', // 增加
              'sys:users:update', // 更新
              'sys:users:delete', // 删除
          ],
      },
      component: () => import('@/views/sys/users/dir-users-info.vue'),// 懒加载页面组件
   }
 *
 */

/**
 * 路由主体
 */

const frameIn = [
  {
    path: "/",
    redirect: { name: "/home" },
    component: () => import("@/layout/index.vue"),
    children: [
      {
        path: "/home",
        name: "/home",
        component: () => import("@/views/home/index.vue"),
        meta: {
          title: "首页",
          hidden: false,
          icon: "&#xe62c;",
          link: false,
          requiresAuth: true,
        },
        children: [],
      },
      {
        path: "/blog",
        name: "/blog",
        meta: {
          title: "博客管理",
          hidden: false,
          icon: "&#xe643;",
          link: false,
          requiresAuth: true,
        },
        children: [
          {
            path: "/blog/blogArticle",
            name: "/blog/blogArticle",
            component: () => import("@/views/blog/blogArticle/index.vue"),
            meta: {
              title: "文章管理",
              hidden: false,
              icon: "&#xe643;",
              link: false,
              requiresAuth: true,
            },
          },
          {
            path: "/blog/blogComment",
            name: "/blog/blogComment",
            component: () => import("@/views/blog/blogComment/index.vue"),
            meta: {
              title: "文章评论",
              hidden: false,
              icon: "&#xe643;",
              link: false,
              requiresAuth: true,
            },
          },
          {
            path: "/blog/manageMessage",
            name: "/blog/manageMessage",
            component: () => import("@/views/blog/manageMessage/index.vue"),
            meta: {
              title: "留言管理",
              hidden: false,
              icon: "&#xe643;",
              link: false,
              requiresAuth: true,
            },
          },
        ],
      },
      {
        path: "/message",
        name: "/message",
        component: () => import("@/views/message/index.vue"),
        meta: {
          title: "消息管理",
          hidden: false,
          icon: "&#xe608;",
          link: false,
          requiresAuth: true,
        },
        children: [],
      },
      {
        path: "/system",
        name: "/system",
        meta: {
          title: "系统管理",
          hidden: false,
          icon: "&#xe62c;",
          link: false,
          requiresAuth: true,
        },
        children: [
          {
            path: "/system/user",
            name: "/system/user",
            component: () => import("@/views/system/user/index.vue"),
            meta: {
              title: "用户管理",
              hidden: false,
              icon: "&#xe62c;",
              link: false,
              requiresAuth: true,
            },
          },
          {
            path: "/system/power",
            name: "/system/power",
            component: () => import("@/views/system/power/index.vue"),
            meta: {
              title: "权限管理",
              hidden: false,
              icon: "&#xe62c;",
              link: false,
              requiresAuth: true,
            },
          },
          {
            path: "/system/operate",
            name: "/system/operate",
            component: () => import("@/views/system/operate/index.vue"),
            meta: {
              title: "操作管理",
              hidden: false,
              icon: "&#xe62c;",
              link: false,
              requiresAuth: true,
            },
          },
        ],
      },
    ],
    meta: {
      title: "布局",
      hidden: true,
      link: false,
      requiresAuth: true,
    },
  },
];

// 不展示菜单栏其他页面
const otherPage = [
  {
    path: "/login",
    name: "login",
    component: () => import("@/components/WLoginAndRegister.vue"),
    meta: {
      title: "登录注册",
      hidden: true,
      link: false,
      requiresAuth: true,
    },
    children: [],
  },
];

// 错误页面
const errorPage = [
  {
    path: "/404",
    name: "404",
    component: () => import("@/views/error/404.vue"),
    meta: {
      title: "404",
      hidden: true,
      link: false,
      requiresAuth: true,
    },
    children: [],
  },
  {
    path: "/401",
    name: "401",
    component: () => import("@/views/error/401.vue"),
    meta: {
      title: "401",
      hidden: true,
      link: false,
      requiresAuth: true,
    },
    children: [],
  },
];

export default [...frameIn, ...otherPage, ...errorPage];
