/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-unused-vars */
import React, { useState, useEffect, useRef } from "react";
import { Timeline } from "antd";
import dayjs from "dayjs";
import Configuration from "./components/designConfiguration";
import { css } from "emotion";
import "./app.less";

// 解析数据源，转为table所需格式
const zipObject = (arr1, arr2) => {
  const ret = {};
  arr1.forEach((item, index) => {
    ret[item] = arr2[index];
  });
  return ret;
};
const sortBy = (attr, rev) => {
  //第一个参数是比较的字段名，第二个参数没有传递 默认升序排列true和false
  if (rev === undefined) {
    rev = 1;
  } else {
    rev = rev ? 1 : -1;
  }
  return function (a, b) {
    a = Date.parse(a[attr]);
    b = Date.parse(b[attr]);
    if (a < b) {
      return rev * -1;
    }
    if (a > b) {
      return rev * 1;
    }
    return 0;
  };
};
const componentMap = {
  designConfiguration: Configuration,
};
export default function App({ dataSource: propsData = [], options = {}, configuration = {}, type }) {
  const wrapperRef = useRef(null);
  const { externalVariables = {} } = options;
  const tableDataHeader = (propsData[0] || []).map((t) => t);
  const timeField = externalVariables["时间字段"] || tableDataHeader[0];
  const infoField = externalVariables["信息字段"] || tableDataHeader[1];
  const tableDataSolve = (() => {
    let [header, ...tableData] = propsData;

    return tableData.map((d) => (window?._?.zipObject || zipObject)(header, d));
  })();
  tableDataSolve.sort(sortBy(timeField));
  const tableData = tableDataSolve;
  const classificationField = externalVariables["分类字段"];
  const above = externalVariables["上方"];
  const cardBackgroundColor = externalVariables["卡片背景色"] || "#c4e2e2";
  const cardBorderColor = externalVariables["卡片边框色"] || "#ddd";
  const cardFontFamily = externalVariables["卡片字体"] || "Microsoft YaHei";
  const cardFontSize = externalVariables["卡片字号"] || "16px";
  const cardFontColor = externalVariables["卡片文字颜色"] || "#333";
  const timeFontFamily = externalVariables["时间字体"] || "Microsoft YaHei";
  const timeFontSize = externalVariables["时间字号"] || "12px";
  const timeFontColor = externalVariables["时间文字颜色"] || "#3ca6a6";
  const timeFormat = externalVariables["时间格式"] || "YYYY.M.D HH:mm";
  const timePointHeight = externalVariables["时间点间距"] || "200";
  const messageBoxWidth = externalVariables["消息框宽度"] || "170";
  const messageBoxWidthScroll = externalVariables["消息框宽度"] || "170";

  const isAbove = (item, index) => (classificationField ? (item[classificationField] === above ? true : false) : index % 2 === 0 ? true : false);
  const [containerWidth, setContainerWidth] = useState("200px");

  const wrapperWheel = (e) => {
    e.preventDefault();
    if (wrapperRef.current) {

      wrapperRef.current.scrollLeft += e.deltaY * 6 + e.deltaX * 6;
      console.log(wrapperRef.current.scrollLeft, wrapperRef.current.scrollLeft + e.deltaY * 6 + e.deltaX * 6, '=======ref');
    }
  };

  const contentWheel = (e) => {
    console.log(e, '======');
    e.stopPropagation();
  };

  useEffect(() => {
    setContainerWidth(tableData.length * 200 + 40 + "px");
    wrapperRef.current?.addEventListener("wheel", wrapperWheel);
    const infos = document.getElementsByClassName("timeline-item-info");
    for (let i = 0; i < infos.length; i++) {
      const ele = infos[i];
      ele.addEventListener("wheel", contentWheel);
    }
    return () => {
      wrapperRef.current?.removeEventListener("wheel", wrapperWheel);
      for (let i = 0; i < infos.length; i++) {
        const ele = infos[i];
        ele.removeEventListener("wheel", contentWheel);
      }
    };
  }, []);
  const RenderComponent = componentMap[type];
  // const temp = () => {
  //   if (RenderComponent) {
  //     return <RenderComponent {...this.props} />;
  //   }
  // }

  const timelineCss = css(`
    & {
      .analyzer-timeline {
        min-width: ${containerWidth};
        .ant-timeline-item-head {
          background-color: ${cardBackgroundColor};
          width: 14px;
          height: 14px;
          left: -2px;
        }
        .ant-timeline-item-tail {
          border-left: 2px solid ${cardBackgroundColor};
        }
        .timeline-item-info {
          border: 1px solid ${cardBorderColor};
          background-color: ${cardBackgroundColor};
          font-size: ${cardFontSize};
          color: ${cardFontColor};
          font-family: ${cardFontFamily};
        }
        .timeline-item-time {
          font-size: ${timeFontSize};
          color: ${timeFontColor};
          font-family: ${timeFontFamily};
        }
        .ant-timeline-item{
          height:${timePointHeight + "px"}
        }
        .timeline-item-info{
          width:${messageBoxWidth + "px"}
        }
        .timeline-item-scroll{
          width:${+messageBoxWidthScroll + 15 + "px"}
        }
      }
    }
  `);
  if (RenderComponent) {
    return <RenderComponent {...this.props} />;
  }
  return (


    <div ref={wrapperRef} className={"analyzer-timeline-wrapper " + timelineCss}>
      <div className="analyzer-timeline">
        <Timeline>
          <Timeline.Item className="timeline-item occupy-item" />
          {tableData.map((data, index) => (
            <Timeline.Item key={index} className={"timeline-item" + (isAbove(data, index) ? " above-item" : " below-item")} color={cardBackgroundColor}>
              {!isAbove(data, index) && <div className="timeline-item-time">{dayjs(data[timeField]).format(timeFormat)}</div>}
              <div className="timeline-item-info">
                <div className="timeline-item-scroll">{data[infoField]}</div>
              </div>
              {isAbove(data, index) && <div className="timeline-item-time">{dayjs(data[timeField]).format(timeFormat)}</div>}
            </Timeline.Item>
          ))}
        </Timeline>
      </div>
    </div>
  );
}
