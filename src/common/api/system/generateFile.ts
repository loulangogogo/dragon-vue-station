import ask from "../../ask";
import type {pageQuery} from "../../domain/common";

/**
 * 分页获取数据
 * @param       query 查询条件何分页参数
 * @return
 * @author     :loulan
 * */
export const generateFilePageList = <T extends pageQuery>(query: T) => {
    return ask.post(`${import.meta.env.VITE_REQUEST_HANDLER_PRE}/generate-file/pageList`, query);
}


/**
 * 生成文件页面当前站点文件列表
 * @param query 查询参数对象，继承自pageQuery类型
 * @param query dataType
 * @param query generateStatus
 * @param query userId
 * @returns 返回请求结果，包含分页数据列表
 */
export const generateFilePageCurrentStationList = <T extends pageQuery>(query: T) => {
    return ask.post(`${import.meta.env.VITE_REQUEST_HANDLER_PRE}/generate-file/pageCurrentStationList`, query);
}

/**
 * 生成文件页面当前站点用户文件列表
 * @param query 查询参数对象，继承自pageQuery类型
 * @param query dataType
 * @param query generateStatus
 * @return Promise 返回请求结果
 * @author :loulan
 * */
export const generateFilePageCurrentStationUserList = <T extends pageQuery>(query: T) => {
    return ask.post(`${import.meta.env.VITE_REQUEST_HANDLER_PRE}/generate-file/pageCurrentStationUserList`, query);
}