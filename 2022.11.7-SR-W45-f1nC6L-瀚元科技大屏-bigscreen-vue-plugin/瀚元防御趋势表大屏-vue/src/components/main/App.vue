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
              :disabled="Boolean(province)" popper-class="two_options" size="mini" placeholder="请选择"
              @change="(e) => { selectProFn('province', e) }">
              <el-option v-for="item in provinceOp" :key="item.value" :label="item.label" :value="item.value">
              </el-option>
            </el-select>
          </div>

          <div class="grid-content bg-purple">所在市： <el-select v-model="paramsObj.city" size="mini"
              :disabled="Boolean(city)" popper-class="two_options" placeholder="请选择"
              @change="(e) => { selectProFn('city', e) }">
              <el-option v-for="item in cityOp" :key="item.value" :label="item.label" :value="item.value">
              </el-option>
            </el-select>
          </div>

          <div class="grid-content bg-purple">站点名称： <el-select v-model="paramsObj.substationName" size="mini"
              :disabled="Boolean(substationName)" popper-class="two_options" placeholder="请选择">
              <el-option v-for="item in substationOp" :key="item.value" :label="item.label" :value="item.value">
              </el-option>
            </el-select>
          </div>





          <div class="grid-content bg-purple">统计周期： <el-select v-model="paramsObj.period" size="mini"
              popper-class="two_options" placeholder="请选择">
              <el-option v-for="item in cycleOp" :key="item.value" :label="item.label" :value="item.value">
              </el-option>
            </el-select>
          </div>
          <!-- <div class="grid-content bg-purple">告警状态： <el-select v-model="paramsObj.status" size="mini"
              popper-class="two_options" placeholder="请选择">
              <el-option v-for="item in alarmOp" :key="item.value" :label="item.label" :value="item.value">
              </el-option>
            </el-select>
          </div> -->

          <div class="grid-content bg-purple">
            <button class="grid-content_button" @click="queryTable">查询 </button>
            <button class="grid-content_button" :style="{ marginLeft: '6px' }" @click="restFn">重置</button>
          </div>

        </div>
        <div class="alarmt_two_main">
          <div class="alarmt_two_main_echart">
            <div class="alarmt_two_main_echart_title border_title">
              防御结果分时统计（{{ period || '年' }}）
            </div>
            <div class="alarmt_two_main_echart_main" ref="alarmt_echart"></div>

          </div>
          <div class="alarmt_two_main_table">
            <div class="alarmt_two_main_table_title  border_title">防御结果
              <button class="alarmt_two_main_button" @click="tableToExcel(echartsDat)">导出 </button>
            </div>
            <div ref="alarmt_main_three" class="alarmt_two_main_table_main">
              <div class="table_item" v-for=" o in  3 " :key="o">

                <el-table :data="tableData[o - 1]" style="width: 100%" stripe>

                  <el-table-column prop="time" label="时间" align="center">

                  </el-table-column>
                  <el-table-column prop="total" label="防御总次数" align="center">

                  </el-table-column>
                  <el-table-column prop="successNum" label="防御成功次数" min-width="80" align="center">

                  </el-table-column>
                  <el-table-column prop="failedNum" label="防御失败次数" min-width="80" align="center">

                  </el-table-column>
                  <el-table-column prop="probability" label="防御成功率" align="center">

                  </el-table-column>

                </el-table>
              </div>

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
const timeAll = []
for (let i = 1; i <= 24; i++) {
  let a = i < 10 ? '0' + i : i
  timeAll[i] = {}
  timeAll[i].time = a + ':00'
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
      tableData: [],
      echartsDat: [],
      timeAll: [],
      pageState: false,
      value: '',
      provinceOp: [],
      cityOp: [],
      tableHeight: null,
      substationOp: [],
      cycleOp: [{ value: 0, label: '最近一周' },
      { value: 1, label: '最近一个月' },
      { value: 3, label: '最近一个季度' },
      { value: 6, label: '最近半年' },
      { value: 12, label: '最近一年' },
      { value: 24, label: '最近两年' },
      ],
      period: '年',
      totalArr: {},
      GechartE: null,
      paramsObj: { province: '', city: '', substationName: '', period: 24 }
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
    // this.$nextTick(() => {
    //   this.tableHeight = this.$refs.alarmt_main_three.offsetHeight;
    //   console.log('this.tableHeight', this.tableHeight);
    // })

    let date = { 0: '周', 1: '月', 3: '季度', 6: '半年', 12: '年', 24: '两年' }
    this.period = date[this.paramsObj.period]
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
    if (data?.variable?.current_value === '' || data?.variable?.default_value === '') this.queryTable()
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
      let date = { 0: '周', 1: '月', 3: '季度', 6: '半年', 12: '年', 24: '两年' }
      this.period = date[this.paramsObj.period]
      TOPNAlarmInfo(params).then(res => {
        this.echartsDat = res.data
        this.timeAll = JSON.parse(JSON.stringify(timeAll))
        this.timeAll.shift()
        if (this.echartsDat != 0) {
          let headerObj = Object.keys(this.echartsDat[0])
          this.echartsDat.forEach(x => {
            x.time = x.time == '00:00' ? '24:00' : x.time
          })
          headerObj.splice(headerObj.indexOf('time'), 1)
          this.timeAll.forEach((x, i) => {
            let a = false
            let aj = null
            for (let i = 0; i < this.echartsDat.length; i++) {
              let item = this.echartsDat[i]
              if (item.time == x.time) {
                a = true
                item.probability = parseInt(item.probability)
                aj = item

                break
              }
            }
            if (!a) {
              headerObj.forEach((y, i) => {
                x[y] = y == 'probability' ? '--' : 0
              })

            } else {
              for (const key in aj) {
                x[key] = aj[key]
              }
            }

          })
        } else {
          this.timeAll.forEach((x, i) => {
            x.total = 0
            x.successNum = 0
            x.failedNum = 0
            x.probability = '--'
          })
        }

        let a = []
        let tab = []

        this.timeAll.forEach((x, i) => {
          x.probability = x.probability == '--' ? x.probability : Number(x.probability).toFixed(2)
          a.push(x)
          if ((i + 1) % 8 == 0) {
            tab.push(a)
            a = []
          }
        })
        this.tableData = tab
        this.echartsDat = this.timeAll

        this.initEchartFn(this.echartsDat)


      }).catch(err => {
        console.log(err);
      })


    },
    //下拉菜单数据
    async querySelect() {
      await queryDropDownBox().then(res => {
        console.log(res.data);
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
    //渲染图表
    initEchartFn(data) {
      let temp = { defensetotal: [], successNum: [], failedNum: [], probability: [] }
      let xAxData = []
      data.forEach((x, i) => {
        temp.successNum.push(x.successNum)
        temp.failedNum.push(x.failedNum)
        temp.probability.push(x.probability)
        xAxData.push(i + 1 + '时')
      })
      let option = {
        color: [' #2699FF'],
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            lineStyle: {
              type: "dotted",
              width: 1
            }
          }
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
              show: false
            },
            axisTick: {
              show: false
            },
            axisLabel: {
              color: "#D0DEEE"
            },

            // data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
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
              color: '#D0DEEE',
              formatter: '{value} 次'
            },
          }
        ],
        series: [
          {
            name: '防御成功次数',
            type: 'line',
            smooth: true,
            showSymbol: false,
            lineStyle: {
              width: 3,


              color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                {
                  offset: 0,
                  color: '    rgba(77, 161, 255, 1)'




                },
                {
                  offset: 0.8,
                  color: 'rgba(77, 255, 223, 1)'
                }
              ])
            },
            areaStyle: {
              opacity: 0.6,
              color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                {
                  offset: 0,
                  color: '   rgba(49, 251, 251, 0.4)'




                },
                {
                  offset: 0.8,
                  color: 'rgba(49, 251, 251, 0)'
                }
              ])
            },
            // data: [140, 232, 101, 264, 90, 340, 250]
            data: temp.successNum
          },


        ]
      };

      this.GechartE = echarts.init(this.$refs.alarmt_echart);

      this.GechartE.setOption(option);
      this.GechartE.resize()
      // const task = () => {
      //   this.GechartE.resize();

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
      this.paramsObj.period = 24
      let date = { 0: '周', 1: '月', 3: '季度', 6: '半年', 12: '年', 24: '两年' }
      this.period = date[this.paramsObj.period]
      this.queryTable()
    },
    tableToExcel(tableData) {
      const headArr = Object.keys(tableData[0])
      const titleObj = { time: '时间', successNum: '成功防御次数', failedNum: '防御失败次数', probability: '成功率', total: '防御总次数', }
      // 要导出的json数据
      // 列标题
      let str = "<tr>"
      headArr.forEach((item, index) => {

        str += (index == (headArr.length - 1)) ? `<td>${titleObj[item]}</td></tr>` : `<td>${titleObj[item]}</td>`

      })
      // 循环遍历，每行加入tr标签，每个单元格加td标签
      for (let i = 0; i < tableData.length; i++) {
        str += '<tr>';
        for (const key of headArr) {
          // 增加\t为了不让表格显示科学计数法或者其他格式
          if (key == 'time') {
            str += `<td>${tableData[i][key] + '\t'}</td>`;
          } else {
            str += `<td>${tableData[i][key] + '\t'}</td>`;
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
      a.download = "防御结果分时统计趋势表" + ".xls";
      a.click();
    },
    do_EventCenter_setValue(value) {
      this.GechartE.resize();
      // this.GechartE2.resize();

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
    width: 100%;
    height: 100%;
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
        height: 95%;
        justify-content: space-around;
        flex-direction: column;

        .alarmt_two_main_table {
          margin-top: 30px;
          width: 100%;
          height: 100%;

          .alarmt_two_main_table_main {
            display: flex;
            justify-content: space-between;
            height: calc(100% - 60px);

            .table_item {
              width: 31%;
              height: 100%;
            }
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
          // width: 49%;
          color: #fff;
          display: flex;
          flex-direction: column;
          // justify-content: space-between;

          &_title {}

          &_main {
            margin-top: 10px;
            // flex: 1;
            border: 1px solid;
            height: 300px;
            border-image: linear-gradient(104.04deg, rgba(20, 143, 255, 0.99) 0%, #00FFF7 100%) 1;


          }



        }

        &_table {
          // width: 49%;

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
            display: flex;
            justify-content: space-around;

            .table_item {
              width: 32%;
            }

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

            /deep/ .el-table .cell {
              padding: 0 6px;
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
              height: 38px;
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