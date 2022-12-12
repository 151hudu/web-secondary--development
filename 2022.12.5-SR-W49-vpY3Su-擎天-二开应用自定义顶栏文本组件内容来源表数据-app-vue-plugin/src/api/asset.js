import request from "./request";

/**
 * 查询资产(新的)
 * @param {*} params
 */
export const getAssets = (cata, type, params2) => request.post(`asset/queryList?cata=${cata}&type=${type}`, params2);

/**
 * 查询资产
 */
export const queryAssetById = (id) => request.post(`/asset/data?id=${id}`);
export const user = (id) => request.get(`/system/authority/user`);
