import React, { Component } from "react";
import { Table, Button } from "antd";
import { DownloadOutlined } from '@ant-design/icons';
// import appService from "@njsdata/app-sdk";
import { selectUserQueryData, exportReports } from "./api/asset";
import "./app.less";

export default class App extends Component {
  state = {
    columns: [],
    data: []
  }
  componentDidMount() {
    this.getRepostsData();

    const events = [];
    const actions = [];
    this.props?.customConfig?.componentId &&
      window.componentCenter?.register(
        this.props?.customConfig?.componentId,
        "",
        this,
        {
          events,
          actions,
        }
      );
    // window.componentCenter.registerTriggerForType(
    //   this.props.componentId,
    //   "process",
    //   this,
    //   {
    //     events,
    //     actions,
    //   }
    // );
  }

  goToStudy = () => {
    this.props?.customConfig?.url && window.open(this.props?.customConfig?.url);
  };

  getRepostsData = async () => {
    let {data} = await selectUserQueryData()
    let tableData = data;
    for (let index = 0; index < tableData.length; index++) {
      tableData[index].key = index + 1;
      if (index < 4) {
        tableData[index].group = '一室';
      }
      if (index > 4 && index < 8) {
        tableData[index].group = '二室';
      }
      if (index > 8 && index < 12) {
        tableData[index].group = '三室';
      }
      if (index > 12 && index < 16) {
        tableData[index].group = '四室';
      }
      if (index > 16 && index < 61) {
        tableData[index].group = '五室';
      }
    }
    // console.log("tableData", tableData); 

    const columns = [
      {
        title: '序号',
        dataIndex: 'key',
        fixed: 'left',
        width: 80,
      },
      {
        title: '科室',
        colSpan: 2,
        width: 80,
        dataIndex: 'group',
        onCell: (_, index) => {
          // 一室
          if (index === 0) {
            return {
              rowSpan: 5,
            };
          }
          if (index > 0 && index < 5) {
            return {
              rowSpan: 0,
            };
          }
          // 二室
          if (index === 5) {
            return {
              rowSpan: 4,
            };
          }
          if (index > 5 && index < 9) {
            return {
              rowSpan: 0,
            };
          }
          // 三室
          if (index === 9) {
            return {
              rowSpan: 4,
            };
          }
          if (index > 9 && index < 13) {
            return {
              rowSpan: 0,
            };
          }
          // 四室
          if (index === 13) {
            return {
              rowSpan: 4,
            };
          }
          if (index > 13 && index < 17) {
            return {
              rowSpan: 0,
            };
          }
          // 五室
          if (index === 17) {
            return {
              rowSpan: 44,
            };
          }
          if (index > 17 && index < 61) {
            return {
              rowSpan: 0,
            };
          }
          // 合计
          if (index === 61) {
            return {
              colSpan: 0,
            };
          }
          return {};
        },
      },
      {
        title: '科室',
        width: 350,
        colSpan: 0,
        dataIndex: 'name',
        onCell: (_, index) => {
          // 合计
          if (index === 61) {
            return {
              colSpan: 2,
            };
          }
        },
      },
      {
        title: '派发预警总数',
        dataIndex: 'D',
        width: 130
      },
      {
        title: '超期预警',
        dataIndex: 'E',
        width: 100
      },
      {
        title: '办结预警',
        children: [
          {
            title: '办结数',
            dataIndex: 'F',
            width: 100
          },
          {
            title: '问责整改',
            dataIndex: 'G',
            width: 100
          },
          {
            title: '查否了结',
            dataIndex: 'H',
            width: 100
          }
        ]
      },
      {
        title: '在办预警',
        children: [
          {
            title: '在办数',
            dataIndex: 'I',
            width: 100
          },
          {
            title: '一级预警',
            dataIndex: 'J',
            width: 100
          },
          {
            title: '二级预警',
            dataIndex: 'K',
            width: 100
          },
          {
            title: '三级预警',
            dataIndex: 'L',
            width: 100
          }
        ]
      },
      {
        title: '在办问题线索数量',
        dataIndex: 'M',
        width: 180
      },
      {
        title: '办结问题线索',
        children: [
          {
            title: '第一种形态',
            dataIndex: 'N',
            width: 120
          },
          {
            title: '第二种形态',
            dataIndex: 'O',
            width: 120
          },
          {
            title: '第三种形态',
            dataIndex: 'P',
            width: 120
          },
          {
            title: '第四种形态',
            dataIndex: 'Q',
            width: 120
          }
        ]
      },
    ];
    this.setState({ columns: columns })
    this.setState({ data: data })
  }

  // 报表导出
  AsciiToString = (asccode) => {
    return String.fromCharCode(asccode)
  }
  UrlDecode = (zipStr) => {
    var uzipStr = ''
    for (var i = 0; i < zipStr.length; i += 1) {
      var chr = zipStr.charAt(i)
      if (chr === '+') {
        uzipStr += ' '
      } else if (chr === '%') {
        var asc = zipStr.substring(i + 1, i + 3)
        if (parseInt('0x' + asc) > 0x7f) {
          uzipStr += decodeURI(
            '%' + asc.toString() + zipStr.substring(i + 3, i + 9).toString()
          )
          i += 8
        } else {
          uzipStr += this.AsciiToString(parseInt('0x' + asc))
          i += 2
        }
      } else {
        uzipStr += chr
      }
    }

    return uzipStr
  }
  exportReportsData = () => {
    exportReports()
      .then((res) => {
        const temp = res.headers['content-disposition'].split('=')[1] // 对文件名乱码转义--【Node.js】使用iconv-lite解决中文乱码
        let iconv = require('iconv-lite')
        iconv.skipDecodeWarning = true //忽略警告
        let fileName = iconv.decode(temp, 'utf-8')
        const _res = res.data
        let blob = new Blob([_res])
        let downloadElement = document.createElement('a')
        let href = window.URL.createObjectURL(blob) //创建下载的链接
        downloadElement.href = href
        let fileNameNew = this.UrlDecode(fileName)
        downloadElement.download = fileNameNew //下载后文件名
        document.body.appendChild(downloadElement)
        downloadElement.click() //点击下载
        document.body.removeChild(downloadElement) //下载完成移除元素
        window.URL.revokeObjectURL(href) //释放掉blob对象
      })
      .catch((err) => {
        console.log('导出失败');
      })
  }

  do_EventCenter_messageSuccess() {
    window.location.reload();
  }

  // 逻辑控制用，不可删
  Event_Center_getName() {
    return "";
  }

  render() {
    const { customConfig } = this.props;
    const { componentId } = customConfig || {};
    const { columns, data } = this.state;
    return (
      <>
        <div className="nJreporst">
          <div className="reporstHeader">
            <span></span>
            <span className="headerTitle">平台运行情况表1</span>
            <Button className="downloadBtn" type="primary" icon={<DownloadOutlined />} size="Small" onClick={this.exportReportsData}>导出</Button>
          </div>
          <Table
            columns={columns}
            dataSource={data}
            pagination={false}
            bordered
            scroll={{
              x: 1500,
            }}
            rowClassName={(record, index) => {
              if (index % 2 != 0) return 'stripe';
            }}
          />
        </div>
      </>
    );
  }
}
