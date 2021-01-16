import Vue from "vue";
import VueRouter, { RouteConfig } from "vue-router";
import Layout from "@/layout/index.vue";
import store from "@/store";

Vue.use(VueRouter);

// 路由配置规则
const routes: Array<RouteConfig> = [
  {
    path: "/login",
    name: "login",
    component: () =>
      import(/* webpackChunkName: 'login' */ "@/views/login/index.vue")
  },
  {
    path: "/",
    component: Layout,
    meta: { isAuthenticated: true },
    children: [
      {
        path: "", // 默认子路由
        name: "home",
        component: () =>
          import(/* webpackChunkName: 'home' */ "@/views/course/index.vue")
      },
      {
        path: "/role",
        name: "role",
        meta: {
          title: "角色管理"
        },
        component: () =>
          import(/* webpackChunkName: 'role' */ "@/views/role/index.vue")
      },
      {
        path: "/role/:id/assigning-menus",
        name: "roleAssigningMenus",
        meta: {
          parent: {
            title: "角色管理",
            path: "/role"
          },
          title: "分配菜单"
        },
        component: () =>
          import(
            /* webpackChunkName: 'roleAssigningMenus' */ "@/views/role/assigning-menus.vue"
          )
      },
      {
        path: "/role/:id/assigning-resource",
        name: "roleAssigningResource",
        meta: {
          parent: {
            title: "角色管理",
            path: "/role"
          },
          title: "分配资源"
        },
        component: () =>
          import(
            /* webpackChunkName: 'roleAssigningResource' */ "@/views/role/assigning-resource.vue"
          )
      },
      {
        path: "/menu",
        name: "menu",
        meta: {
          title: "菜单管理"
        },
        component: () =>
          import(/* webpackChunkName: 'menu' */ "@/views/menu/index.vue")
      },
      {
        path: "/menu/add",
        name: "menuAdd",
        meta: {
          parent: {
            title: "菜单管理",
            path: "/menu"
          },
          title: "添加菜单"
        },
        component: () =>
          import(
            /* webpackChunkName: 'CreateOrEditMenu' */ "@/views/menu/add.vue"
          )
      },
      {
        path: "/menu/:id/edit",
        name: "menuEdit",
        meta: {
          parent: {
            title: "菜单管理",
            path: "/menu"
          },
          title: "编辑菜单"
        },
        component: () =>
          import(
            /* webpackChunkName: 'CreateOrEditMenu' */ "@/views/menu/edit.vue"
          )
      },
      {
        path: "/resource",
        name: "resource",
        meta: {
          title: "资源管理"
        },
        component: () =>
          import(
            /* webpackChunkName: 'resource' */ "@/views/resource/index.vue"
          )
      },
      {
        path: "/resource/add",
        name: "resourceAdd",
        meta: {
          parent: {
            title: "资源管理",
            path: "/resource"
          },
          title: "添加资源"
        },
        component: () =>
          import(
            /* webpackChunkName: 'CreateOrEditResource' */ "@/views/resource/add.vue"
          )
      },
      {
        path: "/resource/:id/edit",
        name: "resourceEdit",
        meta: {
          parent: {
            title: "资源管理",
            path: "/resource"
          },
          title: "编辑资源"
        },
        component: () =>
          import(
            /* webpackChunkName: 'CreateOrEditResource' */ "@/views/resource/edit.vue"
          )
      },
      {
        path: "/resource/category",
        name: "resourceCategory",
        meta: {
          parent: {
            title: "资源管理",
            path: "/resource"
          },
          title: "资源分类"
        },
        component: () =>
          import(
            /* webpackChunkName: 'resourceCategory' */ "@/views/resource/category.vue"
          )
      },
      {
        path: "/course",
        name: "course",
        meta: {
          title: "课程管理"
        },
        component: () =>
          import(/* webpackChunkName: 'course' */ "@/views/course/index.vue")
      },
      {
        path: "/course/create",
        name: "courseCreate",
        meta: {
          parent: {
            title: "课程管理",
            path: "/course"
          },
          title: "新建课程"
        },
        component: () =>
          import(
            /* webpackChunkName: 'courseCreate' */ "@/views/course/create.vue"
          )
      },
      {
        path: "/course/:courseId/edit",
        name: "courseEdit",
        meta: {
          parent: {
            title: "课程管理",
            path: "/course"
          },
          title: "编辑课程"
        },
        component: () =>
          import(
            /* webpackChunkName: 'courseEdit' */ "@/views/course/edit.vue"
          ),
        props: true
      },
      {
        path: "/course/:courseId/section",
        name: "courseSection",
        meta: {
          parent: {
            title: "课程管理",
            path: "/course"
          },
          title: "内容管理"
        },
        component: () =>
          import(
            /* webpackChunkName: 'courseSection' */ "@/views/course/section.vue"
          ),
        props: true
      },
      {
        path: "/course/:courseId/video",
        name: "courseVideo",
        meta: {
          parent: {
            title: "课程管理",
            path: "/course"
          },
          childrenParent: {
            title: "内容管理"
          },
          title: "上传视频"
        },
        component: () =>
          import(
            /* webpackChunkName: 'courseVideo' */ "@/views/course/video.vue"
          ),
        props: true
      },
      {
        path: "/user",
        name: "user",
        meta: {
          title: "用户管理"
        },
        component: () =>
          import(/* webpackChunkName: 'user' */ "@/views/user/index.vue")
      },
      {
        path: "/advert",
        name: "advert",
        meta: {
          title: "广告列表"
        },
        component: () =>
          import(/* webpackChunkName: 'advert' */ "@/views/advert/index.vue")
      },
      {
        path: "/advert/add",
        name: "advertAdd",
        meta: {
          parent: {
            title: "广告列表",
            path: "/advert"
          },
          title: "添加广告"
        },
        component: () =>
          import(/* webpackChunkName: 'advertAdd' */ "@/views/advert/add.vue")
      },
      {
        path: "/advert/:id/edit",
        name: "advertEdit",
        meta: {
          parent: {
            title: "广告列表",
            path: "/advert"
          },
          title: "编辑广告"
        },
        component: () =>
          import(/* webpackChunkName: 'advertEdit' */ "@/views/advert/edit.vue")
      },
      {
        path: "/advert-space",
        name: "advert-space",
        meta: {
          title: "广告位列表"
        },
        component: () =>
          import(
            /* webpackChunkName: 'advert-space' */ "@/views/advert-space/index.vue"
          )
      }
    ]
  },

  {
    path: "*",
    name: "404",
    component: () =>
      import(/* webpackChunkName: '404' */ "@/views/error-page/404.vue")
  }
];

const router = new VueRouter({
  routes
});

router.beforeEach((to, from, next) => {
  if (!to.matched.some(value => value.meta.isAuthenticated)) {
    next();
  } else {
    if (store.getters["user/userLoginInfo"]) {
      next();
    } else {
      next({
        path: "/login",
        query: {
          redirect: to.fullPath
        }
      });
    }
  }
});

export default router;
