import ask from "../../ask";
import {type pageQuery} from "../../domain/common";


/**
 * 分页获取站点用户数据
 * @param stationId 站点id
 * @param query 查询条件和分页参数
 * @return Promise<any> 返回分页查询结果，包含用户列表和分页信息
 * @author loulan
 */
export const pageStationUserListByStationId = <T extends pageQuery>(stationId:number,query: T) => {
    return ask.post(`${import.meta.env.VITE_REQUEST_SYSTEM_PRE}/station-user/pageListByStationId/${stationId}`, query);
}

/**
 * 分页查询当前站点用户信息
 * @param query - 分页查询参数对象，包含分页信息和查询条件
 * @return Promise<T> 返回分页查询结果，包含用户列表和分页信息
 * @author loulan
 */
export const pageCurrentStationUserList = <T extends pageQuery>(query: T) => {
    return ask.post(`${import.meta.env.VITE_REQUEST_SYSTEM_PRE}/station-user/pageCurrentStationUserList`, query);
}

/**
 * 插入站点用户数据
 * @param data 需要插入的用户数据对象
 * @return Promise<any> 返回插入操作的结果
 * @author loulan
 */
export const stationUserSave = (data:any) => {
    return ask.put(`${import.meta.env.VITE_REQUEST_SYSTEM_PRE}/station-user/save`,data);
}

/**
 * 保存当前站点用户
 * @param data 需要保存的用户数据对象
 * @return Promise<any> 返回保存操作的结果
 * @author loulan
 */
export const saveCurrentStationUser = (data:any) => {
    return ask.put(`${import.meta.env.VITE_REQUEST_SYSTEM_PRE}/station-user/saveCurrentStationUser`,data);
}

/**
 * 更新站点用户数据
 * @param data 需要更新的用户数据对象
 * @return Promise<any> 返回更新操作的结果
 * @author loulan
 */
export const stationUserUpdate = (data:any) => {
    return ask.put(`${import.meta.env.VITE_REQUEST_SYSTEM_PRE}/station-user/update`,data);
}

/**
 * 更新当前站点用户
 * @param data 需要更新的用户数据对象
 * @return Promise<any> 返回更新操作的结果
 * @author loulan
 */
export const updateCurrentStationUser = (data:any) => {
    return ask.put(`${import.meta.env.VITE_REQUEST_SYSTEM_PRE}/station-user/updateCurrentStationUser`,data);
}

/**
 * 根据站点id和用户id删除站点用户
 * @param stationId 站点id
 * @param userId 用户id
 * @return Promise<any> 返回删除操作的结果
 * @author loulan
 */
export const stationUserDel = (stationId:number,userId:number) => {
    return ask.delete(`${import.meta.env.VITE_REQUEST_SYSTEM_PRE}/station-user/delete?stationId=${stationId}&userId=${userId}`);
}

/**
 * 删除当前站点用户
 * @param userId 用户id
 * @return Promise<any> 返回删除操作的结果
 * @author loulan
 */
export const deleteCurrentStationUser = (userId:number) => {
    return ask.delete(`${import.meta.env.VITE_REQUEST_SYSTEM_PRE}/station-user/deleteCurrentStationUser?userId=${userId}`);
}