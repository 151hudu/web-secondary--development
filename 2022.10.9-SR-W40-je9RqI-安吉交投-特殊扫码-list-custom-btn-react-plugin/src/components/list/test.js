/*
 * @Author: zhangjin
 * @Email: jzhang@njsdata.com
 * @LastEditors: zhangjin
 * @Date: 2021-04-08 09:45:16
 * @LastEditTime: 2021-04-12 16:40:32
 * @Description: {intl.get('APP.BUTTON')}（移动端）
 */

import React, { useState } from "react";
import PropTypes from "prop-types";
// import { goPage } from '../method';
import QrScanner from "qr-scanner";
import { Modal } from "antd";
import dd from "gdt-jsapi";
import history from "utils/history";
import { stringify } from "utils/qs";
import "./index.less";

const ScanCode = ({ data }) => {
  let qrScanner = null;
  const [visible, setVariables] = useState(false);
  const { detail } = data;
  const { style = {} } = detail;
  const { backgroundColor, width, height } = style;

  const goPage = (newStr) => {
    if ((newStr && newStr.startsWith("http://")) || newStr.startsWith("https://")) {
      setVariables(false);
      window.location = newStr;
    } else {
      setVariables(false);
      history.push({
        pathname: "/application/scan/view",
        search: stringify({
          urlParam: newStr,
        }),
      });
    }
  };
  const clickBtn = () => {
    let platform = "";
    if (dd.getUserAgent()) {
      platform = "dd";
    }
    setTimeout(() => {
      if (platform === "dd") {
        dd.scan({
          type: "qr",
        }).then((result) => {
          let newStr;
          if (typeof result.text === "string") {
            newStr = result.text;
          } else {
            newStr = JSON.stringify(result);
          }
          goPage(newStr);
        });
      } else {
        qrScanner = new QrScanner(
          document.getElementById("video-contain"),
          (result) => {
            qrScanner.destroy();
            qrScanner = null;
            let newStr;
            if (typeof result.data === "string") {
              newStr = result.data;
            } else {
              newStr = JSON.stringify(result);
            }
            goPage(newStr);
          },
          {
            highlightScanRegion: true,
            highlightCodeOutline: true,
          }
        );
        qrScanner.start();
      }
    }, 300);
  };
  return (
    <div
      className="mobile-scan"
      style={{
        backgroundColor,
      }}
    >
      <div onClick={clickBtn}>按钮</div>

      {visible && (
        <Modal
          onCancel={() => {
            setVariables(!visible);
          }}
          closable={false}
          footer={null}
          visible={visible}
          className="scan-ant-modal-body "
        >
          <div className="head_close">
            <span
              onClick={() => {
                setVariables(!visible);
              }}
            >
              取消
            </span>
          </div>
          <video id="video-contain" style={{ width: "100%" }} />
        </Modal>
      )}
    </div>
  );
};

ScanCode.propTypes = {
  key: PropTypes.string,
  data: PropTypes.object,
  onMobileBlockClick: PropTypes.func,
};

export default ScanCode;
