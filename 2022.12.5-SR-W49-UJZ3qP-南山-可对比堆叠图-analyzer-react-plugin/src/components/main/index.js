import React, { Component } from "react";
import MsgCompConfig from "./msgCompConfig.js";
import { Select, Row, Col } from "antd";
import * as echarts from "echarts";
import Utils from "../../utils";
import './app.less'
import { css } from "emotion";
export default class Main extends Component {
  state = {
    id: "",
    width: "100%",
    height: "100%",
    start: new Date().getFullYear(),
    end: 0,
    year: [],
    option: [],
    optiond: []
  };
  myRef = React.createRef();
  twoRef = React.createRef();
  componentDidMount() {
    //dataSource为分析仪左侧拖入的数据源
    const { dataSource, updateProcess, componentId, options } = this.props;
    this.initComData();
    window?.componentCenter?.register(componentId, "comp", this, MsgCompConfig);
    const customOptions = this.props.options?.externalVariables;
    //内部使用，需求编号，不需要可去掉，用来将需求编号打到dom元素上，方便以后处理问题
    const requirementNum = process.env.CUSTOM_PLUGIN_REQUIREMENT_NUMBER === "需求编号"
      ? ""
      : process.env.CUSTOM_PLUGIN_REQUIREMENT_NUMBER;
    const id = options?.id
      ? `analyzer_secondary_${requirementNum}_${customOptions.id}`
      : `analyzer_secondary_${requirementNum}_${Utils.generateUUID()}`;
    customOptions?.width && this.setState({ width: customOptions.width });
    customOptions?.height && this.setState({ height: customOptions.height });
    this.setState({ id });
    updateProcess && updateProcess();
    // console.log(dataSource, '====a');
    // dataSource.shift()
    let tmepData = [...dataSource]
    tmepData.shift()
    let year = []
    tmepData.forEach((x, i) => {
      year.push(x[0])
    })
    let a = []
    year.forEach((x, i) => {
      if (a.indexOf(Number(x)) == -1) a.push(Number(x))
    });
    a.sort((a, b) => {
      return b - a
    })

    let option = a.map((x, i) => {
      return { label: x, value: x, key: i }
    })
    let optiond = [...option]
    let index = ''
    optiond.forEach((x, i) => {
      if (x.label == new Date().getFullYear()) index = i
    })

    if (index > -1) optiond.splice(index, 1)

    this.setState({ year: a, option, optiond }, () => {
      this.dataHandler(dataSource)
    })

    this.twoRef.current.parentNode.parentNode.style.height = '100%'
    this.twoRef.current.parentNode.style.height = '100%'
  }

  initComData = () => {
    //customConfig为组件式配置项数据
    const customConfig = this.props?.customConfig;
    //customOptions为传统的输入框形式的配置项
    const customOptions = this.props.options?.externalVariables;

    //特别注意，因为配置项区域是懒加载，所以这里要给customConfig一个与配置项(designConfiguration下index.js)那边customConfig一样的默认值，否则由于第一次进去没有执行配置项的代码，customConfig此时其实是会报错，以下为样例

    //!customConfig.number && (customConfig.number =1)

  };
  selectOption = (data) => {
    let tmepData = [...data]
    tmepData.shift()
    let year = []
    tmepData.forEach((x, i) => {
      year.push(x[0])
    })
    let a = []
    year.forEach((x, i) => {
      if (a.indexOf(x) == -1) a.push(x)
    });
    let option = a.map((x, i) => {
      return { label: x, value: x, key: i }
    })
    this.setState({ year })
    return option
  }

