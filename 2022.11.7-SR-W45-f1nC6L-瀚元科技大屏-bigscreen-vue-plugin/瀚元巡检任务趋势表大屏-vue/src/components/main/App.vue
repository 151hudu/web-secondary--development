<template>
  <div class="secondary_bigscreen" ref="bigscreen">
    <!-- 左边导航栏 -->
    <div class="alarmt_two">
      <!-- <div class="alarmt_two_left">
        <div class="title_header" v-for="o in 3" :key="o">
          <img src="../../image/navitem.png" height="100%" width="100%" />
          {{ o }}
        </div>
      </div> -->
      <!-- 右边主体内容 -->
      <div class="alarmt_two_right">
        <div class="head_secaher">

          <div class="grid-content bg-purple spacing">所在省份：
            <el-select v-model="provinceSelect" popper-class="two_options" size="small" placeholder="请选择"
              :disabled="Boolean(province)" @change="changeProvince" value-key="province_id">
              <el-option v-for="item, index in provinceOption" :key="index" :label="item.province_name" :value="item">
              </el-option>
            </el-select>
          </div>

          <div class="grid-content bg-purple spacing">所在市：
            <el-select v-model="citySelect" placeholder="请选择" size="small" popper-class="two_options"
              :disabled="Boolean(city)" @change="changeCity" value-key="city_id">
              <el-option v-for="item in cityOption" :key="item.city_id" :label="item.city_name" :value="item">
              </el-option>
            </el-select>
          </div>

          <div class="grid-content bg-purple spacing">站点名称：
            <el-select v-model="stationSelect" placeholder="请选择" size="small" popper-class="two_options"
              :disabled="Boolean(substationName)" @change="changeStation" value-key="substation_no">
              <el-option v-for="item in stationOption" :key="item.substation_no" :label="item.substation_name"
                :value="item"> </el-option>
            </el-select>
          </div>

          <div class="grid-content bg-purple spacing">统计周期：
            <el-select v-model="period" size="small" popper-class="two_options" placeholder="请选择">
              <el-option v-for="item in periodOption" :key="item.value" :label="item.label" :value="item.value">
              </el-option>
            </el-select>
          </div>

          <!-- <div class="grid-content bg-purple spacing">告警状态:<el-select v-model="paramsObj.status" size="mini"
              popper-class="two_options" placeholder="请选择">
            </el-select>
          </div> -->

          <div class="grid-content bg-purple spacing">
            <button class="grid-content_button" @click="searchTable">查询</button>
            <button class="grid-content_button" style="margin-left: 12px" @click="reloadSearch">重置</button>
          </div>

        </div>
        <div class="alarmt_two_main">
          <div class="alarmt_two_main_echart">
            <div class="alarmt_two_main_echart_title border_title">
              巡检任务趋势表（{{ titlePiod }}）
            </div>
            <div class="alarmt_two_main_echart_main" ref="alarmt_echart_top"></div>
            <div class="alarmt_two_main_echart_title border_title" style="margin-top: 20px">
              巡检任务执行率趋势表（{{ titlePiod }}）
            </div>
            <div class="alarmt_two_main_echart_main" ref="alarmt_echart_bot"></div>
          </div>
          <div class="alarmt_two_main_table">
            <div class="alarmt_two_main_table_title  border_title">巡检任务表
              <button class="alarmt_two_main_button" @click="tableToExcel(tableData)">导出</button>
            </div>
            <div ref="alarmt_main" class="alarmt_two_main_table_main">
              <!-- :height="tableHeight" -->
              <el-table :data="tableData" stripe style="width: 100%">
                <el-table-column type="index" width="80" label="序号"> </el-table-column>
                <el-table-column prop="time" label="日期"></el-table-column>
                <el-table-column prop="total" label="任务总次数"></el-table-column>
                <el-table-column prop="Execute" label="任务执行次数"></el-table-column>
                <el-table-column prop="noExecute" label="未执行次数"></el-table-column>
                <el-table-column prop="probability" :formatter="oneFixed" label="任务执行率(%)"></el-table-column>
              </el-table>
              <!-- v-show="period == '月'" -->
              <div class="page_two" style="margin-top:16px">
                <el-pagination popper-class="two_options" background layout="sizes, total, pager, jumper"
                  @size-change="handleSizeChange" @current-change="handleCurrentChange" :page-sizes="[5, 10]"
                  :page-size="pageObj.pageSize" :total="pageObj.total" :current-page="pageObj.currentPage">
                </el-pagination>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import MsgCompConfig from "./msgCompConfig.js";
