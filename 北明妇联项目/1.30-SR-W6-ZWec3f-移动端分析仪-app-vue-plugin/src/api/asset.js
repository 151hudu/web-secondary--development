import request from "./request";

/**
 * 查询资产
 * @param id 资产ID
 *
 */
export const queryAssetById = (id, count = 200) =>
  request.post(`/asset/getAssetData?asset_id=${id}&count=${count}`, { filters: [] });


export const queryOffecid = (params) =>
  request.post(`service/dataapi/rest/783a7864-ebbd-4303-a33a-959dd88de8a4  `, params);


//查询当前用户
export const userQuery = () => request.get(`system/authority/user`); 