import request from "./request";

/**
 * 查询资产
 * @param id 资产ID
 */
 export const queryConfigWithoutToken = (params) => request.get(`/system/config/queryConfigWithoutToken?type=ning_hang`);
 export const getDataInfo = (params,data) => request.post(`${params}`,data);
