import ask from "../ask";
import {type LoginData} from "../domain/login";
import {GrantTypeEnum} from "../domain/enums";
import { coreTool } from "owner-tool-js";

/**
 * 登录
 * @param
 * @return
 * @author     :loulan
 * */
export const getToken = (loginData: LoginData) => {
    
    // 创建URLSearchParams对象，用于构建查询字符串参数
    const urlSearchParams: URLSearchParams = new URLSearchParams({
        client_id: "DRAGON_STATION",
        client_secret: "undefined",
    });

    // 遍历登录输入参数对象，将非空值的属性添加到查询字符串参数中
    for (const key in loginData) {
        const value = loginData[key as keyof typeof loginData];
        if (coreTool.isExist(value)){
            urlSearchParams.append(key, <string>value);
        }
    }

    // 发起POST请求，获取token，请求URL中包含查询字符串参数
    return ask.post(`${import.meta.env.VITE_REQUEST_AUTH_PRE}/security/token?${urlSearchParams.toString()}`, {}, <{}>{
        headers: {
            // 根据grant_type设置请求头，控制是否显示错误消息
            isNoResponseErrorMsg: GrantTypeEnum.WECHAT_SCAN == loginData.grant_type,
        }
    })
}

/**
 * 获取微信登陆二维码
 * @param
 * @return
 * @author     :loulan
 * */
export const getWechatQrcode = (type:number)=>{
    return ask.get(`${import.meta.env.VITE_REQUEST_HANDLER_PRE}/wechat/getGzhQrcode/${type}`)
}


