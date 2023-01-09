import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
// import vConsole from '../../utils/vconsole'
import { message } from "antd";
import { queryAssetById } from './../../api/asset';
import { decrypt } from "../../utils/rsa"
import { newJSBridge } from "../../utils/tgJSBridge"

import './index.less';

newJSBridge(window)

const List = ({
  dataSource,
  customParams,
  dataId,
  deleteData
}) => {
  
  const checkAssetsId = customParams?.checkAssetsId || '4d0c2c48-7c54-b20f-b406-977745e50847';
  const checkKey = customParams?.checkKey || 'product_id';
  const dataIdKey = customParams?.dataId || 'dataId';
  const dataIdKeyName = customParams?.dataIdKey || 'dataId';
  const infoUrl = customParams?.infoUrl || 'https://blog.csdn.net/Mybabyying/article/details/107930743?dataId=123';
  const [phonePowers, setPhonePowers] = useState('');
  const [dialogVisible, setDialogVisible] = useState(false);
  const [messageApi] = message.useMessage();

  useEffect(() => {
    // 判断当前系统是ios还是安卓
    let u = navigator.userAgent;
    let isAndroid = u.indexOf("Android") > -1 || u.indexOf("Adr") > -1; //android终端
    let isIOS = !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/); //ios终端
    if (isAndroid) {
      console.log('安卓手机')
      if (window.IotJSInterface) {
        window.IotJSInterface.putQRScanResult = putQRScanResult;
      } else {
        window.IotJSInterface = {
          putQRScanResult: putQRScanResult
        }
      }
      window.FEParksJSInterface.startQRScanner()
      setPhonePowers("Android")
    }
    if (isIOS) {
      console.log('苹果手机')
      window.jsBridge.bind('SetWebHTMLEditorContent', (json) => { pointCode(json) });
      try {
        window.jsBridge.postNotification("GetWebHTMLEditorContent", {
          uiControlType: 15
        })
      } catch (error) {
        console.log('调用js桥唤起二维码失败', error);
      }
      setPhonePowers("ios")
    }
    // openCode()
  }, [])

  const pointCode = (point) => {
    // console.log('point', point);
    putQRScanResult(point.OcToJs_JSON.data)
  }

  const diaLogClose = () => {
    setDialogVisible(false)
  }

  const putQRScanResult = async (pointName) => {
    let decryptPointName = decrypt(pointName) // 解密
    console.log('codeRes', decryptPointName);
    let params = [
      {
        column: checkKey,
        datatype: 0,
        type: 10,
        compareObj: decryptPointName
      }
    ]
    let { data } = await queryAssetById(checkAssetsId, params)
    // console.log('data', data);
    let keys = data[0],
        values = data[1],
        obj = {};
    values.forEach(x=>{
      keys.forEach((y,yIndex)=>{
        obj[y.col_name] = x[yIndex]
      });
    });
    if (data[2] > 0) {
      if (obj[dataIdKeyName] != dataId) {
        messageApi.open({
          type: 'warning',
          content: '扫描结果与当前数据不匹配',
        })
      } else {
        let urlA = infoUrl.indexOf('?')
        if (urlA != "-1") {
          // alert(`${window.location.origin}${infoUrl}&${dataIdKey}=${dataId}&pointName=${decryptPointName}`)
          window.location.href = `${window.location.origin}${infoUrl}&${dataIdKey}=${dataId}`;
        } else {
          // alert(`${window.location.origin}${infoUrl}?${dataIdKey}=${dataId}&pointName=${decryptPointName}`)
          window.location.href = `${window.location.origin}${infoUrl}?${dataIdKey}=${dataId}`;
        }
      }
    }else {
      setDialogVisible(true)
    }
  }

  return (
    <>
      { 
        dialogVisible ? 
          <div className="zhezhao" onClick={() => { diaLogClose() }}>
            <div className="dialogBox">
              <div className="dialogBody">
                <div className="nfcTip">查无此设备信息，请确认该设备是否属于巡检设备或联系管理员</div>
              </div>
              <div className="lineHr"></div>
              <div className="dialogFoot">
                <div className="footBtn" onCclick={() => { diaLogClose() }}>知道了</div>
              </div >
            </div >
          </div >
        : ''
      }
    </>
  );
};

List.propTypes = {
  isDesign: PropTypes.bool,
  tableColumns: PropTypes.array,
  modelInfo: PropTypes.object,
};

export default List;
