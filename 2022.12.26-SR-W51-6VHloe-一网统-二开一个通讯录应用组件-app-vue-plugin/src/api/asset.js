import request from "./request";

/**
 * 查询资产
 * @param id 资产ID
 *
 */
export const getOfficeList = () => request.get(`/system/office/getOfficeList`);
export const queryAddressListInfo = (params,data) => request.post(`/ext/ywtg/queryAddressListInfo?officeId=${params.officeId}&asset_id=${params.asset_id}`, data);