import moment from "moment";
import Utils from "@/utils/index.js";
import * as echarts from "echarts";
import { Table, TableColumn, DatePicker, Pagination, Row, Col, Select, Option } from "element-ui";
import { pollingTaskTrend, queryDropDownBox } from "../../api/asset";
import Vue from "vue";

const debounce = (func, ms) => {
  let timer;
  return function (...args) {
    if (timer) {
      clearTimeout(timer);
    }
    timer = setTimeout(() => {
      func.apply(this, args);
    }, ms);
  };
}

Vue.use(Table);
Vue.use(TableColumn);
Vue.use(DatePicker);
Vue.use(Pagination);
Vue.use(Row);
Vue.use(Select);
Vue.use(Option);
Vue.use(Col);
export default {
  name: "Main",
  components: {},
  data() {
    return {
      myChart: null,
      myChartTwo: null,
      tableData: [],
      period: "年",
      titlePiod: '年',
      dataAll: [],
      pageObj: { currentPage: 1, pageSize: 10, total: null, period: '年' },
      periodOption: [
        {
          label: "最近一年",
          value: "年"
        },
        {
          label: "最近一月",
          value: "月"
        },
        {
          label: "最近一周",
          value: "周"
        }
      ],
      provinceOption: [],
      provinceData: [],
      provinceSelect: {},
      cityOption: [],
      cityData: [],
      citySelect: {},
      stationOption: [],
      stationData: [],
      stationSelect: {},
      pageSize: 10,
      total: 0,
      pageNo: 1,
      legendData: [],
      ExecuteData: [],
      noExecuteData: [],
      city: '',
      substationName: '',
      province: '',
      probabilityData: [],
      tableHeight: 0
    };
  },
  props: {
    pubSub: Object,
    data: Object | Array,
    componentId: String,
    configuration: Object,
    options: Object,
    updateProcess: Function,
    variable: Object

  },
  computed: {},
  watch: {
    'provinceSelect': {
      handler(val) {

        if (this.provinceData.length == 0) return
        if (!(Boolean(this.province) == false && Boolean(this.city) == false && Boolean(this.substationName) == false)) {
          this.citySelect = {};
          this.cityOption = [];
          this.stationSelect = {};
          this.stationOption = [];

          this.cityData.forEach((item, index) => {
            if (item.province_name == val?.province_name) {
              this.cityOption.push(item);
            }
          });
          this.stationData.forEach((item, index) => {
            if (item.province_name == val?.province_name) {
              this.stationOption.push(item);
            }
          });
        }


        if (!this.city && !this.substationName && this.province) this.searchTable()
      },

      deep: true
    },
    'citySelect': {
      handler(val) {
        if (!(Boolean(this.province) == false && Boolean(this.city) == false && Boolean(this.substationName) == false)) {
          this.stationSelect = {};
          this.stationOption = [];

          this.stationData.forEach((item, index) => {
            if (item.city_name == val?.city_name) {
              this.stationOption.push(item);
            }
          });
        }


        if (this.city && !this.substationName) this.searchTable()
      },

      // immediate: true,
      deep: true
    },
    'stationSelect': {
      handler(val) {
        if (this.substationName) this.searchTable()
      },

      // immediate: true,
      deep: true
    },
  },
  mounted() {

    this.$nextTick(() => {
      this.tableHeight = this.$refs.alarmt_main.offsetHeight;
    })
    queryDropDownBox().then((res) => {
      res.data.forEach((item, index) => {
        if (item.city_name) {
          this.cityOption.push(item);
        }
        if (item.province_name) {
          this.provinceOption.push(item);
        }
        if (item.substation_name) {
          this.stationOption.push(item);
        }
      });
      this.provinceOption = this.removeDuplicateObj(this.provinceOption, 'province_name')
      this.cityOption = this.removeDuplicateObj(this.cityOption, 'city_name')

      this.provinceData = this.provinceOption;
      this.cityData = this.cityOption;
      this.stationData = JSON.parse(JSON.stringify(this.stationOption));

      this.province = this.variable.default_value && JSON.parse(this.variable.default_value).province_id || this.variable.current_value && JSON.parse(this.variable.current_value).province_id || ''
      this.city = this.variable.default_value && JSON.parse(this.variable.default_value).city_id || this.variable.current_value && JSON.parse(this.variable.current_value).city_id || ''
      this.substationName = this.variable.default_value && JSON.parse(this.variable.default_value).substation_no || this.variable.current_value && JSON.parse(this.variable.current_value).substation_no || ''
      let substationOp = {}
      let cityOp = {}
      let provinceOp = {}
      if (this.stationData.length != 0) {
        substationOp = this.stationData.find((x, i) => {
          return x.substation_no == this.substationName
        })
      }
      if (this.cityData.length != 0) {
        cityOp = this.cityData.find((x, i) => {
          return x.city_id == this.city
        })
      }
      if (this.provinceData.length != 0) {
        provinceOp = this.provinceData.find((x, i) => {
          return x.province_id == this.province
        })
      }

      this.stationSelect = substationOp
      this.provinceSelect = provinceOp
      this.citySelect = cityOp
    });
    this.pubSub &&
      this.pubSub.subscribe(
        "updateChart" + this.componentId,
        (data) => {

          this.province = data?.variable?.current_value && JSON.parse(data?.variable?.current_value).province_id || data?.variable?.default_value && JSON.parse(data?.variable?.default_value).province_id || ''
          this.city = data?.variable?.current_value && JSON.parse(data?.variable?.current_value).city_id || data?.variable?.default_value && JSON.parse(data?.variable?.default_value).city_id || ''
          this.substationName = data?.variable?.current_value && JSON.parse(data?.variable?.current_value).substation_no || data?.variable?.default_value && JSON.parse(data?.variable?.default_value).substation_no || ''

          let substationOp = {}
          let cityOp = {}
          let provinceOp = {}

          provinceOp = this.provinceData.find((x, i) => {
            return x.province_id == this.province
          })

          cityOp = this.cityData.find((x, i) => {
            return x.city_id == this.city
          })
          substationOp = this.stationData.find((x, i) => {
            return x.substation_no == this.substationName
          })


          this.stationSelect = substationOp
          this.provinceSelect = provinceOp
          this.citySelect = cityOp

          if (data?.variable?.current_value === '' || data?.variable?.default_value === '') this.searchTable()
        }
      );
    window.componentCenter?.register &&
      window.componentCenter.register(
        this.componentId,
        "comp",
        this,
        MsgCompConfig
      );
    this.updateProcess && this.updateProcess();
    this.searchTable()
  },
  methods: {

    oneFixed(row, column, cellValue, index) {

      let colName = column.label

      // console.log(row, column, cellValue, '=============ds');
      return row.total == 0 ? '--' : Number(cellValue).toFixed(2)
    },
    //去重
    removeDuplicateObj(arr, key) {
      let obj = {};
      arr = arr.reduce((newArr, next) => {
        obj[next[key]] ? "" : (obj[next[key]] = true && newArr.push(next));
        return newArr;
      }, []);
      return arr


    },
    changeProvince(val) {

      this.citySelect = {};
      this.cityOption = [];
      this.stationSelect = {};
      this.stationOption = [];
      this.cityData.forEach((item, index) => {
        if (item.province_name == val.province_name) {
          this.cityOption.push(item);
        }
      });
      this.stationData.forEach((item, index) => {
        if (item.province_name == val.province_name) {
          this.stationOption.push(item);
        }
      });
    },
    changeCity(val) {
      this.stationSelect = {};
      this.stationOption = [];
      this.stationData.forEach((item, index) => {
        if (item.city_name == val.city_name) {
          this.stationOption.push(item);
        }
      });
    },
    changeStation(val) { },
    searchTable() {
      let message = {
        province: this.provinceSelect?.province_id || this.province || "", //省
        city: this.citySelect?.city_id || this.city || "", //市
        substationName: this.stationSelect?.substation_name || this.substationName || "", //电站名称
        period: this.period,
        // pageSize: this.pageSize || "", //页面数据条数  数字
        // pageNo: this.pageNo || "", //页码  数字
      };
      this.titlePiod = this.period
      this.newLineChart(message)
    },
    reloadSearch() {
      if (!this.province) this.provinceSelect = {};
      if (!this.city) this.citySelect = {};
      if (!this.substationName) this.stationSelect = {};
      if (!this.province) {
        this.provinceOption = this.provinceData;
        this.cityOption = this.cityData;
        this.stationOption = this.stationData;
      }

      this.period = "年";
      // let message = {
      //   province: this.provinceSelect.province_id || "", //省
      //   city: this.citySelect.city_id || "", //市
      //   substationName: this.stationSelect.substation_name || "", //电站名称
      //   period: this.period,
      // };
      // this.newLineChart(message)
      this.searchTable()
    },
    newLineChart(message) {
      pollingTaskTrend(message).then((res) => {
        console.log(res.data);
        let dateStr = "";
        let echartStr = "";
        let unitStr = "";
        const xinqiZ = {
          Mo: '周一',
          Tu: '周二',
          We: '周三',
          Th: '周四',
          Fr: '周五',
          Sa: '周六',
          Su: '周日',
        }
        let chuli = null
        switch (this.period) {
          case "年":
            dateStr = "YYYY-MM";
            chuli = (val) => Number(moment(val).format('MM')) + '月'
            break;
          case "月":
            dateStr = "YYYY-MM-DD";
            chuli = (val) => Number(moment(val).format('DD')) + '日'
            break;
          case "周":
            dateStr = "YYYY-MM-DD";
            chuli = (val) => xinqiZ[moment(val).format('dd')]
            break;
          default:
            chuli = (val) => Number(moment(val).format('MM')) + '月'

            break;
        }
        this.dataAll = res.data.map(x => {
          x.time = moment(x.time).format(dateStr)
          return x;
        })
        this.pageObj.currentPage = 1
        this.tableData = this.dataAll.slice(0, this.pageObj.currentPage * this.pageObj.pageSize)
        this.pageObj.total = this.dataAll.length
        this.total = res.data.length;
        this.legendData = [];
        this.ExecuteData = [];
        this.noExecuteData = [];
        this.probabilityData = [];
        this.dataAll.forEach(x => {
          this.legendData.push(chuli(x.time))
          this.ExecuteData.push(x.Execute)
          this.noExecuteData.push(x.noExecute)
          this.probabilityData.push({ value: x.probability, total: x.total })
        })
        this.initEchartFn()
        this.initEchartFnTwo()
      });
    },
    tableToExcel(tableData) {
      const headArr = ['time', 'total', 'Execute', 'noExecute', 'probability']
      const titleObj = { time: '日期', total: '任务总次数', Execute: '任务执行次数', noExecute: '未执行次数', probability: '任务执行率(%)' }
      // 要导出的json数据
      // 列标题
      let aTime = { 年: 'YYYY.MM', 月: 'YYYY.MM.DD', 周: 'YYYY.MM.DD' }
      let st1 = aTime[this.titlePiod]

      let tableData2 = JSON.parse(JSON.stringify(tableData))
      tableData2.forEach((x, i) => {
        x.time = x.time ? moment(x.time).format(st1) : ''
      })
      let str = "<tr>"
      headArr.forEach((item, index) => {

        str += (index == (headArr.length - 1)) ? `<td>${titleObj[item]}</td></tr>` : `<td>${titleObj[item]}</td>`

      })
      // 循环遍历，每行加入tr标签，每个单元格加td标签
      for (let i = 0; i < tableData2.length; i++) {
        str += '<tr>';
        for (const key of headArr) {
          // 增加\t为了不让表格显示科学计数法或者其他格式
          if (key == 'probability') {
            str += `<td>${(tableData2[i].total == 0 ? '--' : tableData2[i][key]) + '\t'}</td>`;
          } else {


            str += `<td>${tableData2[i][key] + '\t'}</td>`;
          }
          // str += `<td>${tableData[i][key] + '\t'}</td>`;
        }
        str += '</tr>';
      }
      // Worksheet名
      const worksheet = 'Sheet1'
      const uri = 'data:application/vnd.ms-excel;base64,';

      // 下载的表格模板数据
      const template = `<html
             xmlns:o="urn:schemas-microsoft-com:office:office" 
             xmlns:x="urn:schemas-microsoft-com:office:excel"
        xmlns="http://www.w3.org/TR/REC-html40">
      <head> <!--[if gte mso 9]><xml><x:ExcelWorkbook><x:ExcelWorksheets><x:ExcelWorksheet>
          <x:Name>${worksheet}</x:Name>
          <x:WorksheetOptions><x:DisplayGridlines/></x:WorksheetOptions></x:ExcelWorksheet>
          </x:ExcelWorksheets></x:ExcelWorkbook></xml><![endif]--> </head>
    <body><table style="vnd.ms-excel.numberformat:@" >${str}</table></body>
      </html>`;
      // 下载模板
      const base64 = function (s) {
        return window.btoa(unescape(encodeURIComponent(s)));
      };
      const format = function (s, c) {
        return s.replace(/{(\w+)}/g, function (m, p) {
          return c[p];
        });
      };
      const a = document.createElement("a");
      a.href = uri + base64(format(template));
      a.download = "巡检任务趋势表" + ".xls";
      a.click();
      // 输出base64编码
      // const base64 = s => window.btoa(unescape(encodeURIComponent(s)));
      // window.location.href = uri + base64(template);
    },
    // handleSizeChange(val) {
    //   console.log(`每页 ${val} 条`);
    // },
    handleCurrentChange(val) {
      console.log(`当前页: ${val}`);
    },
    //改变页尺寸
    handleSizeChange(val) {
      this.pagingHandler(this.pageObj.currentPage, val)
      this.pageObj.pageSize = val
    },
    //改变页数
    handleCurrentChange(val) {
      this.pagingHandler(val, this.pageObj.pageSize)
      this.pageObj.currentPage = val
    },
    //分页
    pagingHandler(pageNum, pageSize) {
      this.tableData = this.dataAll.slice((pageNum - 1) * pageSize, (pageNum - 1) * pageSize + pageSize)
      // this.initEchartFn(this.tableData)
    },
    initEchartFn() {
      if (this.myChart !== null && this.myChart !== "" && this.myChart !== undefined) {
        this.myChart.dispose();//销毁
      }
      let chartDom = this.$refs.alarmt_echart_top;
      this.myChart = echarts.init(chartDom);
      let option = {
        color: ['rgba(112, 173, 71, 1)', 'rgba(255, 0, 0, 0.8)'],
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            lineStyle: {
              type: "dotted",
              width: 1
            }
          }
        },
        legend: {
          bottom: 10,
          icon: "rect",
          itemWidth: 14,
          itemHeight: 14,
          textStyle: {
            color: "#D0DEEE",
            padding: [4, 0, 0, 0],
            lineHeight: 14
          },
          // data: ['Line 1', 'Line 2', 'Line 3', 'Line 4', 'Line 5']
        },
        grid: {
          left: '3%',
          right: '5%',
          top: '10%',
          bottom: "16%",
          containLabel: true
        },
        xAxis: [
          {
            type: 'category',
            boundaryGap: false,
            axisLine: {
              show: false
            },
            axisTick: {
              show: false
            },
            axisLabel: {
              color: "#D0DEEE",
              // rotate: this.period == "月" ? 60 : 0,
              // interval: 0
            },
            // data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
            data: this.legendData
          }
        ],
        yAxis: [
          {
            type: 'value',
            splitLine: {
              show: true,
              lineStyle: {
                type: "dashed",
                color: "#5A5A89"
              }
            },
            axisLine: {
              show: false
            },
            axisTick: {
              show: false
            },
            axisLabel: {
              color: "#D0DEEE"
            }
          }
        ],
        series: [
          {
            name: '任务执行次数',
            type: 'line',
            smooth: true,
            showSymbol: false,
            lineStyle: {
              width: 4,
              color: "rgba(112, 173, 71, 1)"
            },
            areaStyle: {
              opacity: 0.6,
              color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                {
                  offset: 0,
                  color: 'rgba(112, 173, 71, 1)'
                },
                {
                  offset: 0.8,
                  color: 'rgba(112, 173, 71, 0)'
                }
              ])
            },
            // data: [140, 232, 101, 264, 90, 340, 250]
            data: this.ExecuteData
          },
          {
            name: '未执行次数',
            type: 'line',
            smooth: true,
            lineStyle: {
              width: 4,
              color: "rgba(255, 0, 0, 0.8)"
            },
            showSymbol: false,
            areaStyle: {
              opacity: 0.6,
              color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                {
                  offset: 0,
                  color: 'rgba(255, 0, 0, 0.8)'
                },
                {
                  offset: 1,
                  color: 'rgba(255, 0, 0, 0)'
                }
              ])
            },
            // data: [120, 282, 111, 234, 220, 340, 310]
            data: this.noExecuteData
          }
        ]
      };

      option && this.myChart.setOption(option);
      // const task = () => {
      //   this.myChart.resize();
      // };
      // window.addEventListener("resize", debounce(task, 300));
    },
    initEchartFnTwo() {
      if (this.myChartTwo !== null && this.myChartTwo !== "" && this.myChartTwo !== undefined) {
        this.myChartTwo.dispose();//销毁
      }
      let chartDom = this.$refs.alarmt_echart_bot;
      this.myChartTwo = echarts.init(chartDom);
      let option = {
        color: ['rgba(77, 184, 247, 1)'],
        tooltip: {
          trigger: 'axis',
          formatter: function (params) {
            let htmlStr = '';
            for (let i = 0; i < params.length; i++) {
              let param = params[i];
              let xName = param.name;//x轴的名称
              let seriesName = param.seriesName;//图例名称

              let value = (param.data.total == undefined || param.data.total == 0) ? '--' : Number(param.value).toFixed(2);//y轴值
              let year = param.data.year

              let color = param.color;//图例颜色
              if (i === 0) {
                htmlStr += xName + '<br/>';//x轴的名称
              }
              htmlStr += '<div style="display:flex;align-items:center">';
              htmlStr += '<span style="margin-right:5px;display:inline-block;width:10px;height:10px;border-radius:5px;background-color:' + color + ';"></span>';//一个点
              htmlStr += '<div style="display:flex;justify-content: space-between;flex:1" >' + '<span>' + seriesName + '：' + '</span>' + '<span>' + `${value || 0}` + '</span>' + '</div>';//圆点后面显示的文本
              htmlStr += '</div>';
            }
            return htmlStr;

          }
        },
        legend: {
          show: false
        },
        grid: {
          left: '3%',
          right: '5%',
          top: '10%',
          bottom: "5%",
          containLabel: true
        },
        xAxis: [
          {
            type: 'category',
            boundaryGap: false,
            axisLine: {
              show: false
            },
            axisTick: {
              show: false
            },
            axisLabel: {
              color: "#D0DEEE",
              // rotate: this.period == "月" ? 60 : 0,
              // interval: 0
            },
            // data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
            data: this.legendData
          }
        ],
        yAxis: [
          {
            type: 'value',
            splitLine: {
              show: true,
              lineStyle: {
                type: "dashed",
                color: "#5A5A89"
              }
            },
            axisLine: {
              show: false
            },
            axisTick: {
              show: false
            },
            axisLabel: {
              color: "#D0DEEE"
            }
          }
        ],
        series: [
          {
            name: '任务执行率',
            type: 'line',
            smooth: true,
            showSymbol: false,
            lineStyle: {
              width: 4,
              color: "rgba(112, 173, 71, 1)"
            },
            areaStyle: {
              opacity: 0.6,
              color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                {
                  offset: 0,
                  color: 'rgba(112, 173, 71, 1)'
                },
                {
                  offset: 0.8,
                  color: 'rgba(112, 173, 71, 0)'
                }
              ])
            },
            // data: [140, 232, 101, 264, 90, 340, 250]
            data: this.probabilityData
          }
        ]
      };

      option && this.myChartTwo.setOption(option);
      // const tasks = () => {
      //   this.myChartTwo.resize();
      // };
      // window.addEventListener("resize", debounce(tasks, 300));
    },
    do_EventCenter_setValue(value) {
      this.myChart.resize();
      this.myChartTwo.resize();

    },
    Event_Center_getName() {
      return this.id;
    }
  }
};

