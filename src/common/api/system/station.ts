import ask from "../../ask";
import type {pageQuery} from "../../domain/common";


/**
 * 分页获取数据
 * @param       query 查询条件何分页参数
 * @return
 * @author     :loulan
 * */
export const pageStationList = <T extends pageQuery>(query: T) => {
    return ask.post(`${import.meta.env.VITE_REQUEST_SYSTEM_PRE}/station/pageList`, query);
}

/**
 * 插入
 * @param
 * @return
 * @author     :loulan
 * */
export const stationSave = (data:any) => {
    return ask.put(`${import.meta.env.VITE_REQUEST_SYSTEM_PRE}/station/save`,data);
}

/**
 * 更新
 * @param
 * @return
 * @author     :loulan
 * */
export const stationUpdate = (data:any) => {
    return ask.put(`${import.meta.env.VITE_REQUEST_SYSTEM_PRE}/station/update`,data);
}

/**
 * 根据id删除
 * @param
 * @return
 * @author     :loulan
 * */
export const stationDel = (id:number) => {
    return ask.delete(`${import.meta.env.VITE_REQUEST_SYSTEM_PRE}/station/delete/${id}`);
}
