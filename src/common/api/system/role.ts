import ask from "../../ask";
import {core as coreTool} from "owner-tool-js";
import type {pageQuery} from "../../domain/common";
/**
 * 获取所有的角色类型
 * @param
 * @return
 * @author     :loulan
 * */
export const getRoleType = () => {
    return ask.get(`${import.meta.env.VITE_REQUEST_SYSTEM_PRE}/roleType/getRoleType`);
}

/**
 * 获取所有状态正常角色
 * @param
 * @return
 * @author     :loulan
 * */
export const getRoleList = () => {
    return ask.get(`${import.meta.env.VITE_REQUEST_SYSTEM_PRE}/role/getList`);
}

/**
 * 获取所有的角色
 * @param
 * @return
 * @author     :loulan
 * */
export const getRoleAllList = () => {
    return ask.get(`${import.meta.env.VITE_REQUEST_SYSTEM_PRE}/role/getAllList`);
}

/**
 * 分页查询角色数据
 * @param
 * @return
 * @author     :loulan
 * */
export const rolePageList = <T extends pageQuery>(query: T)=> {
    return ask.post(`${import.meta.env.VITE_REQUEST_SYSTEM_PRE}/role/pageList`,query);
}

/**
 * 获取非指定类型id集合的角色数据
 * @return
 * @author     :loulan
 * @param roleTypeIds 数组类型
 * @param status
 * */
export const getRoleByNoType = (roleTypeIds: any, status?: number) => {
    let param: string = coreTool.isExist(status) ? `status=${status}` : '';
    return ask.post(`${import.meta.env.VITE_REQUEST_SYSTEM_PRE}/role/getRoleByNoType?${param}`, roleTypeIds);
}

/**
 * 根据角色类型获取角色数据
 * @return
 * @author     :loulan
 * @param roleTypeId
 * @param name
 * @param status
 * */
export const getRoleByType = (roleTypeId: number, name?: string, status?: number) => {
    let param: string = coreTool.isExist(name) ? `&name=${name}` : '';
    param += coreTool.isExist(status) ? `&status=${status}` : '';
    return ask.get(`${import.meta.env.VITE_REQUEST_SYSTEM_PRE}/role/getRoleByType/${roleTypeId}?1=1&${param}`);
}

/**
 * 根据部门id获取角色数据
 * @param
 * @return
 * @author     :loulan
 * */
export const getRoleByDept = (deptId: any, name?: string) => {
    let param: string = coreTool.isExist(name) ? `name=${name}` : '';
    return ask.get(`${import.meta.env.VITE_REQUEST_SYSTEM_PRE}/role/getRoleByDept/${deptId}?${param}`);
}

/**
 * 角色类型的插入
 * @param
 * @return
 * @author     :loulan
 * */
export const roleTypeSave = (data: any) => {
    return ask.put(`${import.meta.env.VITE_REQUEST_SYSTEM_PRE}/roleType/save`, data);
}

/**
 * 角色类型的更新
 * @param
 * @return
 * @author     :loulan
 * */
export const roleTypeUpdate = (data: any) => {
    return ask.put(`${import.meta.env.VITE_REQUEST_SYSTEM_PRE}/roleType/update`, data);
}

/**
 * 根据id删除角色类型
 * @param
 * @return
 * @author     :loulan
 * */
export const roleTypeDel = (id: number) => {
    return ask.delete(`${import.meta.env.VITE_REQUEST_SYSTEM_PRE}/roleType/delete/${id}`);
}

/**
 * 角色的插入
 * @param
 * @return
 * @author     :loulan
 * */
export const roleSave = (data: any, deptId?: any) => {
    const param: string = coreTool.isExist(deptId) ? `deptId=${deptId}` : '';
    return ask.put(`${import.meta.env.VITE_REQUEST_SYSTEM_PRE}/role/save?${param}`, data);
}

/**
 * 角色的更新
 * @param
 * @return
 * @author     :loulan
 * */
export const roleUpdate = (data: any) => {
    return ask.put(`${import.meta.env.VITE_REQUEST_SYSTEM_PRE}/role/update`, data);
}

/**
 * 根据id删除角色
 * @param
 * @return
 * @author     :loulan
 * */
export const roleDel = (id: number) => {
    return ask.delete(`${import.meta.env.VITE_REQUEST_SYSTEM_PRE}/role/delete/${id}`);
}

/**
 * 角色关联权限和菜单
 * @param
 * @return
 * @author     :loulan
 * */
export const permissionMenuSaveAndUpdate = (roleId: number, data: any) => {
    return ask.put(`${import.meta.env.VITE_REQUEST_SYSTEM_PRE}/resourcesRole/permissionMenuSaveAndUpdate/${roleId}`, data);
}

