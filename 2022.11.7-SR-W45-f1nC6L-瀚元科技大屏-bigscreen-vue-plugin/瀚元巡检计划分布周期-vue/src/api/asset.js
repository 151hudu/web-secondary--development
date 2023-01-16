import request from "./request";

/**
 * 查询资产(新的)
 * @param {*} params
 */
export const getAssets = (cata, type, params2) =>
    request.post(`asset/queryList?cata=${cata}&type=${type}`, params2);

export const TOPNAlarmInfo = (params) =>
    request.post(`/ext/statisticalAnalysis/queryDataByPeriodTime`, params);

export const queryDropDownBox = () =>
    request.get(`/ext/HanYuanLargeScreen/queryDropDownBox`);
