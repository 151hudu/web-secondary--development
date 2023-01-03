import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import { Modal, Empty } from "antd";

import { queryAssetById } from "../../api/asset";

import "./index.less";

const checkImgExists = (imgurl) => {
   return new Promise(function (resolve, reject) {
      var ImgObj = new Image();
      ImgObj.src = imgurl;
      ImgObj.onload = function (res) {
         resolve(res);
      };
      ImgObj.onerror = function (err) {
         reject(err);
      };
   });
};

const List = (props) => {
   let { customParams } = props;
   const width = customParams?.width || 520;
   const height = customParams?.height || 240;

   //  弹窗
   const [modalVisible, setModalVisible] = useState(false);

   //  图片地址
   const [imgUrl, setImgUrl] = useState("");

   //  是否展示图片
   const [emptyStr, setEmptyStr] = useState(false);

   useEffect(() => {
      getAssetData();
   }, []);

   // 数据转换
   const translatePlatformDataToJsonArray = (originTableData) => {
      let originTableHeader = originTableData.data[0];
      let tableHeader = [];
      originTableHeader.forEach((item) => {
         tableHeader.push(item.col_name);
      });
      let tableBody = originTableData.data[1];
      let tableData = [];
      tableBody.forEach((tableItem) => {
         let temp = {};
         tableItem.forEach((item, index) => {
            temp[tableHeader[index]] = item;
         });
         tableData.push(temp);
      });
      return tableData;
   };

   //  获取对应数据
   const getAssetData = () => {
      let assetId = customParams?.assetId;
      let imgField = customParams?.imgField;

      let dataForm = {
         column: "data_id",
         compareObj: props.dataId,
         datatype: 0,
         type: 10,
      };

      queryAssetById(assetId, 99999, dataForm).then((res) => {
         let resData = translatePlatformDataToJsonArray(res);
         setModalVisible(true);

         let _imgUrl = "data:image/png;base64," + resData[0][imgField];

         checkImgExists(_imgUrl)
            .then((res) => {
               console.log("有效");
               setImgUrl(_imgUrl);
            })
            .catch((err) => {
               console.log("无效");
               setEmptyStr(true);
            });
      });
   };

   return (
      <Modal title="图片展示" visible={modalVisible} footer={null} onCancel={() => setModalVisible(false)} className="tranfer-table-filter-modal" width={width}>
         {emptyStr ? <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description="暂无图片" /> : <img className="previewImg" style={{ height: height + "px" }} src={imgUrl} alt="" />}
      </Modal>
   );
};

List.propTypes = {
   isDesign: PropTypes.bool,
   tableColumns: PropTypes.array,
   modelInfo: PropTypes.object,
};

export default List;
