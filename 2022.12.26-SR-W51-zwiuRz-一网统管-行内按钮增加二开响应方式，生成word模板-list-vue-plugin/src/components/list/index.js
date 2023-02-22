import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import { Row, Col, Modal, Button } from "antd";
import { getAssetJSONForProduct } from "./../../api/asset";
import moment from 'moment'
import "./index.less";

const List = ({ dataSource, customParams, dataId, deleteData }) => {
  console.log(dataSource, customParams);
  let { type } = customParams;
  let { department } = customParams;
  let { fieldName } = customParams;
  let { dayUrl } = customParams;
  let { monUrl } = customParams;
  let { yearUrl } = customParams;
  let [iframURL, setIframURL] = useState("");
  let [title, setITitle] = useState("日报");
  let [create_time, setCreate_time] = useState("");
  useEffect(() => {
    let time = "";
    let typeRow = "";
    let departmentRow = "";
    dataSource.forEach((element) => {
      if (element.title == fieldName) {
        time = element.value.value;
      }
      if (element.title == type) {
        typeRow = element.value.value;
      }
      if (element.title == department) {
        departmentRow = element.value.value;
      }
    });
    if (typeRow == 1) {
      setITitle("月报");
      setIframURL(`${monUrl}&type=${typeRow}&department=${departmentRow}&createtime=${time}`);
    } else if (typeRow == 2) {
      setITitle("年报");
      setIframURL(`${yearUrl}&type=${typeRow}&department=${departmentRow}&createtime=${time}`);
    } else {
      setITitle("日报");
      setIframURL(`${dayUrl}&type=${typeRow}&department=${departmentRow}&createtime=${time}`);
    }
    handleClick();
  }, []);

  const handleClick = async () => {
    setModalVisible(true);
  };
  const printHTML = () => {
    document.getElementById("printIframe").contentWindow.print();
  };

  const [modalVisible, setModalVisible] = useState(false);

  return (
    <Modal
      title={title}
      visible={modalVisible}
      footer={null}
      onCancel={() => setModalVisible(false)}
      className="tranfer-table-filter-modal"
      width={"60%"}
      bodyStyle={{ height: "600px" }}
    >
      <Button type="primary" onClick={printHTML}>
        调用系统打印
      </Button>
      <iframe src={iframURL} id="printIframe" frameborder="0" width="100%" height="95%"></iframe>
    </Modal>
  );
};

List.propTypes = {
  isDesign: PropTypes.bool,
  tableColumns: PropTypes.array,
  modelInfo: PropTypes.object,
};

export default List;
