import intl from 'react-intl-universal';
/**
 * Created by magic on 2017/8/8.
 * intl.get('COMM.URI')
 */
// import { FetchApi } from '@/micro-common/Transform';
// import PopupTips from '@/micro-common/PopupTips';
import request from "./request";
export const queryOfficeAll = () => request.get('system/office');
export const queryOfficeDelCreateMember = (id) => request.get(`system/office?createMember=${id}`);
export const postOffice = (param) => request.post('system/office', param);
// export const queryOfficeAll =request.get('system/office');
// export const queryOfficeAll = function(callback) {
//   let param = {
//     url: `system/office`,
//     method: {
//       method: 'GET',
//       cache: 'reload',
//     },
//   };
//   FetchApi(param, function(data) {
//     if (data.status === 200) {
//       callback(data.result);
//     } else {
//       PopupTips('error', intl.get('COMM.AUQ'), data.message);
//     }
//   });
// };

// export const queryOfficeDelCreateMember = function(id, callback) {
//   let param = {
//     url: `system/office?createMember=${id}`,
//     method: {
//       method: 'GET',
//       cache: 'reload',
//     },
//   };
//   FetchApi(param, function(data) {
//     if (data.status === 200) {
//       callback(data.result);
//     } else {
//       PopupTips('error', intl.get('COMM.AUQ'), data.message);
//     }
//   });
// };

// export const postOffice = function(data, callback) {
//   let param = {
//     url: `system/office`,
//     method: {
//       method: 'POST',
//       cache: 'reload',
//       body: JSON.stringify(data),
//     },
//   };
//   FetchApi(param, function(data) {
//     if (data.status === 200) {
//       callback(data.message);
//     } else {
//       PopupTips('error', intl.get('COMM.OMU'), data.message);
//     }
//   });
// };
