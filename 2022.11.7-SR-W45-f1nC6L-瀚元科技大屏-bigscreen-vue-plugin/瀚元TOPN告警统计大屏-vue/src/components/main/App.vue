<template>
  <div class="secondary_bigscreen" :style="{
    width: '100%',
    height: '100%',
  }" ref="bigscreen" :id="id">
    <!-- 左边导航栏 -->
    <div class="alarmt_two">
      <!-- <div class="alarmt_two_left">
        <div class="title_header" v-for="o in 3" :key="o">
        
          {{ o }}
        </div>
      </div> -->
      <!-- 右边主体内容 -->
      <div class="alarmt_two_right">
        <div class="head_secaher">

          <div class="grid-content bg-purple">所在省份：<el-select v-model="paramsObj.province" :popper-append-to-body="true"
              popper-class="two_options" size="small" placeholder="请选择" :disabled="Boolean(province)"
              @change="(e) => { selectProFn('province', e) }">
              <el-option v-for="item in provinceOp" :key="item.value" :label="item.label" :value="item.value">
              </el-option>
            </el-select>
          </div>

          <div class="grid-content bg-purple">所在市： <el-select v-model="paramsObj.city" size="small"
              popper-class="two_options" placeholder="请选择" :disabled="Boolean(city)"
              @change="(e) => { selectProFn('city', e) }">
              <el-option v-for="item in cityOp" :key="item.value" :label="item.label" :value="item.value">
              </el-option>
            </el-select>
          </div>

          <div class="grid-content bg-purple">站点名称： <el-select v-model="paramsObj.substationName" size="small"
              popper-class="two_options" placeholder="请选择" :disabled="Boolean(substationName)">
              <el-option v-for="item in substationOp" :key="item.value" :label="item.label" :value="item.value">
              </el-option>
            </el-select>
          </div>
          <div class="grid-content bg-purple">TOP： <el-select v-model="paramsObj.top" size="small"
              popper-class="two_options" placeholder="请选择">
              <el-option v-for="item in  TopOP" :key="item.value" :label="item.label" :value="item.value">
              </el-option>
            </el-select>
          </div>


          <div class="grid-content bg-purple">统计周期： <el-select v-model="paramsObj.period" size="small"
              popper-class="two_options" placeholder="请选择">
              <el-option v-for="item in cycleOp" :key="item.value" :label="item.label" :value="item.value">
              </el-option>
            </el-select>
          </div>

          <div class="grid-content bg-purple">告警状态： <el-select v-model="paramsObj.status" size="small"
              popper-class="two_options" placeholder="请选择">
              <el-option v-for="item in alarmOp" :key="item.value" :label="item.label" :value="item.value">
              </el-option>
            </el-select>
          </div>

          <div class="grid-content bg-purple">
            <button class="grid-content_button" @click="queryTable">查询 </button>
            <button class="grid-content_button" :style="{ marginLeft: '6px' }" @click="restFn">重置</button>
          </div>

        </div>
        <div class="alarmt_two_main">
          <div class="alarmt_two_main_echart">
            <div class="alarmt_two_main_echart_title border_title">
              TOP{{ titleTop || 10 }} 告警统计表
            </div>
            <div class="alarmt_two_main_echart_main" ref="alarmt_echart"></div>
          </div>
          <div class="alarmt_two_main_table">
            <div class="alarmt_two_main_table_title  border_title">告警信息
              <button class="alarmt_two_main_button" @click="tableToExcel(tableData)">导出 </button>
            </div>
            <div class="alarmt_two_main_table_main">
              <el-table :data="tableData" style="width: 100%" stripe>
                <el-table-column type="index" label="序号" align="center"> </el-table-column>
                <el-table-column prop="alarm_level" label="告警级别" align="center">
                  <template slot-scope="scope">
                    <div :style='`color:${colorAlartm(scope.row.description)}`'>
                      • {{ scope.row.description }}
                    </div>
                  </template>
                </el-table-column>
                <el-table-column prop="alarm_name" label="告警名称" min-width="120">

                </el-table-column>
                <el-table-column prop="alarmNum" label="告警次数" align="center">

                </el-table-column>
                <el-table-column prop="alarm_src" label="告警源" min-width="120">

                </el-table-column>
                <el-table-column prop="firstAlarm" label="首次发生时间" min-width="136">

                </el-table-column>
                <el-table-column prop="lastAlarm" label="最后发生时间" min-width="136">
                </el-table-column>
              </el-table>
              <div class="page_two" v-if="pageState">
                <el-pagination background layout="total, pager, jumper" :page-size="4" :total="12">
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
import { TOPNAlarmInfo, queryDropDownBox } from "../../api/asset";
import Vue from "vue";
Vue.prototype.$echarts = echarts;
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
      id: "",
      tableData: [

      ],
      pageState: false,
      value: '',
      provinceOp: [],
      TopOP: [{
        label: '5', value: 5
      }, {
        label: '10', value: 10
      }],
      titleTop: 10,
      cityOp: [],
      substationOp: [],
      cycleOp: [{ value: 1, label: '一个月' },
      { value: 3, label: '三个月' },
      { value: 6, label: '半年' }
      ],
      alarmOp: [
        { value: true, label: '已消除' },
        { value: false, label: '未消除' },

      ],
      totalArr: {},
      Gechart: null,
      city: '',
      substationName: '',
      province: '',
      paramsObj: { province: '', city: '', substationName: '', period: 6, status: '', top: '10' }
    };
  },
  props: {
    pubSub: Object,
    data: Object | Array,
    componentId: String,
    configuration: Object,
    options: Object,
    variable: Object

  },
  computed: {
    colorAlartm() {
      return (data) => {

        let colorFont = ''
        switch (data) {
          case '紧急':
            colorFont = '#F95757'
            break;
          case '重要':
            colorFont = '#FF9E75'
            break;
          case '一般':
            colorFont = '#FFD03B'
            break;
          case '提示':
            colorFont = '#30D994'
            break;
          default:
            break;
        }
        return colorFont
      }



    },
    nameAlartm() {
      return (data) => {
        let colorName = ''
        switch (data) {
          case 1:
            colorName = '紧急'
            break;
          case 2:
            colorName = '重要'
            break;
          case 3:
            colorName = '一般'
            break;
          case 4:
            colorName = '提示'
            break;
          default:
            break;
        }
        return colorName
      }
    }
  },
  watch: {
    'paramsObj.province': {
      handler(val) {
        if (!this.totalArr.substationOp) return

        let substationOp = this.totalArr.substationOp
        this.substationOp = substationOp.filter((x, i) => {

          let filed = String(x.id)
          let strl = filed.length

          return filed.substr(0, 2) == val
        })

        let cityOp = this.totalArr.cityOp
        this.cityOp = cityOp.filter((x, i) => {

          let filed = String(x.value)
          let strl = filed.length

          return filed.substr(0, strl - 2) == val
        })
        if (!this.city && !this.substationName && this.province) this.queryTable()
      },

      // immediate: true,
      deep: true
    },
    'paramsObj.city': {
      handler(val) {
        if (!this.totalArr.substationOp) return

        let substationOp = this.totalArr.substationOp
        this.substationOp = substationOp.filter((x, i) => {
          let filed = String(x.id)
          let l = x.statno.length
          let strl = filed.length

          return filed.substr(0, strl - l) == val
        })
        if (this.city && !this.substationName) this.queryTable()
      },

      // immediate: true,
      deep: true
    },
    'paramsObj.substationName': {
      handler(val) {
        if (this.substationName) this.queryTable()
      },

      // immediate: true,
      deep: true
    },
  },
  mounted() {



    this.pubSub &&
      this.pubSub.subscribe(
        "updateChart" + this.componentId,
        (data) => {
          this.province = data?.variable?.current_value && JSON.parse(data?.variable?.current_value).province_id || data?.variable?.default_value && JSON.parse(data?.variable?.default_value).province_id || ''
          this.city = data?.variable?.current_value && JSON.parse(data?.variable?.current_value).city_id || data?.variable?.default_value && JSON.parse(data?.variable?.default_value).city_id || ''
          this.substationName = data?.variable?.current_value && JSON.parse(data?.variable?.current_value).substation_no || data?.variable?.default_value && JSON.parse(data?.variable?.default_value).substation_no || ''
          this.paramsObj.province = this.province == '' ? '' : Number(this.province)
          this.paramsObj.city = this.city == '' ? '' : Number(this.city)
          let substationOp = {}
          let provinceOp = {}
          let cityOp = {}
          if (this.totalArr.substationOp) {
            substationOp = this.totalArr.substationOp.find((x, i) => {
              return x.statno == this.substationName
            })
          }
          if (this.totalArr.provinceOp) {
            provinceOp = this.totalArr.provinceOp.find((x, i) => {
              return x.value == this.province
            })
          }
          if (this.totalArr.cityOp) {
            cityOp = this.totalArr.cityOp.find((x, i) => {
              return x.value == this.city
            })
          }

          this.paramsObj.substationName = substationOp?.value
          this.paramsObj.province = provinceOp?.value
          this.paramsObj.city = cityOp?.value

          if (data?.variable?.current_value === '' || data?.variable?.default_value === '') this.queryTable()
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
    // let id = this.options?.externalVariables?.id;
    // this.id = id ? `secondary_analyzer_${id}` : `secondary_bigscreen_${Utils.generateUUID()}`;
    this.queryTable()
    this.querySelect()

    // this.initEchartFn(this.tableData)
  },
  methods: {
    dateHandler(row, column, cellValue, index) {
      return moment(cellValue).format("YYYY-MM-DD hh:mm:ss")
    },
    colorAlartmFn(data) {

      let colorFont = ''
      switch (data) {
        case 1:
          colorFont = '#F95757'
          break;
        case 2:
          colorFont = '#FF9E75'
          break;
        case 3:
          colorFont = '#FFD03B'
          break;
        case 4:
          colorFont = '#30D994'
          break;
        default:
          break;
      }
      return colorFont
    },
    queryTable() { //请求接口数据
      let params = { ... this.paramsObj }
      params.province = this.paramsObj.province || this.province
      params.city = this.paramsObj.city || this.city
      params.substationName = this.paramsObj.substationName || this.substationName
      params.top = this.paramsObj.top || 10
      this.titleTop = this.paramsObj.top
      TOPNAlarmInfo(params).then(res => {
        this.tableData = res.data
        this.tableData.forEach(x => {
          x.firstAlarm = moment(x.firstAlarm).format("YYYY-MM-DD hh:mm:ss")
          x.lastAlarm = moment(x.lastAlarm).format("YYYY-MM-DD hh:mm:ss")
        })
        this.tableData.sort(function (a, b) {
          return b.alarmNum - a.alarmNum
        })
        this.initEchartFn(this.tableData)
      }).catch(err => {
        console.log(err);
      })


    },
    //下拉菜单数据
    querySelect() {
      queryDropDownBox().then(res => {

        let tempTotal = res.data
        let objArr = { provinceOp: [], cityOp: [], substationOp: [] }
        tempTotal.forEach((x, i) => {
          objArr.provinceOp.push({ label: x.province_name, value: x.province_id })
          objArr.cityOp.push({ label: x.city_name, value: x.city_id })
          objArr.substationOp.push({ label: x.substation_name, value: x.substation_name, id: x.concat, statno: x.substation_no })
        })

        objArr.provinceOp = this.removeDuplicateObj(objArr.provinceOp, 'value')
        objArr.cityOp = this.removeDuplicateObj(objArr.cityOp, 'value')
        objArr.substationOp = this.removeDuplicateObj(objArr.substationOp, 'id')
        this.totalArr = objArr
        for (const key in objArr) {
          this[key] = objArr[key]
        }


        this.province = this.variable?.default_value && JSON.parse(this.variable?.default_value).province_id || this.variable?.current_value && JSON.parse(this.variable?.current_value).province_id || ''
        this.city = this.variable?.default_value && JSON.parse(this.variable?.default_value).city_id || this.variable?.current_value && JSON.parse(this.variable?.current_value).city_id || ''
        this.substationName = this.variable?.default_value && JSON.parse(this.variable?.default_value).substation_no || this.variable?.current_value && JSON.parse(this.variable?.current_value).substation_no || ''
        this.paramsObj.province = this.province == '' ? '' : Number(this.province)
        this.paramsObj.city = this.city == '' ? '' : Number(this.city)
        let substationOp = {}
        let provinceOp = {}
        let cityOp = {}
        if (this.totalArr.substationOp) {
          substationOp = this.totalArr.substationOp.find((x, i) => {
            return x.statno == this.substationName
          })
        }
        if (this.totalArr.provinceOp) {
          provinceOp = this.totalArr.provinceOp.find((x, i) => {
            return x.value == this.province
          })
        }
        if (this.totalArr.cityOp) {
          cityOp = this.totalArr.cityOp.find((x, i) => {
            return x.value == this.city
          })
        }

        this.paramsObj.substationName = substationOp?.value
        this.paramsObj.province = provinceOp?.value
        this.paramsObj.city = cityOp?.value
      }).catch(err => {
        console.log(err);
      })
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
    selectProFn(value, e) {
      if (value == 'city') {
        let substationOp = this.totalArr.substationOp
        this.substationOp = substationOp.filter((x, i) => {
          let filed = String(x.id)
          let l = x.statno.length
          let strl = filed.length

          return filed.substr(0, strl - l) == e
        })
        return
      }

      let substationOp = this.totalArr.substationOp
      this.substationOp = substationOp.filter((x, i) => {

        let filed = String(x.id)
        let strl = filed.length

        return filed.substr(0, 2) == e
      })

      let cityOp = this.totalArr.cityOp
      this.cityOp = cityOp.filter((x, i) => {

        let filed = String(x.value)
        let strl = filed.length

        return filed.substr(0, strl - 2) == e
      })


    },
    //渲染图表
    initEchartFn(data) {
      let interval = this.paramsObj.top == 10 || !this.paramsObj.top ? 'auto' : 0
      let xAData = []
      let echart = data.map((x, i) => {
        xAData.push({
          value: x.alarm_name, textStyle: {

            color: '#D0DEEE'
          }
        })
        return { name: x.alarm_name, value: x.alarmNum }
      })

      let options = {
        tooltip: {
          trigger: 'axis'
        },
        xAxis: [
          {
            type: 'category',
            data: xAData,
            axisTick: {
              show: false,
              interval: 0,

            },
            axisLabel: {
              interval: 0,
              rotate: 20
            },
            axisLine: {
              show: false,

              lineStyle: {
                color: '#D0DEEE',
                width: 1,
              }
            },

          },

        ],
        yAxis: [
          {
            type: 'value',
            axisLabel: {
              color: '#D0DEEE',
              formatter: '{value} 次'
            },
            axisLine: {
              show: false,
              lineStyle: {
                color: '#D0DEEE',
                type: 'solid',
                width: 1,
              },

            },
            axisTick: {
              show: false
            },

            // 修改y轴分割线
            splitLine: {
              lineStyle: {
                color: '#D0DEEE',
                type: 'dashed',
              },
            },
          },
        ],
        series: [{
          type: 'bar',
          barWidth: 35,

          itemStyle: {
            color: new echarts.graphic.LinearGradient(0, 0, 1, 1, [
              {
                offset: 0,
                color: '#FF6969',
              },
              {
                offset: 0.21,
                color: '#0EEAE4',
              },
              {
                offset: 0.9,
                color: '#0695E7',
              },
            ])
          },
          data: echart
        }]
      }

      this.Gechart = echarts.init(this.$refs.alarmt_echart);
      this.Gechart.setOption(options);
      const task = () => {
        this.Gechart.resize();
      };
      window.addEventListener("resize", debounce(task, 300));
    },
    //重置
    tableToExcel(tableData) {
      const headArr = Object.keys(tableData[0])

      const titleObj = { description: '告警级别', alarm_name: '告警名称', alarmNum: '告警次数', alarm_src: '告警源', firstAlarm: '首次发生时间', lastAlarm: '最后发生时间' }
      const head = Object.keys(titleObj)
      // 要导出的json数据
      // 列标题
      let str = "<tr>"
      head.forEach((item, index) => {

        str += (index == (head.length - 1)) ? `<td>${titleObj[item]}</td></tr>` : `<td>${titleObj[item]}</td>`

      })
      // 循环遍历，每行加入tr标签，每个单元格加td标签
      for (let i = 0; i < tableData.length; i++) {
        str += '<tr>';
        for (const key of head) {
          // 增加\t为了不让表格显示科学计数法或者其他格式
          str += `<td>${tableData[i][key] || '' + '\t'}</td>`;
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
    <body><table>${str}</table></body>
      </html>`;
      // 下载模板

      // 输出base64编码
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
      a.download = "TOPN告警统计表" + ".xls";
      a.click();
    },
    restFn() {
      let a = this.paramsObj
      for (const key in a) {
        if (this[key]) continue
        a[key] = ''
      }
      for (const key in this.totalArr) {

        if (this.province) continue
        this[key] = this.totalArr[key]
      }

      this.paramsObj = a
      this.paramsObj.top = 10
      this.paramsObj.period = 6

      this.queryTable()
    },
    do_EventCenter_setValue(value) {
      this.Gechart.resize();
    },
    Event_Center_getName: () => {
      return this.id;
    }
  }
};

</script>


<style lang="less" scoped>
.secondary_bigscreen {
  .alarmt_two {
    // width: 100%;
    // height: 100%;
    height: calc(100% - 8px);
    width: calc(100% - 8px);
    display: flex;
    background: linear-gradient(180deg, #083957 0%, #091827 100%);
    justify-content: space-between;
    padding: 4px;

    &_left {
      width: 20%;
      height: 100%;
      border: 1px solid transparent;
      border-image: linear-gradient(104.04deg, rgba(20, 143, 255, 0.99) 0%, #00FFF7 100%) 1;
      padding: 8px;
      box-sizing: border-box;

      .title_header {
        // position: relative;
        width: 100%;
        text-align: center;
        height: 12%;
        background-image: url('../../image/navitem.png');
        background-repeat: no-repeat;
        background-size: 100% 100%;
        line-height: 48px;
        color: #fff;

        span {
          // position: absolute;
          color: #fff;
          // top: 50%;
          // left: 50%;

        }
      }
    }

    &_right {
      width: 100%;
      height: 100%;
      border: 1px solid transparent;
      padding: 40px;
      box-sizing: border-box;
      border-image: linear-gradient(104.04deg, rgba(20, 143, 255, 0.99) 0%, #00FFF7 100%) 1;
      display: flex;
      // justify-content: space-around;
      flex-direction: column;

      .head_secaher {
        // background-color: red;
        // height: 15%;
        display: flex;
        font-size: 12px;
        color: #D0DEEE;
        // justify-content: space-around;
        margin-bottom: 44px;

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

        .grid-content {
          margin-left: 16px;
        }

        .grid-content_button {
          border: 1px solid;
          background: linear-gradient(174.13deg, rgba(20, 143, 255, 0.3) 25.38%, rgba(21, 246, 238, 0.5) 94.06%);
          border-image: linear-gradient(135.84deg, #2CDFE8 0%, #1A9AD9 101.5%) 1;
          color: #FFFFFF;
          width: 80px;
          letter-spacing: 5px;
          cursor: pointer;
          line-height: 26px;
          ;
        }
      }

      .alarmt_two_main {
        display: flex;
        height: 80%;
        justify-content: space-around;

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
          width: 43.5%;
          color: #fff;
          display: flex;
          flex-direction: column;
          // justify-content: space-between;

          &_title {}

          &_main {
            margin-top: 10px;
            // flex: 1;
            border: 1px solid;

            border-image: linear-gradient(104.04deg, rgba(20, 143, 255, 0.99) 0%, #00FFF7 100%) 1;
            height: 505px;

          }



        }

        &_table {
          width: 54.2%;

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
              cursor: pointer;

            }
          }

          &_main {
            padding-top: 10px;

            .page_two {

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

            /deep/.el-table--striped .el-table__body tr.el-table__row--striped td.el-table__cell:last-child {
              border-right: 2px solid #215884 !important;
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
              font-size: 12px;
              height: 44px;
              padding: 0px
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
              background:
                linear-gradient(270deg, rgba(91, 222, 218, 0.18) 50%, rgba(3, 23, 34, 0.3) 100%);
              border: 1px solid #215884;

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