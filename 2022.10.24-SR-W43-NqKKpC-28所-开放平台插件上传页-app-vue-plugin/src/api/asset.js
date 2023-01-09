import request from "./request";

/**
 * 查询资产
 * @param id 资产ID
 */
export const queryAssetById = id =>
  request.post(`/asset/getAssetData?asset_id=${id}`, []);

/**
 * 删除插件
 * @param id 
 */

export const deletePlugin = id =>
  request.get(`/plugin/delete?id=${id}`);


/**
 * 下载插件
 * @param id 
 */

export const exportPlugin = id =>
  request.post(`/plugin/export?id=${id}`, null, { responseType: 'blob' });



/**
 * 查询插件
 * @param params  查询条件
 * 
 * {
  "pageNum": 1,
  "pageSize": 999,
  "queryParams": [
    {
      "colName": "type",
      "type": 1,
      "value": 100
    },
    {
      "colName": "catalog_id",
      "type": 1,
      "value": "defaultTeam"
    }
  ]
}
 */

export const queryList = params =>
  request.post(`/plugin/queryList`, {
    "pageNum": 1,
    "pageSize": 999,
    "queryParams": [

      params
    ]
  });



export const userIcon = params =>
  request.post(`userIcon/upload`, params);


/**
 * 插件上传
 * {"name":"re111","id":"c8384613-ef7e-4d5b-93ba-5f228c1f83d0","active":1,"type":100,"catalog_id":"defaultTeam","file_name":"摄像回访 2022-10-22.zip","file_back_name":""}
 * back_key 字节流
 *  key  字节流
 * 
*/
export const puginImport = params =>
  request.post(`plugin/import`, params, { 'Content-Type': 'multipart/form-data' });

/**
 * 
 * 更新插件在没有更新插件包的情况
 * {
  "name": "已选电站1",
  "id": "0e69233f-9223-4336-96c1-3c5d22e57cab",
  "active": 1,
  "type": 100,
  "catalog_id": "defaultTeam",
  "file_name": "plugin-1663124264696.zip",
  "file_back_name": "已选电站.jar"
}
 * userIcon/upload
 * 
*/

export const puginUpdate = params =>
  request.post(`plugin/update`, params);


export const iconUpload = params =>
  request.post(`userIcon/upload`, params);