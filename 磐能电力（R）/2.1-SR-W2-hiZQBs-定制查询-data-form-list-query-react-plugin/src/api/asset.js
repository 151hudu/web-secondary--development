import request from "./request";

/**
 * 查询资产
 * @param id 资产ID
 *
 */
export const queryAssetById = (id, count = 200) =>
  request.post(`/asset/getAssetData?asset_id=${id}&count=${count}`, { filters: [] });


/**
* 查询指定某一列数据
* @param id 资产ID
*
*/
export const getAssetData = (id, colName, filterObj = []) =>
  request.post(`form/assetData/getAssetData?asset_id=${id}`, {
    "distinct": true,
    "filterGroupList": [
      {
        "filters": filterObj
      }
    ],
    "columnNames": Array.isArray(colName) ? colName : [colName],
    // "sorts": [
    //   {
    //     "orderColumn": colName,
    //     "orderType": "ASC"
    //   }
    // ],
    "loadFilters": [],
    "count": 100000
  });
