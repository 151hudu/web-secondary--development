import request from "./request";

/**
 * 查询资产
 * @param id 资产ID
 */
export const queryAssetById = (id) => request.post(`/asset/getAssetData?asset_id=${id}`, []);

/**
 * 无鉴权查询资产
 * @param id 资产ID
 */
export const queryUserByOffice = (params) => request.get(`/system/office/queryCountByOfficeId?OfficeId=${params.OfficeId}`);
export const queryUserByOfficeAll = (params) => request.get(`/lxcfAddressList/queryUserByOffice`);
export const queryStaffByOfficeId = (params,data) => request.post(`/system/office/queryStaffByOfficeId?OfficeId=${params.OfficeId}`,data);
export const queryUser = (params) => request.get(`/lxcfAddressList/queryUser`);
// if (val === "") {
//   this.search_Fi_List = [];
// } else {
//   //返回包含关键词的数据
//   this.search_Fi_List = this.arr.filter((item) => {
//     let reg = new RegExp(val);
//     return reg.test(item.cityName) || reg.test(item.id);
//   });
// }