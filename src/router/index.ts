import { createRouter, createWebHashHistory, createWebHistory, type RouteRecordRaw } from 'vue-router';
import frame from '../app/frame/index.vue';


const routes: Array<RouteRecordRaw> = [
    {
        path: "/icon",
        name: "icon",
        meta: {
            keepAlive: false,
            name: '图标'
        },
        component: () => import("../common/icon/icon.vue")
    },
    {
        path: "/login",
        name: "login",
        meta: {
            keepAlive: false,
            name: '登录'
        },
        component: () => import("../app/login/index.vue")
    },
    {
        path: "/",
        name: "frame",
        component: frame,
        children: [
            {
                path: "/",
                name: "首页",
                meta: {
                    keepAlive: false,
                    name: '首页'
                },
                component: () => import("../view/home/index.vue")
            }, {
                path: "/user-center",
                name: "个人中心",
                meta: {
                    keepAlive: false,
                    name: '个人中心'
                },
                component: () => import("../app/frame/header/user-center.vue")
            },
        ]
    }
];

const router = createRouter({
    history: createWebHistory(),
    routes
})

export default router;
