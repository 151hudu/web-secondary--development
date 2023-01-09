/* eslint-disable jsx-a11y/anchor-is-valid */
/* eslint-disable no-restricted-globals */
/*
 * @Author: sun
 */
import React, { Component } from "react";
import PropTypes from "prop-types";
import { Popover, Tooltip, Badge, message, Typography } from "antd";
import moment from "moment";
import { queryNotification, externalConfirm, setRead } from "./api/asset";
import { BellOutlined } from "@ant-design/icons";
import { NOTICE_EMPTY_IMAGE } from './constant'

import "./notice.less";
const { origin } = window.location;
const routePrefix = "";
const apiContextPath = `${origin}${routePrefix}`;


class ApplicationNotice extends Component {
  static propTypes = {
    id: PropTypes.string,
    styleStore: PropTypes.object,
  };
  state = {
    noticeData: [],
    total: 0,
    page: {
      pageSize: 5,
      pageNum: 1,
      orderBy: "create_time",
      orderSort: "DESC",
      queryParams: [{ colName: "info_status", type: 2, value: "1" }],
    },
  };

  componentDidMount() {
    this.loadDataSource();
  }

  setItemRead = async (item) => {
    try {
      await setRead(item.id);
    } catch (err) {
      console.log(err);
      message.error(err.data.message);
    }
  };
  /**
   * 转换悬浮框的标题：title
   *
   * @param {*} title
   * @memberof ApplicationNotice
   */
  getInfoTitle = (title) => {
    const res = title;
    return res;
  };

  goAnalyzer = (item) => {
    this.setItemRead(item);
    if (item.info_type === "4") {
      window.open(
        `${apiContextPath}/event/detailsv2?objectid=${item.object_id}&type=deal-approval`
      );
    } else {
      window.open(
        `${apiContextPath}/analyzer/${item.analysis_id}?&owner=1&module=数据分析仪`
      );
    }
  };

  loadDataSource = async () => {

    const { data } = await queryNotification(this.state.page)
    console.log(data);

    this.setState({
      total: data.totalCount,
      noticeData: data.results,
    });
  };
  externalConfirm = async (item, agree) => {
    await externalConfirm(item.object_id, agree);
    this.loadDataSource();
  };
  getDescContent = (item) => {
    let showName = "";
    try {
      showName = JSON.parse(item?.info_content).viewName;
    } catch (e) {
      console.log(e);
    }
    return `导出文件完成「${showName}」导出文件已完成。文件下载链接将于24小时后失效，请尽快下载
    )}`;
  };
  outLink = () => {
    const { msgLink } = this.props || '';
    if (msgLink) {
      window.open(msgLink)
    }
  }
  render() {
    const { noticeData, total } = this.state;
    return (
      <Popover
        trigger="hover"
        overlayClassName="notice-popover"
        content={
          <div className='notice-popover-content'>
            <div className="notice-title">
              <span>通知</span>
              {noticeData.length !== 0 && (
                <span className="notice-num">
                  {total}
                </span>
              )}
            </div>
            <div className='notice-list'>
              {noticeData.map((item, index) => {
                return (
                  <div
                    key={index}
                    className="index-notify-hover"
                    style={{ cursor: item.info_url ? "pointer" : 'not-allowed' }}
                    onClick={() => {
                      item.info_url && window.open(item.info_url)
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        paddingBottom: "15px",
                        alignItems: 'center'
                      }}
                    >
                      <Tooltip title={item.info_title}>
                        <Typography.Title level={5} ellipsis>
                          {item.info_url_title}-{item.info_title}
                        </Typography.Title>
                      </Tooltip>
                      <span style={{ fontSize: "12px", color: "#999999", flexShrink: 0, marginBottom: '0.5em', marginLeft: '5px', lineHeight: 1 }}>
                        {moment(item.last_modify_time).format("YYYY-MM-DD")}
                      </span>
                    </div>
                    <div>{item.info_content}</div>
                  </div>
                );
              })}
            </div>
            {noticeData.length === 0 && (
              <img
                alt=""
                className="empty-img"
                src={NOTICE_EMPTY_IMAGE}
              />
            )}
            <div
              className='all-notice-button'
              onClick={() => this.outLink()}
            >
              查看全部通知
            </div>
          </div>
        }
      >
        <div className="header-notice">
          <Badge
            dot={noticeData.length > 0}
            style={{ top: "2px", right: "4px" }}
          >
            <BellOutlined style={{ margin: "0px 5px 0px 10px" }} />
          </Badge>
        </div>
      </Popover>)
  }
}

export default ApplicationNotice;
