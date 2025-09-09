import ask from "../../ask";
import {type pageQuery} from "../../domain/common";


/**
 * 分页获取站点用户数据
 * @param       stationId 站点id
 * @param       query 查询条件何分页参数
 * @return
 * @author     :loulan
 * */
export const pageStationUserListByStationId = <T extends pageQuery>(stationId:number,query: T) => {
    return ask.post(`${import.meta.env.VITE_REQUEST_SYSTEM_PRE}/station-user/pageListByStationId/${stationId}`, query);
}

/**
 * 插入
 * @param
 * @return
 * @author     :loulan
 * */
export const stationUserSave = (data:any) => {
    return ask.put(`${import.meta.env.VITE_REQUEST_SYSTEM_PRE}/station-user/save`,data);
}

/**
 * 更新
 * @param
 * @return
 * @author     :loulan
 * */
export const stationUserUpdate = (data:any) => {
    return ask.put(`${import.meta.env.VITE_REQUEST_SYSTEM_PRE}/station-user/update`,data);
}

/**
 * 根据id删除
 * @param
 * @return
 * @author     :loulan
 * */
export const stationUserDel = (stationId:number,userId:number) => {
    return ask.delete(`${import.meta.env.VITE_REQUEST_SYSTEM_PRE}/station-user/delete?stationId=${stationId}&userId=${userId}`);
}
