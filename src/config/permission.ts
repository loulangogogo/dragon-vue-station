import { core as coreTool } from 'owner-tool-js';
import { DragonMessage } from '../common/domain/component';
import { isExistToken } from '../common/tool/storageTool';
import router from '../router/index';
import { currentUserComponentPermissionConfig, currentUserInfoConfig, currentUserMenuConfig, generateMenuRouter } from "../router/routerMenu";
import { useDragonGlobalStore } from "../store";

const store = useDragonGlobalStore();

/**
 * 路由全局前置守卫
 * @param       to:router即将进入的路由对象
 * @param       from:当前导航即将离开的路由
 * @return
 * @author     :loulan
 * */
router.beforeEach(async (to, from) => {
    if (to.path != '/login') {

        // 如果token不存在就去登录页面
        if (!isExistToken()) {
            return "/login";
        }

        // 如果菜单数据为空，那么就获取菜单并重新生成菜单路由(整个数据的获取必须在token存在，也就是登录成功之后才能进行)
        if (coreTool.isEmpty(store.menus)) {
            try {
                await currentUserMenuConfig();
                await generateMenuRouter();
                return { ...to, replace: true };/*重新路由*/
            } catch (e) {
                // 获取菜单失败，或者设置路由失败，按照这个用户没有权限处理
                // 因为正常情况下
                // 1. 登录成功是不会走这里的，因为 store 已经存在菜单数据了
                // 2. 走这里要么是登录功能，要么就是全局刷新，所以如果出现菜单不存在，或者为空，那么按照没有权限处理了。
                console.error(e);
                DragonMessage.error("请确认您的权限！");
                return false;
            }
        }

        // 如果当前用户数据不存在，那么就需要去获取当前用户的数据，（因为各个地方阶段都在使用当前用户的信息）
        if (coreTool.isNotExist(store.userInfo?.id)) {
            try {
                await currentUserInfoConfig();
                await currentUserComponentPermissionConfig();
                return { ...to, replace: true }; /*重新路由*/
            } catch (e) {
                console.error(e);
                DragonMessage.error("请确认当前用户信息！");
                return false;
            }
        }
    }
    return true;
});


/**
 * 路由后置钩子
 * @param       to:router即将进入的路由对象
 * @param       from:当前导航即将离开的路由
 * @param       failure:导航成功与否
 * @return
 * @author     :loulan
 * */
router.afterEach((to, from, failure) => {
    console.log("afterEach-" + to.path);

    // 设置项目加载状态已经完成
    store.setLoadingStatus(true);
})

/**
 * Description :路由发生错误就进入到这里，会出现错误的情况如下：
 * 错误在一个路由守卫函数中被同步抛出；
 * 错误在一个路由守卫函数中通过调用 next(err) 的方式异步捕获并处理；
 * 渲染一个路由的过程中，需要尝试解析一个异步组件时发生错误（一般其实就是路由找不到对应的页面）。
 * @param       e - 错误信息
 * @return
 * @author     :loulan
 * */
router.onError((error, to, from) => {
    console.error("进入路由错误，错误信息--->" + error);
});
