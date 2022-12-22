import request from "./request";

// 查询资产
export const queryAssetById = (id, page, pageSize) => request.post(`/asset/getAssetData?asset_id=${id}&pageNum=${page}&pageSize=${pageSize}`, {});

export const getAssetData = (id, page, pageSize) => request.get(`/ext/HYKJ/getCurrentData?mainAsset=${id}&pageNum=${page}&pageSize=${pageSize}`, {});
