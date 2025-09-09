import { coreTool, windowsTool } from "owner-tool-js";
import type { Oauth2AccessToken } from "../domain/interfaces";


/*********************************************************
** LocalStorage存储的key
** 
** @author loulan
** @since 0.0.0
*********************************************************/
enum LocalStorageEnum {
    token = "dragon_token",
}

/**
 * 检查是否存在本地存储的令牌。
 * 
 * 本函数通过调用 `getLocalStorageToken` 函数获取本地存储的令牌，
 * 然后使用 `coreTool.isExist` 方法来检查令牌是否存在。
 * 
 * @return {boolean} 返回一个布尔值，表示令牌是否存在。
 * @author :loulan
 */
export const isExistToken = (): boolean => {
    return coreTool.isExist(getLocalStorageToken());
}

/**
 * 获取授权令牌
 * 
 * 本函数尝试从存储中获取令牌信息，并组合成授权所需的格式
 * 如果令牌信息不存在，则返回 undefined
 * 
 * @return string | undefined | null 返回组合好的授权令牌字符串，如果获取失败则返回 undefined 或 null
 * @author :loulan
 */
export const getAuthorizationToken = (): string | undefined | null => {
    // 从存储中获取令牌信息
    const token = getLocalStorageToken();

    // 检查令牌信息是否存在
    if (coreTool.isExist(token)) {
        // 如果存在，则组合并返回令牌信息
        return token!.tokenType + " " + token!.accessToken;
    } else {
        // 如果不存在，则返回 undefined
        return undefined;
    }
}

/**
 * 获取存储在本地的OAuth2访问令牌
 * 
 * 本函数尝试从localStorage中获取令牌字符串，如果存在则解析并返回令牌对象，
 * 否则返回undefined此函数解释了如何从本地存储中获取OAuth2访问令牌，
 * 并以对象形式返回，以便在应用程序中使用
 * 
 * @return {Oauth2AccessToken|undefined} 返回解析后的OAuth2访问令牌对象，如果未找到令牌，则返回undefined
 * @author :loulan
 */
export const getLocalStorageToken = (): Oauth2AccessToken | undefined => {
    // 从localStorage中获取令牌字符串
    const tokenStr = windowsTool.localStorageTool.get(LocalStorageEnum.token);

    // 检查令牌字符串是否存在
    if (coreTool.isExist(tokenStr)) {
        // 存在时，解析令牌字符串并返回令牌对象
        return JSON.parse(tokenStr!);
    } else {
        // 不存在时，返回undefined
        return undefined;
    }
}

/**
 * 将认证令牌存储到本地存储中
 * （例如accessToken，refreshToken，）
 * 
 * 此函数负责将给定的OAuth2访问令牌信息保存到本地存储中它首先保存访问令牌，
 * 如果提供了刷新令牌，则同样保存刷新令牌这样做是为了在应用重新启动或刷新时，
 * 能够恢复用户的认证状态
 * 
 * @param token OAuth2访问令牌对象，包含访问令牌和刷新令牌信息
 * @return 无返回值
 * @author :loulan
 */
export const setLocalStorageToken = (token: Oauth2AccessToken): void => {
    if (coreTool.isExist(token)) {
        // 进行token的保存
        windowsTool.localStorageTool.set(LocalStorageEnum.token, JSON.stringify(token));
    }
}

/**
 * 移除本地存储中的token
 * 
 * 本函数旨在从本地存储中删除token，以确保在用户登出或执行特定操作后，token能够被正确清理
 * 这对于维护应用的安全性和用户隐私至关重要
 * 
 * @return 无返回值
 * @author :loulan
 */
export const removeLocalStorageToken = (): void => {
    windowsTool.localStorageTool.del(LocalStorageEnum.token);
}


// fixme 可以在会话里面存储一个变量，如果路由访问的时候变量存在
// 那么在提示用户没有权限的时候，可以用来是否进行判断进行提示
// 否则登录页面会提示没有权限