</script>

<style lang="less" scoped>
.secondary_bigscreen {
  width: 100%;
  height: 100%;

  .alarmt_two {
    width: 100%;
    height: 100%;
    display: flex;
    background: linear-gradient(180deg, #083957 0%, #091827 100%);
    justify-content: space-between;

    // padding: 4px;
    // &_left {
    //   width: 20%;
    //   height: 100%;
    //   border: 1px solid transparent;
    //   border-image: linear-gradient(104.04deg, rgba(20, 143, 255, 0.99) 0%, #00FFF7 100%) 1;
    //   padding: 8px;
    //   box-sizing: border-box;
    //   .title_header {
    //     // position: relative;
    //     width: 100%;
    //     text-align: center;
    //     height: 12%;
    //     background-image: url('../../image/navitem.png');
    //     background-repeat: no-repeat;
    //     background-size: 100% 100%;
    //     line-height: 48px;
    //     color: #fff;
    //     span {
    //       // position: absolute;
    //       color: #fff;
    //       // top: 50%;
    //       // left: 50%;
    //     }
    //   }
    // }
    &_right {
      margin: 4px;
      width: 100%;
      height: calc(100% - 8px);
      border: 1px solid transparent;
      padding: 40px;
      box-sizing: border-box;
      border-image: linear-gradient(104.04deg, rgba(20, 143, 255, 0.99) 0%, #00FFF7 100%) 1;
      display: flex;
      flex-direction: column;

      // justify-content: space-around;
      .head_secaher {
        // background-color: red;
        display: flex;
        font-size: 12px;
        color: #D0DEEE;

        .spacing {
          margin-right: 16px;
        }

        /deep/.el-input__inner {
          background: linear-gradient(180deg, rgba(8, 57, 87, 0.7) 0%, rgba(9, 24, 39, 0.7) 100%);
          border: 1px solid rgba(21, 154, 255, 0.7);
          border-radius: 3px;
          color: #99AFCC;
        }

        /deep/.is-disabled .el-input__inner {
          color: #666666;

        }

        /deep/ .is-disabled .el-input__inner::-webkit-input-placeholder {
          color: #666666;
        }

        /deep/.el-select {
          width: 120px;
          background: linear-gradient(180deg, rgba(8, 57, 87, 0.7) 0%, rgba(9, 24, 39, 0.7) 100%);
          border-radius: 3px;
        }

        .grid-content_button {
          border: 1px solid;
          background: linear-gradient(174.13deg, rgba(20, 143, 255, 0.3) 25.38%, rgba(21, 246, 238, 0.5) 94.06%);
          border-image: linear-gradient(135.84deg, #2CDFE8 0%, #1A9AD9 101.5%) 1;
          color: #FFFFFF;
          width: 80px;
          height: 32px;
          letter-spacing: 5px;
        }
      }

      .alarmt_two_main {
        display: flex;
        margin-top: 44px;
        height: calc(100% - 78px);
        justify-content: space-between;

        .alarmt_two_main_echart {
          width: 40%;
        }

        .alarmt_two_main_table {
          width: calc(60% - 40px);
          height: calc(100% - 52px);

          .alarmt_two_main_table_main {
            height: 100%;
            // overflow-y: auto;
          }
        }

        .border_title {
          border-bottom: 2px solid;
          background-image: url('../../image/xline.png');
          background-repeat: no-repeat;
          padding-left: 60px;
          padding-bottom: 20px;
          line-height: 18px;
          color: #fff;
          border-image: linear-gradient(104.04deg, rgba(20, 143, 255, 0.99) 0%, #00FFF7 100%) 1;
        }

        &_echart {
          width: 49%;
          color: #fff;
          display: flex;
          flex-direction: column;
          justify-content: space-between;

          &_title {}

          &_main {
            margin-top: 10px;
            flex: 1;
            border: 1px solid;
            border-image: linear-gradient(104.04deg, rgba(20, 143, 255, 0.99) 0%, #00FFF7 100%) 1;
          }
        }

        &_table {
          &_title {
            display: flex;
            justify-content: space-between;
            padding-bottom: 14px !important;

            .alarmt_two_main_button {
              background: linear-gradient(178.39deg, #148FFF 1.01%, #5BDEDA 98.25%),
                linear-gradient(135.84deg, #2CDFE8 0%, #1A9AD9 101.5%);
              color: #fff;
              border: 1px solid;
              width: 85.79px;
              height: 32px;
              letter-spacing: 5px;
              border-image: linear-gradient(135.84deg, #2CDFE8 0%, #1A9AD9 101.5%) 1;
              margin-top: -8px;
            }
          }

          &_main {
            padding-top: 10px;

            .page_two {
              margin-top: 16px;
              display: flex;
              justify-content: flex-end;

              /deep/.el-pagination__total {
                color: #D0DEEE;
                font-weight: 400;
                font-size: 12px;
              }

              /deep/.el-input__inner {
                background: linear-gradient(180deg, #147570 0%, rgba(8, 57, 87, 0.7) 25.12%, rgba(8, 57, 87, 0.0001) 49.98%, rgba(8, 57, 87, 0.7) 73.41%, #005954 100%);
                border: 1px solid rgba(21, 154, 255, 0.6);
                border-radius: 2px;
                color: #D0DEEE;
                font-weight: 400;
                font-size: 12px;
              }

              /deep/.el-pagination.is-background .el-pager li:not(.disabled).active {
                background: linear-gradient(180deg, rgba(21, 246, 238, 0.5) 0%, rgba(21, 154, 255, 0.5) 25.12%, rgba(21, 154, 255, 0.2) 49.98%, rgba(21, 154, 255, 0.5) 73.41%, rgba(21, 246, 238, 0.5) 100%);
                border: 1px solid rgba(35, 163, 255, 0.6);
              }

              /deep/ .el-pagination.is-background .el-pager li {
                background: linear-gradient(180deg, #147570 0%, rgba(8, 57, 87, 0.7) 25.12%, rgba(8, 57, 87, 0.0001) 49.98%, rgba(8, 57, 87, 0.7) 73.41%, #005954 100%);
                border: 1px solid rgba(21, 154, 255, 0.6);
                border-radius: 2px;
                color: #D0DEEE;
                font-weight: 400;
                font-size: 12px;
              }

              /deep/.el-pagination__jump {
                color: #D0DEEE;
                font-weight: 400;
                font-size: 12px;
              }
            }

            /deep/.el-table__body,
            .el-table__footer,
            .el-table__header {
              border-collapse: collapse;
            }

            /deep/.el-table,
            .el-table__expanded-cell {
              background-color: transparent;
            }

            /deep/.el-table th.el-table__cell {
              background: transparent;
              color: #fff;
            }

            /deep/.el-table thead {
              background: linear-gradient(0deg, #245879 0%, #2f6a8f 100%);
            }

            /deep/ td.el-table__cell {
              border: none;
            }

            /deep/ th.el-table__cell {
              border: none;
            }

            /deep/ .el-table::before {
              left: 0;
              bottom: 0;
              width: 100%;
              height: 0;
            }

            /deep/.el-table--enable-row-hover .el-table__body tr:hover>td.el-table__cell {
              background-color: transparent;
            }

            /deep/.el-table tr {
              background-color: transparent;
              color: #fff;
            }

            /deep/.el-table--striped .el-table__body tr.el-table__row--striped td.el-table__cell {
              background: transparent;
              color: #fff;
            }

            /deep/.el-table__body-wrapper .el-table__row--striped {
              background: linear-gradient(270deg, rgba(91, 222, 218, 0.18) 50%, rgba(3, 23, 34, 0.3) 100%);
              border: 1px solid linear-gradient(149.38deg, #4192D9 3.25%, rgba(65, 146, 217, 0.0001) 88.08%);
              border-image: linear-gradient(149.38deg, #4192D9 3.25%, rgba(65, 146, 217, 0.0001) 88.08%) 1;
              // border-image-source: linear-gradient(149.38deg, #4192D9 3.25%, rgba(65, 146, 217, 0.0001) 88.08%);
            }
          }
        }
      }
    }
  }
}

/deep/.two_options {
  background-color: transparent;
  border: 1px solid rgba(21, 154, 255, 0.7)
}
</style>