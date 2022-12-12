import request from "./request";

/**
 * 查询资产(新的)
 * @param {*} params
 */
export const getAssets = (data) => request.post(`asset/data?id=${data.id}`);

/**
 * 查询资产
 */
export const queryAssetById = (id) => request.get("asset", { params: { asset_id: id } });
