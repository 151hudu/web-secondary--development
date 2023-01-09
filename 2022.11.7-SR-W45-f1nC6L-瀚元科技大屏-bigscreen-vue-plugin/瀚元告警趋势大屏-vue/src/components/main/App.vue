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





          <div class="grid-content bg-purple">统计方式： <el-select v-model="paramsObj.period" size="small"
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
              告警趋势分析
            </div>
            <div class="alarmt_two_main_echart_main" ref="alarmt_echart"></div>
          </div>
          <div class="alarmt_two_main_table">
            <div class="alarmt_two_main_table_title  border_title">告警信息
              <button class="alarmt_two_main_button" @click="tableToExcel(dataAll)">导出 </button>
            </div>
            <div class="alarmt_two_main_table_main">
              <el-table :data="tableData" style="width: 100%" stripe>
                <el-table-column type="index" label="序号" align="center"> </el-table-column>
                <el-table-column prop="time" label="日期" align="center">

                </el-table-column>
                <el-table-column prop="urgency" label="紧急" align="center">

                </el-table-column>
                <el-table-column prop="significance" label="重要" align="center">

                </el-table-column>
                <el-table-column prop="ordinary" label="一般" align="center">

                </el-table-column>
                <el-table-column prop="hint" label="提示" align="center">

                </el-table-column>
                <el-table-column prop="firstAlarm" label="首次发生时间" min-width="136">

                </el-table-column>
                <el-table-column prop="lastAlarm" label="最后发生时间" min-width="136">
                </el-table-column>
              </el-table>
              <div class="page_two" style="margin-top:16px" v-if="pageState">
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
      dataAll: [],
      pageState: true,
      value: '',
      provinceOp: [],
      TopOP: [{
        label: '5', value: 5
      }, {
        label: '10', value: 10
      }],
      cityOp: [],
      substationOp: [],
      cycleOp: [{ value: '年', label: '按年' },
      { value: '月', label: '按月' },
      { value: '周', label: '按周' },

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
      pageObj: { currentPage: 1, pageSize: 10, total: null },
      paramsObj: { province: '', city: '', substationName: '', status: '', period: '年' }
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
        if (!(Boolean(this.province) == false && Boolean(this.city) == false && Boolean(this.substationName) == false)) {
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
        }
        if (!this.city && !this.substationName && this.province) this.queryTable()
      },

      // immediate: true,
      deep: true
    },
    'paramsObj.city': {
      handler(val) {
        if (!this.totalArr.substationOp) return
        if (!(Boolean(this.province) == false && Boolean(this.city) == false && Boolean(this.substationName) == false)) {
          let substationOp = this.totalArr.substationOp
          this.substationOp = substationOp.filter((x, i) => {
            let filed = String(x.id)
            let l = x.statno.length
            let strl = filed.length

            return filed.substr(0, strl - l) == val
          })
        }

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
  async mounted() {



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
    let id = this.options?.externalVariables?.id;
    this.id = id ? `secondary_analyzer_${id}` : `secondary_bigscreen_${Utils.generateUUID()}`;
    this.queryTable()
    await this.querySelect()
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
      params.period = params.period || "年"
      TOPNAlarmInfo(params).then(res => {
        this.dataAll = res.data
        this.dataAll.forEach(x => {
          x.firstAlarm = x.firstAlarm ? moment(x.firstAlarm).format("YYYY-MM-DD hh:mm:ss") : ''
          x.lastAlarm = x.lastAlarm ? moment(x.lastAlarm).format("YYYY-MM-DD hh:mm:ss") : ''
        })
        this.pageObj.currentPage = 1
        this.tableData = this.dataAll.slice(0, this.pageObj.currentPage * this.pageObj.pageSize)
        this.pageObj.total = this.dataAll.length
        this.initEchartFn(this.dataAll)
      }).catch(err => {
        console.log(err);
      })


    },
    //下拉菜单数据
    async querySelect() {
      await queryDropDownBox().then(res => {

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
    //渲染图表
    initEchartFn(data) {
      let temp = { 紧急: [], 重要: [], 一般: [], 提示: [] }
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
      switch (this.paramsObj.period) {
        case '年':
          chuli = (val) => Number(moment(val).format('MM')) + '月'

          break;
        case '月':
          chuli = (val) => Number(moment(val).format('DD')) + '日'

          break;
        case '周':
          chuli = (val) => xinqiZ[moment(val).format('dd')]

          break;
        default:
          chuli = (val) => Number(moment(val).format('MM')) + '月'

          break;
      }
      let xAxData = []
      data.forEach((x, i) => {
        temp.紧急.push(x.urgency)
        temp.重要.push(x.significance)
        temp.一般.push(x.ordinary)
        temp.提示.push(x.hint)
        xAxData.push(chuli(x.time))

      })
      let colorLine = ['rgba(255, 57, 56, 0.8)|rgba(255, 118, 53, 0)', 'rgba(255, 141, 77, 0.8)|rgba(255, 194, 77, 0)', 'rgba(251, 243, 49, 0.8) |rgba(251, 231, 49, 0) ', 'rgba(77, 161, 255, 0.8)|rgba(77, 255, 223, 0)']
      let item = {
        name: '紧急',
        type: 'line',
        smooth: true,
        showSymbol: false,
        lineStyle: {
          width: 4
        },
        areaStyle: {
          opacity: 0.6,
          color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
            {
              offset: 0,
              color: 'rgba(128, 255, 165, 0.8)'
            },
            {
              offset: 0.8,
              color: 'rgba(1, 191, 236, 0)'
            }
          ])
        },
        data: [140, 232, 101, 264, 90, 340, 250]
      }
      let i = 0
      let echart = []
      for (const key in temp) {
        item.name = key
        item.areaStyle.color = new echarts.graphic.LinearGradient(0, 0, 0, 1, [
          {
            offset: 0,
            color: colorLine[i].split('|')[0]
          },
          {
            offset: 0.8,
            color: colorLine[i].split('|')[1]
          }
        ])

        item.data = temp[key]
        echart.push(JSON.parse(JSON.stringify(item)))
        i++
      }


      let options = {
        color: ['#F95757', '#FF9E75', '#FFD03B', '#30D994', '#30D994'],
        tooltip: {
          trigger: 'axis'
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
          data: ['紧急', '重要', '一般', '提示']
        },
        grid: {
          left: '3%',
          right: '4%',
          top: '10%',
          bottom: "16%",
          containLabel: true
        },
        xAxis: [
          {
            type: 'category',
            boundaryGap: false,
            axisLine: {
              show: false,

            },
            axisTick: {
              show: false,
              interval: 0,
            },
            axisLabel: {
              color: "#D0DEEE",


            },
            data: xAxData
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
        series: echart

      };

      this.Gechart = echarts.init(this.$refs.alarmt_echart);
      this.Gechart.setOption(options);
      // const task = () => {
      //   this.Gechart.resize();
      // };
      // window.addEventListener("resize", debounce(task, 300));
    },
    //重置
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
      this.paramsObj.period = '年'
      this.queryTable()
    },
    tableToExcel(tableData) {
      const headArr = Object.keys(tableData[0])
      let aTime = { 年: 'YYYY.MM ', 月: 'YYYY.MM.DD', 周: 'YYYY.MM.DD' }
      let st1 = aTime[this.paramsObj.period]
      const titleObj = { time: '日期', urgency: '紧急', significance: '重要', ordinary: '一般', hint: '提示', firstAlarm: '首次发生时间', lastAlarm: '最后发生时间' }
      // 要导出的json数据
      // 列标题
      let tableData1 = JSON.parse(JSON.stringify(tableData))
      tableData1.forEach((x, i) => {
        x.firstAlarm = x.firstAlarm ? moment(x.firstAlarm).format("YYYY.MM.DD HH:mm:ss") : ''
        x.lastAlarm = x.lastAlarm ? moment(x.lastAlarm).format("YYYY.MM.DD HH:mm:ss") : ''
      })
      const head = Object.keys(titleObj)
      let str = "<tr>"


      head.forEach((item, index) => {

        str += (index == (head.length - 1)) ? `<td>${titleObj[item]}</td></tr>` : `<td>${titleObj[item]}</td>`

      })
      // 循环遍历，每行加入tr标签，每个单元格加td标签
      for (let i = 0; i < tableData1.length; i++) {
        str += '<tr>';
        for (const key of head) {
          // 增加\t为了不让表格显示科学计数法或者其他格式
          if (key == 'firstAlarm' || key == 'lastAlarm') {
            str += `<td>${tableData1[i][key] || '' + '\t'}</td>`;
          } else if (key == 'time') {
            str += `<td>${tableData1[i][key] ? String(moment(tableData1[i][key]).format(st1)) : '' + '\t'}</td>`;
          } else {
            str += `<td>${tableData1[i][key] || 0 + '\t'}</td>`;
          }

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
      console.log(str, '====date数据');
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
      a.download = "告警趋势表" + ".xls";
      a.click();
    },
    do_EventCenter_setValue(value) {
      this.Gechart.resize();
    },
    Event_Center_getName() {
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
      justify-content: space-around;
      flex-direction: column;

      .head_secaher {
        // background-color: red;
        // height: 15%;
        display: flex;
        font-size: 12px;
        color: #D0DEEE;
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
          line-height: 26px;
          ;
          cursor: pointer;
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
            height: 505px;
            border-image: linear-gradient(104.04deg, rgba(20, 143, 255, 0.99) 0%, #00FFF7 100%) 1;


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
              font-size: 12px;
            }

            /deep/.el-table--striped .el-table__body tr.el-table__row--striped td.el-table__cell:last-child {
              border-right: 2px solid #215884 !important;

            }

            /deep/.el-table,
            .el-table__expanded-cell {
              background-color: transparent;
              font-size: 12px;
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

            /deep/.el-table--striped .el-table__body tr.el-table__row--striped td.el-table__cell:last-child {
              border-right: 2px solid #215884 !important;
            }

            /deep/.el-table__body-wrapper::-webkit-scrollbar {
              display: none;
            }

            /deep/.el-table__body-wrapper .el-table__row--striped {
              background:
                linear-gradient(270deg, rgba(91, 222, 218, 0.18) 50%, rgba(3, 23, 34, 0.3) 100%);
              border: 1px solid #215884;

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