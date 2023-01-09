import request from "./request";

// /**
//  * 查询资产
//  * @param id 资产ID
//  */
export const queryAssetById = id =>
  request.post(`/asset/getAssetData?asset_id=${id}`, []);

/**
 * 无鉴权查询资产
 * @param id 资产ID
 */
// export const queryAssetById = id =>
//   request.post(`/form/getAssetData?asset_id=${id}`);


export const queryStartVideo = id =>
  request.get(`gardenVideo/getVideoPlayAddress?channelId=${id}`);



export const queryVideoList = (assetId, catalogId) =>
  request.get(`gardenVideo/queryVideoList?asset_id=${assetId}&catalog_id=${catalogId}`)



export const getVideoPlayBackAddress = (catalogId, start, end) =>
  request.get(`gardenVideo/getVideoPlayBackAddress?channelId=${catalogId}&startTime=${start}&endTime=${end}`)


export const execute = (param) =>
  request.post(`inspection/execute`, param)
export const queryCatalogList = (assetId, pid) =>
  request.get(`gardenVideo/queryCatalogList?asset_id=${assetId}&pid=${pid}`)