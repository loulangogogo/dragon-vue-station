/*********************************************************
** 确认框配置对象
** 
** @author loulan
** @since 0.0.1
*********************************************************/
export interface dragonConfirmConfig{
    title?: string;
    content?: string;
}

/*********************************************************
 ** 获取微信二维码的时候返回的二维码对象
 ** <br><br>
 ** Date: Created in 2023/2/22 23:06
 ** @author loulan
 ** @version 0.0.0
 *********************************************************/
export interface Qrcode{
    ticket?: string,
    url?: string,
    expire_seconds?: number
}

/*********************************************************
** token对象类型
** 
** @author loulan
** @since 0.0.1
*********************************************************/
export interface Oauth2AccessToken {
    accessToken?: string;
    tokenType?: string;
    expiresIn?: number;
    refreshToken?: string;
    scope?: string;
}
