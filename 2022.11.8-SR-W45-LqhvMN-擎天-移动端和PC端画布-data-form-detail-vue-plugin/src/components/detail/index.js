import React, { useCallback, useState, useEffect } from "react";
import { Table } from "antd";
import "./index.css";
const Detail = (props) => {
  console.log(props, 55555555555);
  // const getData = () => {
  //   console.log("getData");
  // };
  const formatDate = (data) => {
    const date = new Date(data);
    const Y = date.getFullYear() + ".";
    const M = date.getMonth() + 1 + ".";
    const D = date.getDate() + " ";
    const h = (date.getHours() + ":").padStart(3, "0");
    const m = (date.getMinutes() + ":").padStart(3, "0");
    const s = (date.getSeconds() + "").padStart(2, "0");
    return Y + M + D;
  };
  useEffect(() => {
    console.log(98989898);
  }, []);
  const downloadFile = (data) => {
    let a = document.createElement("a");
    let event = new MouseEvent("click");
    a.href = `${window.location.origin}${data.url}`;
    a.download = data.name;
    a.dispatchEvent(event);
  };
  let showFiled = props.configData.displayConditions;
  let artAllinfo = props.detailData;
  let content = "";
  let title = "";
  let time = "";
  let souce = "";
  let file = [];
  let num = "";
  showFiled.forEach((item) => {
    item.conditionalJ = JSON.parse(item.conditional)[0];
  });
  showFiled.forEach((item) => {
    if (item.conditionalJ.title.indexOf("内容") !== -1) {
      artAllinfo.forEach((itemSon, itemIndex) => {
        console.log(itemSon.componentId, item.conditional.id);
        if (itemSon.componentId == item.conditionalJ.id) {
          content = itemSon.result.value;
        }
      });
      console.log(content);
    }
    if (item.conditionalJ.title.indexOf("标题") !== -1) {
      artAllinfo.forEach((itemSon, itemIndex) => {
        if (itemSon.componentId == item.conditionalJ.id) {
          console.log(123);
          title = itemSon.result.value;
          console.log(title);
        }
      });
    }
    if (item.conditionalJ.title.indexOf("发布时间") !== -1) {
      artAllinfo.forEach((itemSon, itemIndex) => {
        if (itemSon.componentId == item.conditionalJ.id) {
          time = formatDate(itemSon.result.value);
        }
      });
    }
    if (item.conditionalJ.title.indexOf("浏览次数") !== -1) {
      artAllinfo.forEach((itemSon, itemIndex) => {
        if (itemSon.componentId == item.conditionalJ.id) {
          num = itemSon.result.value;
        }
      });
    }
    if (item.conditionalJ.title.indexOf("来源") !== -1) {
      artAllinfo.forEach((itemSon, itemIndex) => {
        if (itemSon.componentId == item.conditionalJ.id) {
          souce = itemSon.result.value;
        }
      });
    }
    if (item.conditionalJ.title.indexOf("附件") !== -1) {
      artAllinfo.forEach((itemSon, itemIndex) => {
        if (itemSon.componentId == item.conditionalJ.id) {
          console.log(eval(JSON.parse(itemSon.result.value)));
          file = eval(JSON.parse(itemSon.result.value));
          console.log(file);
        }
      });
    }
  });
  console.log(showFiled);

  return (
    <>
      <div></div>
      <div className="articleTitleInfo">{title}</div>
      <div className="articleInfo">
        <span>发布时间：{time}</span>
        <span>浏览次数：{num}</span>
        <span>发布来源：{souce}</span>
      </div>
      <hr></hr>
      <div className="articleContent">
        <span dangerouslySetInnerHTML={{ __html: content }}></span>
        <h1 className="fujianText">附件：</h1>
        {file.map((item, index) => {
          return (
            <>
              <span className="downloadItem" onClick={() => downloadFile(item)}>
                {index + 1}.{item.name}
              </span>
              <br />
            </>
          );
        })}
      </div>
    </>
  );
};

export default Detail;
