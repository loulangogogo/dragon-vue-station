import { type InternalAxiosRequestConfig } from "axios";
import { coreTool } from "owner-tool-js";
import { getAuthorizationToken } from "../tool/storageTool";

export default (config: InternalAxiosRequestConfig)=>{
    const token = getAuthorizationToken();
    if (coreTool.isExist(token)) {
        // 在请求头中添加token
        config.headers.Authorization = token;
    }
    return config;
}