  dataHandler = (data, start = new Date().getFullYear(), end = 0) => {
    const { options } = this.props
    const { externalVariables } = options
    const { colorToptitle = '', barMaxWidth = '' } = externalVariables
    let { year } = this.state
    let tempYear = [...year]
    let start1 = year.indexOf(start)
    let end1 = year.indexOf(end)
    let min = Math.min(start1, end1)
    let max = Math.max(start1, end1)
    let sumI = min > -1 ? max - min : 0
    let start2 = min > -1 ? min : max
    let yearList = tempYear.splice(start2, sumI + 1)
    let dateDataList = []
    // console.log(sumI, start2, yearList, '====');s
    let sunArr = []
    // data.shift()
    yearList.forEach((a, d) => {
      let dateData = data.filter((x, i) => {
        if (sunArr.indexOf(x[1]) == -1 && /^[0-9].+$/.test(x[1])) sunArr.push(x[1])
        return x[0] == a
      })
      dateData.sort((a, b) => {
        return a[1] - b[1]
      })
      dateDataList.push(dateData)
    })
    let aList = []
    dateDataList.forEach(dateData => {
      let a = {}
      dateData.forEach((x, i) => {
        if (a[x[2]]) {
          a[x[2]].push(x[3])
        } else {
          a[x[2]] = []
          a[x[2]].push(x[3])
        }
      });

      aList.push(a)
    })
    let monthArr = []
    sunArr.sort((a, b) => {
      return a - b
    })
    monthArr = [...sunArr]
    // for (let i = Math.min(...sunArr); i <= Math.max(...sunArr); i++) {
    //   monthArr.push(i)

    // }
    let seriesData = []
    // console.log(aList, '---');
    aList.forEach((x, i) => {
      let idn = 0
      let leth = Object.keys(x).length
      for (const key in x) {
        idn++
        let tempData = []
        x[key].forEach((test, idnex) => {
          tempData.push({ value: test, year: dateDataList[i][0][0] })
        })
        seriesData.push({
          name: key,
          type: 'bar',
          stack: dateDataList[i][0][0],
          label: {
            show: idn == leth,
            position: 'top',
            formatter: String(dateDataList[i][0][0]),
            fontSize: 14,
            color: colorToptitle || '#3DC3F0',
            fontWeight: 'bold'
          },
          barMaxWidth: barMaxWidth || 60,
          aa: dateDataList[i][0][0],
          // data: x[key],
          data: tempData,
        },)
      }

    })

    this.initEcharts(seriesData, monthArr, Object.keys(aList[0])
    )


  }
  initEcharts = (seriesData, xAxis, legend) => {
    const { options } = this.props
    const { externalVariables } = options
    const { colorList = '' } = externalVariables
    let options2 = {
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          type: 'shadow',
          textStyle: {
            color: '#fff',
            fontSize: '26'
          },
        },
        formatter: function (params, ticket, callback) {
          let htmlStr = '';
          for (let i = 0; i < params.length; i++) {
            let param = params[i];
            let xName = param.name;//x轴的名称
            let seriesName = param.seriesName;//图例名称
            let value = param.value;//y轴值
            let year = param.data.year

            let color = param.color;//图例颜色
            if (i === 0) {
              htmlStr += xName + '<br/>';//x轴的名称
            }
            htmlStr += '<div style="display:flex;align-items:center">';
            htmlStr += '<span style="margin-right:5px;display:inline-block;width:10px;height:10px;border-radius:5px;background-color:' + color + ';"></span>';//一个点
            htmlStr += '<div style="display:flex;justify-content: space-between;flex:1" >' + '<span>' + year + '__' + seriesName + '：' + '</span>' + '<span>' + `${value || 0}` + '</span>' + '</div>';//圆点后面显示的文本
            htmlStr += '</div>';
          }
          return htmlStr;
        },
      },
      legend: {
        top: '0%',
        right: 'center',
        data: legend,
        textStyle: {
          fontSize: 12,
          color: '#808080'
        },
        icon: 'rect'
      },
      grid: {
        top: 60,
        left: 50,
        bottom: 60,
        right: 60
      },
      color: colorList ? colorList.split('|') : ['#b64235', '#334454', '#6d9ea7'],
      xAxis: [{
        type: 'category',
        // axisTick: {
        //   show: false
        // },
        // axisLine: {
        //   show: false
        // },
        axisLabel: {
          color: '#4D4D4D',
          fontSize: 14,
          margin: 21,
          fontWeight: 'bold'
        },
        data: xAxis,

      }],
      yAxis: [{
        // name: '单位：万',
        nameTextStyle: {
          color: '#808080',
          fontSize: 12,
          padding: [0, 0, 0, -5]
        },
        max: function (value) {
          if (value.max < 5) {
            return 5
          } else {
            return value.max
          }
        },
        type: 'value',
        axisLine: {
          show: true
        },
        axisLabel: {
          color: '#808080',
          fontSize: 12,
          margin: 5
        },
        splitLine: {
          show: false
        },
        axisTick: {
          show: true
        }
      }],
      series: seriesData
    };
    let myChart = echarts.init(this.myRef.current);
    myChart.setOption(options2, { notMerge: true })


  }

  //对比年份change事件
  contrastChange = (e, type) => {
    let { option } = this.state
    let a = {}
    a[type] = e
    let optiond = [...option]
    if (type == 'start') {

      let index = ''
      optiond.forEach((x, i) => {
        if (x.label == e) index = i
      })

      if (index > -1) optiond.splice(index, 1)
      a.optiond = [...optiond]
    }

    this.setState(a, () => {
      let { start, end } = this.state
      let { dataSource } = this.props
      // console.log(start, '=========选择');
      this.dataHandler(dataSource, start, end)
    })
  }
  //年份change事件
  Event_Center_getName() {
    return this.state.id;
  }

  render() {
    const { dataSource, options } = this.props
    const { externalVariables } = options

    const { sechartStyle = ' ' } = externalVariables
    const sechart = css`
   ${sechartStyle}
    `
    const { option, optiond } = this.state
    return (<div div className='analyzer_Echarts' ref={this.twoRef} style={{ height: '100%' }}>
      <div className='select_tow'>
        <div className={`item_select ${sechart}`} style={{ marginRight: '20px' }}>
          <div className='select_tile'>年份：</div>
          <div className='select_item'>  <Select style={{ width: '100%' }} defaultValue={new Date().getFullYear()} onChange={(e) => { this.contrastChange(e, 'start') }} options={option}></Select></div>
        </div>
        <div className={`item_select ${sechart}`}>
          <div className='select_tile'>对比年份：</div>
          <div className='select_item'>
            <Select style={{ width: '100%' }} allowClear options={optiond} onChange={(e) => { this.contrastChange(e, 'end') }} ></Select></div>
        </div>


      </div>


      <div
        className="analyzer-secondary"
        ref={this.myRef}
        style={{ width: this.state.width, height: this.state.height }}
        id={this.state.id}
      >
        main
      </div>
    </div>

    );
  }
}
