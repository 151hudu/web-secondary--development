import request from "./request";

/**
 * 查询资产(新的)
 * @param {*} params
 */
 export const queryAssetById = (id) => request.post(`/asset/getAssetData?asset_id=${id}`, []);
