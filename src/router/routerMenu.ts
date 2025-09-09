/*********************************************************
 ** 动态菜单路由
 ** <br><br>
 ** Date: Created in 2022/9/20 11:34
 ** @author loulan
 ** @version 0.0.0
 *********************************************************/

import frame from '../app/frame/index.vue';
import { useDragonGlobalStore } from "../store";
import router from "./index";
import { type RouteRecordRaw, } from "vue-router";
import type { Menu, PermissionComponent, UserInfo } from "../common/domain/common";
import { currentUserPermission, currentUserMenu, currentUserInfo } from "../common/api/frame";
import { type ResponseResult, ResponseStatusEnum } from "../common/domain/response";
import { core, core as coreTool } from "owner-tool-js";

const viteComponents = import.meta.glob("../**/*.vue");

const store = useDragonGlobalStore();

/**
 * Description :创建当前用户的路由
 * @param
 * @return
 * @author     :loulan
 * */
const createrMenuRouter = (menus: Array<Menu>): RouteRecordRaw => {
    /*框架下动态路由对象，将路由对象添加到children中，就只显示在框架内容部分（是动态路由对象集合的一个）*/
    const dynamicRouter: RouteRecordRaw = {
        path: "/",
        name: "dynamic-frame",
        component: frame, //指定到这个组件下面的路由上
        children: []
    }

    // 遍历这个菜单
    for (const menu of menus) {
        // 将菜单类型为menu的用作路由，dirt只是下拉文件夹(10 menu, 20 dirt，30不显示)
        if (menu.type == 10) {
            // 定义一个路由对象
            const routerObj: RouteRecordRaw = {
                // 路径要和菜单的 key 保持一致
                path: menu.code + "-" + menu.id,
                name: menu.code + "-" + menu.id,
                // component: () => import('../' + menu.path),  // 在vite中打包无法使用
                component: viteComponents['../' + (menu.path?.replace(/^\//g, ''))], // 如果变量开头是‘/’那么就去掉（替换为空）
                meta: {
                    keepAlive: menu.keepAlive,
                    iconType: menu.iconType,
                    icon: menu.icon,
                    name: menu.name
                }
            };
            // 将这个路由对象添加到动态路由中
            dynamicRouter.children.push(routerObj);
        }
    }
    // 返回这个路由集合
    return dynamicRouter;
}

/**
 * 生成菜单路由
 * @param
 * @return
 * @author     :loulan
 * */
export const generateMenuRouter = async () => {
    // 创建菜单路由并添加到路由配置中
    let menuRouter: RouteRecordRaw = createrMenuRouter(store.menus);
    router.addRoute(menuRouter);
}

/**
 * 当前用户菜单配置
 * @return {Promise<void>} 无返回值
 * @author loulan
 */
export const currentUserMenuConfig = (): Promise<void> => {
    return new Promise((resolve, reject) => {
        currentUserMenu().then((res: ResponseResult) => {
            if (res.status == ResponseStatusEnum.OK && res.data) {
                const menus: Array<Menu> = res.data;
                if (coreTool.isEmpty(menus)) {
                    reject("菜单信息为空");
                }
                store.setMenus(menus);
                resolve();
            } else {
                reject("菜单信息为空");
            }
        }).catch((error) => {
            console.error("获取当前用户菜单发生错误。", error);
        })
    });
}

/**
 * 当前用户组件权限（在当前客户端下的）
 * @param
 * @return
 * @exception
 * @author     :loulan
 * */
export const currentUserComponentPermissionConfig = async (): Promise<void> => {
    return new Promise((resolve, reject) => {
        currentUserPermission().then((res: ResponseResult) => {
            if (ResponseStatusEnum.OK == res.status && coreTool.isExist(res.data)) {
                const componentPermission: Array<PermissionComponent> = res.data as Array<PermissionComponent>;
                if (coreTool.isEmpty(componentPermission)) {
                    reject("权限组件信息为空");
                }
                store.setPermissions(res.data);
                resolve();
            } else {
                reject("权限组件信息为空");
            }
        }).catch((error) => {
            console.error("获取当前用户权限组件发生错误。", error);
        })
    });
}


/**
 * 获取并设置当前用户信息
 * @return {Promise<void>} 无返回值
 * @author loulan
 */
export const currentUserInfoConfig = async (): Promise<void> => {
    return new Promise((resolve, reject) => {
        currentUserInfo().then(async (res: ResponseResult) => {
            if (res.status == ResponseStatusEnum.OK && res.data) {
                const data: UserInfo = res.data;
                if (coreTool.isNotExist(data)) {
                    return reject("用户信息为空");
                }
                store.setUserInfo(res.data);
                resolve();
            } else {
                return reject("用户信息为空");
            }
        }).catch((error) => {
            console.error("获取当前用户信息发生错误。", error);
        })
    })
}
