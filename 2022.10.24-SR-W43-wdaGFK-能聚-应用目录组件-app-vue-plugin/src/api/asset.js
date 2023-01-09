import request from "./request";

/**
 * 查询资产
 * @param id 资产ID
 */
// export const queryAssetById = (id, param = []) =>
//   request.post(`/asset/getAssetData?asset_id=${id}&count=99999`, param);

/**
 * 无鉴权查询资产
 * @param id 资产ID
 */
export const queryAssetById = id =>
  request.post(`/form/getAssetData?asset_id=${id}`, []);

export const queryMenuTree = (id, voucherId) =>
  request.get(`/NJAccessory/queryMenuTree?assetId=${id}&voucherId=${voucherId}`);

export const queryAccessoryData = (id, voucherId, code) =>
  request.get(`/NJAccessory/queryAccessoryData?assetId=${id}&voucherId=${voucherId}&code=${code}`);

export const getFileStream = (id) =>
  request.get(`/NJAccessory/getFileStream?fileNo=${id}`, { responseType: 'blob' });


export const userQuery = () => request.get(`system/authority/user`);


// export const getFileStream = (id) =>
//   request.get(`/NJAccessory/getFileStream1`, { responseType: 'blob' });
//   // http://10.15.111.15:12345/sdata/rest/NJAccessory/getFileStream1
