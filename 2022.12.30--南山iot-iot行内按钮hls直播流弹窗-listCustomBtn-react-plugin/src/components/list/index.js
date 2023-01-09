import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import { Modal } from "antd";
import { queryLiveing } from './../../api/asset';
import ReactPlayer from 'react-player'
import './index.less';

const List = ({
  dataSource,
  customParams,
  dataId,
  deleteData
}) => {

  const width = customParams ? customParams.width : 600;
  const [modalVisible, setModalVisible] = useState(false);
  const [liveRes, setliveRes] = useState({});

  useEffect(() => {
    setModalVisible(true);
    handleClick();
  }, [])

  const handleClick = async () => {
    let liveUrl = null
    try {
      const { data } = await queryLiveing(dataId)
      liveUrl = data.url;
      setliveRes(data)
      console.log('data', data);
      console.log("liveUrl===>", liveUrl);
    } catch (error) {
      console.log(error);
    }
  }

  const destroyflvPlayer = () => {
    // 直播断流
    setModalVisible(false)
  }

  return (
    <>
      <Modal title={liveRes.deviceName ? liveRes.deviceName : "直播弹窗"} visible={modalVisible} footer={null} destroyOnClose={true} onCancel={destroyflvPlayer} className="tranfer-table-filter-modal" width={width}>
        <ReactPlayer
          className= 'react-player'
          url= {liveRes.url}
          width='100%'
          height='100%'
          playing={true}
          controls
        />
      </Modal>     
    </>
  );
};

List.propTypes = {
  isDesign: PropTypes.bool,
  tableColumns: PropTypes.array,
  modelInfo: PropTypes.object,
};

export default List;
