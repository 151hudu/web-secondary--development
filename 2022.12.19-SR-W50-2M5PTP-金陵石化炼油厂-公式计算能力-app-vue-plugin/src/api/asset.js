import request from "./request";

// 查询资产
export const queryAssetById = (id) => request.post(`/asset/getAssetData?asset_id=${id}`, []);

// 获取公式类型数据
export const getFormulaType = () => request.get(`ext/plan/apply/queryFormulaType`);

// 获取公式名称数据
export const getFormulaName = (type) => request.get(`ext/plan/apply/queryFormula?type=${type}`);
