import request from "./request";

/**
 * 查询资产
 * @param id 资产ID
 *
 */
export const queryAssetById = (id, count = 200) =>
  request.post(`/asset/getAssetData?asset_id=${id}&count=${count}`, { filters: [] });

export const queryTimeline = (params) =>
  request.post(`/service/dataapi/rest/8ebf98d1-1be7-495a-99f3-687e01af5017`, params);


//查询当前用户
export const userQuery = () => request.get(`system/authority/user`);