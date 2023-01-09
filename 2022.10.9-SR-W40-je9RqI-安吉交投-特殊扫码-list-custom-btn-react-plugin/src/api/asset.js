import request from "./request";

export const getAssetJSONForProduct = (id) =>
  request.get(`iot/product/getAssetJSONForProduct?productId=${id}`);

export const downloadAssetJSONForProduct = (id) =>
  request.get(`iot/product/downloadAssetJSONForProduct?productId=${id}`);

// export const getUrlId = (dataForm) => request.post("ScanEwm/ScanEwm", dataForm);

export const getUrlId = (dataForm) => request.post("ext/scanEwm", dataForm);
export const newScanEwm = (dataForm) =>
  request.post("ext/scanEwm/newScanEwm", dataForm);
