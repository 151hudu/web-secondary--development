import request from "./request";

/**
 * 查询资产
 * @param id 资产ID
 *
 */
// 获取formID
export const queryByMenu = (data) => request.post(`/datapp/mapping/queryByMenu`, data);
