import { windowsTool } from 'owner-tool-js';
import { defineStore } from 'pinia';
import type { Menu, PermissionComponent, UserInfo } from "../common/domain/common";


export const useDragonGlobalStore = defineStore('system', {
    state: () => (<{
        _loadingStatus: boolean,

        _screenHeight: number,
        _screenWidth: number,
        _frameHeaderHeight: number,
        _frameFooterHeight: number,
        _frameSiderMaxWidth: number,
        _frameContentTitleHeight: number,

        _menus: Array<Menu>,
        _userInfo: UserInfo,
        _permissions: Array<PermissionComponent>
    }>{
            _loadingStatus: false,       // 项目是否加载完成(由路由后置守卫设置)

            _screenHeight: 0,            // 浏览器可使内容高度
            _screenWidth: 0,             // 浏览器可视内容宽度
            _frameHeaderHeight: 0,      // 框架头部高度，以前 50
            _frameFooterHeight: 0,       // 框架脚部高度
            _frameSiderMaxWidth: 300,    // 框架菜单栏部分最大宽度
            _frameContentTitleHeight: 45,// 框架内容部分头部高度，以前 40（有头部高度的时候）

            _menus: [],                   // 当前用户的菜单
            _userInfo: {},               // 当前用户信息
            _permissions: [],              // 当前用户组件权限数据
        }),
    getters: {
        loadingStatus: (state: any): boolean => state._loadingStatus,
        screenHeight: (state: any): number => state._screenHeight,
        screenWidth: (state: any): number => state._screenWidth,
        frameHeaderHeight: (state: any): number => state._frameHeaderHeight,
        frameFooterHeight: (state: any): number => state._frameFooterHeight,
        frameSiderMaxWidth: (state: any): number => state._frameSiderMaxWidth,
        frameContentTitleHeight: (state: any): number => state._frameContentTitleHeight,


        menus: (state: any): Array<Menu> => state._menus,
        permissions: (state: any): Array<PermissionComponent> => state._permissions,
        userInfo: (state: any): UserInfo => state._userInfo,
        /*******************************************************************************************************************************************************/

        // 获取框架内容部分高度(浏览器可视高度-头部高度-脚部高度-内容部分头部高度)
        frameContentHeight: (state: any): number => state._screenHeight - state._frameHeaderHeight - state._frameFooterHeight - state._frameContentTitleHeight,
        // 获取框架菜单部分高度(浏览器可视高度-头部高度-脚部高度)
        frameSiderHeight: (state: any): number => state._screenHeight - state._frameHeaderHeight - state._frameFooterHeight,
    },
    actions: {

        /**
         * 监听屏幕宽高变化并更新内部属性
         * 
         * 该方法用于初始化屏幕宽高，并设置监听函数以监控浏览器视口尺寸的变化
         * 当浏览器视口的宽度或高度发生变化时，会更新内部的_screenWidth和_screenHeight属性，
         * 并通过控制台日志输出当前的浏览器视口宽度和高度
         * 
         * @author :loulan
         */
        watchScreenWH(): void {
            // 初始化屏幕宽高
            this._screenWidth = windowsTool.pageViewWidth();
            this._screenHeight = windowsTool.pageViewHeight();

            // 监控浏览器视口尺寸变化
            windowsTool.watchPageView((width: number, height: number) => {
                // 更新内部属性以反映最新的屏幕宽高
                this._screenWidth = width;
                this._screenHeight = height;

                // 输出日志信息
                console.log(`浏览器宽高发生变化：\n宽度=${width}\n高度=${height}`);
            })
        },

        /**
         * 设置加载状态
         * @param   status - 加载状态，true表示加载中，false表示加载完成
         * @return  无
         * @author  :loulan
         */
        setLoadingStatus(status: boolean): void {
            this._loadingStatus = status;
        },

        /**
         * 设置菜单项
         * @param   menus - 菜单项数组
         * @return  无
         * @author  :loulan
         */
        setMenus(menus: Array<Menu>): void {
            this._menus = menus;
        },

        /**
         * 设置权限项
         * @param   permissions - 权限项数组
         * @return  无
         * @author  :loulan
         */
        setPermissions(permissions: Array<PermissionComponent>): void {
            this._permissions = permissions;
        },

        /**
         * 设置用户信息
         * @param   userInfo - 用户信息对象
         * @return  无
         * @author  :loulan
         */
        setUserInfo(userInfo: UserInfo): void {
            this._userInfo = userInfo;
        },
    }
})