/**
 * 角色关联权限和菜单,只能修改当前用户拥有的权限菜单
 * 并且角色必须是当前用户部门或下级部门的角色
 * @param
 * @return
 * @author     :loulan
 * */
export const permissionMenuSaveAndUpdateByCurrentUser = (roleId: number, data: any) => {
    return ask.put(`${import.meta.env.VITE_REQUEST_SYSTEM_PRE}/resourcesRole/permissionMenuSaveAndUpdateByCurrentUser/${roleId}`, data);
}

/**
 * 通过角色id获取权限菜单关联数据
 * @param
 * @return
 * @author     :loulan
 * */
export const getPermissionMenuByRoleId = (roleId: number) => {
    return ask.get(`${import.meta.env.VITE_REQUEST_SYSTEM_PRE}/resourcesRole/getPermissionMenuByRoleId/${roleId}`);
}

/**
 * 通过用户获取角色数据
 * @param
 * @return
 * @author     :loulan
 * */
export const getRoleByUserId = (userId: number) => {
    return ask.get(`${import.meta.env.VITE_REQUEST_SYSTEM_PRE}/role/getByUserId/${userId}`);
}

/**
 * 通过站点获取角色数据,60是站点资源关联类型
 * @param
 * @return
 * @author     :loulan
 * */
export const getRoleByStationId = (stationId: number) => {
    return ask.get(`${import.meta.env.VITE_REQUEST_SYSTEM_PRE}/role/getByResourceId?resourceId=${stationId}&resourceType=60`);
}

/**
 * 根据当前站点ID获取角色信息
 * @param   
 * @return  Promise<any> 返回角色信息的Promise对象
 * @author  :loulan
 * */
export const getRoleByCurrentStation = () => {
    return ask.get(`${import.meta.env.VITE_REQUEST_SYSTEM_PRE}/role/getByCurrentStationId`);
}

/**
 * 通过客户端获取角色数据，10是客户端资源关联类型
 * @param
 * @return
 * @author     :loulan
 * */
export const getRoleByClientId = (clientId: number) => {
    return ask.get(`${import.meta.env.VITE_REQUEST_SYSTEM_PRE}/role/getByResourceId?resourceId=${clientId}&resourceType=10`);
}

/**
 * 通过用户获取角色数据
 * @param
 * @return
 * @author     :loulan
 * */
export const addRoleResourceDataByRoleAndUser = (roleId:number,userId: number) => {
    return ask.put(`${import.meta.env.VITE_REQUEST_SYSTEM_PRE}/resourcesRole/addDataByRoleAndUser?roleId=${roleId}&userId=${userId}`);
}

/**
 * 通过用户获取角色数据
 * @param
 * @return
 * @author     :loulan
 * */
export const deleteRoleResourceDataByRoleAndUser = (roleId:number,userId: number) => {
    return ask.delete(`${import.meta.env.VITE_REQUEST_SYSTEM_PRE}/resourcesRole/deleteDataByRoleAndUser?roleId=${roleId}&userId=${userId}`);
}

/**
 * 通过站点获取角色数据
 * @param
 * @return
 * @author     :loulan
 * */
export const addRoleResourceDataByRoleAndStation = (roleId:number,stationId: number) => {
    return ask.put(`${import.meta.env.VITE_REQUEST_SYSTEM_PRE}/resourcesRole/addDataByRoleAndStation?roleId=${roleId}&stationId=${stationId}`);
}

/**
 * 通过站点获取角色数据
 * @param
 * @return
 * @author     :loulan
 * */
export const deleteRoleResourceDataByRoleAndStation = (roleId:number,stationId: number) => {
    return ask.delete(`${import.meta.env.VITE_REQUEST_SYSTEM_PRE}/resourcesRole/deleteDataByRoleAndStation?roleId=${roleId}&stationId=${stationId}`);
}

/**
 * 通过客户端获取角色数据
 * @param
 * @return
 * @author     :loulan
 * */
export const addRoleResourceDataByRoleAndClient = (roleId:number,Client: number) => {
    return ask.put(`${import.meta.env.VITE_REQUEST_SYSTEM_PRE}/resourcesRole/addDataByRoleAndClient?roleId=${roleId}&clientId=${Client}`);
}

/**
 * 删除客户端角色
 * @param
 * @return
 * @author     :loulan
 * */
export const deleteRoleResourceDataByRoleAndClient = (roleId:number,Client: number) => {
    return ask.delete(`${import.meta.env.VITE_REQUEST_SYSTEM_PRE}/resourcesRole/deleteDataByRoleAndClient?roleId=${roleId}&clientId=${Client}`);
}