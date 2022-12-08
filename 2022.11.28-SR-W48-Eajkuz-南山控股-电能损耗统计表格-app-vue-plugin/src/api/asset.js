import request from "./request";

/**
 * 查询资产
 * @param id 资产ID
 */
export const queryAssetById = (id) => request.post(`/asset/getAssetData?asset_id=${id}`, []);

export const queryAmmeterLevelOneList = (params) =>
  request.get(`/nankong/energyLoss/queryAmmeterLevelOneList?asset_id=${params.asset_id}&company=${params.company}&regional=${params.regional}&park=${params.park}`);
export const queryAmmeterInfo = (params,data) =>
  request.post(`/nankong/energyLoss/queryAmmeterInfo?asset_id=${params.asset_id}&company=${params.company}&regional=${params.regional}&park=${params.park}`,data);
