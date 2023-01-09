<template>
  <!-- 定义外层容器标识，宽高百分百 不可删除 -->
  <div :id="id" style="width: 100%;height: 100%" :ref="id">
    <!-- -->
    <div class="southern_tab ">
      <div class="southern_tab_buttonGroup">
        <div class="southern_tab_buttonGroup_start">
          <div class="southern_tab_radio">
            <el-radio-group v-model="radio2" size="medium" @change="radioChange">
              <!-- <el-radio-button label="日"></el-radio-button> -->
              <el-radio-button label="月"></el-radio-button>
              <el-radio-button label="年"></el-radio-button>
            </el-radio-group>
          </div>

          <div class="date_group">
            <button class="itemButton  itemButtonLeft" @click="previousHandler(dateType)"> <i
                class="el-icon-arrow-left"></i>
            </button>
            <el-date-picker prefix-icon="'" popper-class="dateTimePopr" ref="datePicker" v-model="year" :type="dateType"
              placeholder="选择日期" :clearable="false">
            </el-date-picker><button @click="nextHandler(dateType)" class="itemButton itemButtonRight"><i
                class="el-icon-arrow-right"></i> </button>
          </div>
        </div>
        <div class="southern_tab_buttonGroup_end">
          <button class="southern_buttons_item" @click='queryTable(dateType)'><i class="el-icon-search "></i>
            查询</button>
          <button class="southern_buttons_item  ehartImage" @click="showEchartsFn">
            <div class="ehartImageItem">生成图表</div>
          </button>
        </div>
      </div>
      <el-table :data="tableData" row-key="ammeter_name" style="width: 100%" tooltip-effect="dark"
        @selection-change="handleSelectionChange" :row-class-name="rowClassNameFn"
        :header-cell-style="{ padding: 0 + 'px', fontSize: '12px', fontWeight: 400 }"
        :header-row-style="{ height: '30px' }">
        <el-table-column type="selection" :reserve-selection="true" width="55" fixed="left">
        </el-table-column>
        <el-table-column type="index" label="序列" width="55" fixed="left">
        </el-table-column>
        <el-table-column prop="ammeter_name" min-width="180" label="回路名称/kWh" fixed="left">
        </el-table-column>



        <el-table-column :prop="item" :label="item" v-for="item in columnData " min-width="73"
          :render-header="(e, { column, $index }) => { return renderheader(e, { column, $index }, dateType) }"
          :key="item">
        </el-table-column>

      </el-table>
      <div class="developer_pagination">
        <div class="developer_pagination_total">共{{ total }}条 </div>

        <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="currentPage"
          class="two_pagination" :page-sizes="[10, 20, 30, 40]" :page-size="pageSize"
          layout="total, sizes, prev, pager, next, jumper" :total="total">
        </el-pagination>
      </div>
    </div>

    <el-dialog title="用能折线图" :visible.sync="dialogVisible" custom-class="two_dialog" width="1100px">
      <div class="southern_echarts" ref="southern_echarts"></div>
    </el-dialog>

  </div>
</template>

<script>
import eventActionDefine from "./components/msgCompConfig";
import {
  RadioButton,
  RadioGroup, Tabs, TabPane, DatePicker, Button, Table, TableColumn, Dialog, Pagination
} from "element-ui";
import { reportModelOne } from './api/asset'
import Vue from "vue"
import moment from "moment";
import * as echarts from "echarts";
import Utils from "./utils";

Vue.use(RadioGroup)
Vue.use(RadioButton)
Vue.use(Tabs)
Vue.use(TabPane)
Vue.use(Button)
Vue.use(DatePicker)
Vue.use(Table)
Vue.use(Dialog)
Vue.use(Pagination)
Vue.use(TableColumn)
const level = ['level_one', 'level_two', 'level_three']
export default {
  //这里写组件英文名称，容器dom的id及事件中心命名均用到这个name，请认真填写
  name: "ButtonChange",
  props: {
    customConfig: Object,
    info: Object,
    //应用变量和系统变量 7.26 V8R4C50SPC220需求新加 之前版本取不到appVariables和sysVariables
    appVariables: Array,
    sysVariables: Array,
    //8.11 V8R4C60SPC100需求新加，之前版本取不到themeInfo
    themeInfo: Object
  },
  computed: {
    theme() {
      let { theme_global_config } = this.themeInfo || {
        theme_global_config: {
          "--theme-public-pinPai-color": "rgba(24,144,255,1)",
          "--theme-public-text-color-1": "rgba(12, 13, 14,1)"
        }
      }

      let themeColor = theme_global_config["--theme-public-pinPai-color"]
      let textColor = theme_global_config["--theme-public-text-color-1"]
      this.$nextTick(() => {
        let style = `#${this.id} .el-radio-button__inner:hover{
                      color:${this.theme.themeColor};
                      }
                     #${this.id} .el-radio-button.is-active .el-radio-button__inner:hover{
                      color: #FFF;
                      }
                      `
        if (this.$refs[this.id]) {
          this.styleEle = document.createElement("style")
          document.head.appendChild(this.styleEle)
          this.styleEle.innerText = style
        }
      })
      return {
        themeColor,
        textColor
      }
    },
  },
  data() {
    return {
      //必需，不可删除
      id: "",
      //业务代码
      selected: "",
      buttons: [],
      defaultValue: "",
      styleEle: null,
      day: new Date(),
      month: new Date(),
      year: new Date(),
      activeName: '1',
      dateType: 'month',
      radio2: '月',
      tableData: [],
      dataAll: [],
      columnData: [],
      echartsData: [],
      currentPage: 1,
      pageSize: 10,
      Gechart: null,
      total: 9,
      dialogVisible: false,
      dataIds: [] || ["39bfdc3d633e437abb14b0c2a1b8c1ed", "b8eca611955b48e7a053d046fabc47fa", "7c7ded26b9c446379832738e0e7de6bc", "28eca611955b48e7a053d046fabc47fa", "38eca611955b48e7a053d046fabc47fa",
        "39bfdc3d633e437abb14b0c2a1b8c1e1",
        "709d52a39ff9498691d317633701111",
        "b8eca611955b48e7a05sd46fabc47fa",
        "60cd34be53f24dd1a1c1bc0f71693e24",
        "709d52a39ff9498691d3sd337013922",
        "709d52a39ff9498691daw6337013911",
        "6589ab5d84af44a3b8824c66b49f7d2d",
        "28eca611955b48e7a05df046fabc47fa",
        "38eca611955b48e7a05fd046fabc47f1"
      ]

    }
  },
  mounted() {
    //用于注册事件定义，不可删除
    let { componentId } = this.customConfig || {};
    componentId &&
      window.componentCenter?.register(
        componentId,
        "comp",
        this,
        eventActionDefine
      );
    let { buttons, id } = this.customConfig
    let componentName = this.$vnode.tag.split("-").pop().toLowerCase()
    this.id = id ? `secondary_${componentName}_${id}` : `secondary_${componentName}_${Utils.generateUUID()}`
    //用于定义接收用户输入
    // this.buttons = JSON.parse(buttons).data;
    if (this.defaultValue) {
      this.selected = this.defaultValue
      this.triggerEvent("valueChange",
        {
          value: this.defaultValue
        }
      )
    }
    this.handleValueChange()
    //业务代码
    this.dataIds = ["39bfdc3d633e437abb14b0c2a1b8c1ed", "b8eca611955b48e7a053d046fabc47fa", "7c7ded26b9c446379832738e0e7de6bc", "28eca611955b48e7a053d046fabc47fa", "38eca611955b48e7a053d046fabc47fa",
      "39bfdc3d633e437abb14b0c2a1b8c1e1",
      "709d52a39ff9498691d317633701111",
      "b8eca611955b48e7a05sd46fabc47fa",
      "60cd34be53f24dd1a1c1bc0f71693e24",
      "709d52a39ff9498691d3sd337013922",
      "709d52a39ff9498691daw6337013911",
      "6589ab5d84af44a3b8824c66b49f7d2d",
      "28eca611955b48e7a05df046fabc47fa",
      "38eca611955b48e7a05fd046fabc47f1"
    ]
    // this.queryReportModel()
  },
  methods: {
    //定义类名
    rowClassNameFn({ row, rowIndex }) {
      return level[row.level - 1]
    },
    timeStartFn() {

    },
    //改变页数大小
    handleSizeChange(val) {
      this.pagingHandler(this.currentPage, val)
      this.pageSize = val
    },
    //改变页数
    handleCurrentChange(val) {
      this.pagingHandler(val, this.pageSize)
      this.currentPage = val
    },
    //分页
    pagingHandler(pageNum, pageSize) {
      this.tableData = this.dataAll.slice((pageNum - 1) * pageSize, (pageNum - 1) * pageSize + pageSize)
      // this.initEchartFn(this.tableData)
    },


    renderheader(h, { column, $index }, type) {
      let unit = { month: '日', year: '月' }

      return h("span", Number(column.label) + unit[type])
    },
    //图表弹框
    showEchartsFn() {
      this.dialogVisible = true
      this.$nextTick(() => {
        this.initEcharts()
      })

    },
    //图例渲染
    initEcharts() {
      let dataArr = []
      let dataName = []
      let seriesData = []
      let reg = /^[0-9]*$/;//正则表达式
      let numIs = new RegExp(reg)
      //纯数据就是true
      this.echartsData.forEach((x, i) => {
        for (const key in x) {
          if (numIs.test(x[key])) {
            console.log(Boolean(dataArr[i]));
            dataArr[i] = dataArr[i] ? [...dataArr[i], x[key]] : [x[key]]
          } else {
            dataName.push(x[key])

          }
        }
      })


      let unit = { month: '日', year: '月' }
      let key = unit[this.dateType]



      let xAxis = this.columnData.map(x => {
        return Number(x) + key
      })



      dataName.forEach((x, i) => {

        seriesData.push({
          name: x,
          type: 'line',
          symbol: 'circle',
          itemStyle: {
            normal: {

              borderColor: 'rgba(255, 255, 255)', //圆点透明 边框
              borderWidth: 1,
            },
          },

          data: dataArr[i],

        })
      })

      let options = {

        tooltip: {
          trigger: 'axis',
          show: this.echartsData.length > 10 ? false : true
        },
        legend: {
          data: dataName,
          itemHeight: 8,
          itemWidth: 12,
          icon: 'circle',
          right: '5%',
          textStyle: {
            fontSize: 10
          }
        },
        grid: {
          left: '3%',
          right: '4%',
          bottom: '3%',
          containLabel: true
        },

        xAxis: {
          type: 'category',
          // boundaryGap: false,
          axisTick: {
            show: false
          },

          data: xAxis
        },
        yAxis: [
          {
            type: 'value',
            // name: '单位 kW-h',
            position: 'left',
            // alignTicks: true,
            show: true,
            axisLine: {
              show: false,

            },
            lineStyle: {
              color: '#A1A7B3',
              type: 'dashed'
            },
            splitLine: {
              show: true,
              lineStyle: {
                color: '#A1A7B3',
                type: 'dashed'
              }
            },
          },






        ],
        series: seriesData
      };


      this.Gechart = echarts.init(this.$refs.southern_echarts);
      this.Gechart.setOption(options, { notMerge: true });




    },

    //-------------
    //按钮事件 上一
    previousHandler(type) {
      let last
      switch (type) {
        case 'date':
          last = new Date(this.year.getTime() - (60 * 60 * 24 * 1000))

          break;
        case 'month':
          last = new Date(this.year)
          last.setMonth(this.year.getMonth())
          last.setDate(0);

          break;
        case 'year':
          last = new Date(new Date().setFullYear(this.year.getFullYear() - 1))

          break;
        default:
          break;
      }
      this.year = new Date(last)
      // this.day = new Date(this.day.getTime() - (60 * 60 * 24 * 1000))
      // let lastMonth = this.day
      // lastMonth.setMonth(lastMonth.getMonth())
      // lastMonth.setDate(0);

      this.queryTable(type)

      // 

    },
    //下一
    nextHandler(type) {
      let last
      switch (type) {
        case 'date':
          last = new Date(this.year.getTime() + (60 * 60 * 24 * 1000))

          break;
        case 'month':
          last = new Date(this.year)
          if (this.year.getMonth() + 2 > 12) {
            let year = this.year.getFullYear() //获取当前时间的年份
            let mon = this.year.getMonth() //获取当前时间的月份
            year = parseInt(year) + 1;
            mon = parseInt(this.year.getMonth() + 2) % 12;
            last = new Date(year, mon, 0)
          } else {
            last.setMonth(this.year.getMonth() + 2)
            last.setDate(0);
          }



          break;
        case 'year':
          last = new Date(new Date().setFullYear(this.year.getFullYear() + 1))

          break;
        default:
          break;
      }
      this.year = new Date(last)
      this.queryTable(type)
    },

    //查询表格
    queryTable(type) {
      let timeType = { date: 'YYYY-MM-DD', month: 'YYYY-MM', year: 'YYYY' }
      let time = moment(this.year).format(timeType[type])
      console.log(time, type, '=======d');
      this.queryReportModel(time)
      //接口
    },
    //--------------------------=================
    queryReportModel(time) {
      reportModelOne({
        time,
        "ids": this.dataIds
      }).then(res => {

        this.dataAll = [...res.data]
        // this.dataAll.forEach(x => {
        //   x.data_id = Utils.generateUUID()
        // })
        this.tableData = this.dataAll.slice(0, this.currentPage * this.pageSize)
        let a = []
        this.tableData.forEach(x => {
          a.push(Object.keys(x).length)

        })
        let FastLength = a.indexOf(Math.max(...a))
        this.columnData = Object.keys(this.tableData[FastLength])
        console.log(this.columnData, '=');
        this.columnData.splice(this.columnData.indexOf('ammeter_name'), 1)
        this.columnData.splice(this.columnData.indexOf('ammeter_id'), 1)
        this.columnData.splice(this.columnData.indexOf('level'), 1)
        this.columnData.sort(function (a, b) {
          return a - b
        })
        this.total = this.dataAll.length

      }).catch(err => {
        this.columnData = []
        this.tableData = []
        this.total = 0
      })

    },


    //表格选择框事件
    handleSelectionChange(selection) {
      this.echartsData = []
      this.echartsData = JSON.parse(JSON.stringify(selection))
      this.echartsData.forEach((x) => {
        delete x.ammeter_id
        delete x.level
      })
    },

    //  图表按钮
    handleValueChange(value) {
      this.triggerEvent("valueChange",
        {
          value
        }
      )
    },

    //单选按钮组
    radioChange(value,) {
      let tabsObj = { 日: '1', 月: '2', 年: '3' }
      let date = ['date', 'month', 'year']
      // this.activeName = tabsObj[value]
      this.dateType = date[tabsObj[value] - 1]

      this.queryTable(this.dateType)
    },
    /**
     * 触发事件 必需，不可删除
     * @param {String} eventName 事件名
     * @param {Array} payload 事件传参
     *
     */
    triggerEvent(eventName, payload) {
      let { componentId, appId } = this.customConfig || {};
      componentId && appId && window.eventCenter?.triggerEvent(
        componentId,
        eventName,
        payload
      );
    },
    //必需，不可删除
    Event_Center_getName() {
      return this.id;
    },
    //与msgCompConfig.js文件actions相对应，组件动作，依据定义加上do_message前缀
    do_EventCenter_setValue({ value }) {
      this.setValue(value)
    },

    do_EventCenter_secharFn({ value }) {
      this.sechrFn(value)
    },
    sechrFn(value) {
      this.dataIds = value
      this.queryTable(this.dateType)
    },
    setValue(value) {
      this.dataIds = value


    }


  },
  destroyed() {
    //必需，不可删除
    window.componentCenter?.removeInstance(this.customConfig?.componentId);
    //业务代码，不需要记得清除
    document.head.removeChild(this.styleEle)
  },
};
</script>
<style lang="less" scoped>
.southern_tab {
  padding: 24px;

  .southern_tab_buttonGroup {
    display: flex;
    margin-bottom: 32px;
    justify-content: space-between;

    .southern_tab_buttonGroup_start {
      display: flex;

    }

    .southern_tab_buttonGroup_end {
      display: flex;
    }

    /deep/ .el-radio-button {
      height: 32px;



    }

    /deep/.el-radio-button__inner {
      line-height: 10px;
    }



    .southern_buttons_item {
      text-align: center;
      width: 96px;
      height: 32px;
      background-color: #fff;
      // color: #fff;
      border: 1px solid rgba(218, 221, 229, 1);
      border-radius: 4px;

      // border-color: transparent;
      cursor: pointer;
    }

    .ehartImage {
      width: 124px;
      display: flex;
      justify-content: center;
      align-items: center;
      margin-left: 16px;

      .ehartImageItem {
        padding-left: 16px;
        background: url('./assets/echarts.png') no-repeat 0 4px;
      }
    }

    .date_group {
      display: flex;
      margin-left: 40px
    }

    .itemButton {
      height: 32px;
      background-color: #fff;
      border: 1px solid #DCDFE6;
      cursor: pointer;
      font-size: 20px;
      font-weight: 700;

      display: flex;
      // justify-content: center;
      // align-content: center;

      &:hover {
        color: cornflowerblue;

      }

      /deep/.el-icon-arrow-left {
        line-height: 28px;
      }

      /deep/.el-icon-arrow-right {
        line-height: 28px;
      }
    }

    .itemButtonRight {
      border-top-right-radius: 4px;
      border-bottom-right-radius: 4px;
      border-left: none;
    }

    .itemButtonLeft {
      border-top-left-radius: 4px;
      border-bottom-left-radius: 4px;
      border-right: none;
    }

    /deep/.el-date-editor {
      width: 182px;
      height: 32px;

      .el-input__icon {
        line-height: 32px;
      }
    }

    /deep/.el-input__inner {
      border-radius: 0px;
      border-left: none;
      border-right: none;
      text-align: center;
      height: 32px;
      // width: calc(100% - 53px);
      padding: 0px;

      &:hover {
        border-color: #DCDFE6;
      }

      &:focus {
        border-color: #DCDFE6;
      }
    }
  }

  /deep/ .el-tabs__nav-wrap {
    display: none;
  }

  /deep/.el-tabs__item {
    padding: 0px;
    width: 120px;
    text-align: center;
    margin-right: 10px;

    &:hover {
      color: #fff;
      background: #03ada8;
    }
  }

  /deep/.el-tabs__active-bar {
    background-color: transparent;
  }

  /deep/.el-tabs__nav-wrap::after {
    // background: #03ada8;
    height: 4px;
  }

  /deep/.is-active {
    // color: #fff;
    // background: #03ada8;
  }

  .southern_echat_search {
    display: flex;

    .southern_buttons {
      width: 540px;
      display: flex;
      justify-content: space-around;


    }
  }

  // /deep/ .level_one {
  //   background: rgba(26, 121, 255, 0.1);
  // }

  /deep/.el-table--enable-row-hover .el-table__body tr:hover>td.el-table__cell {
    background: rgba(239, 246, 255, 1);
    ;
  }

  /deep/ .el-table__body tr.level_one>td.el-table__cell {
    background: rgba(26, 121, 255, 0.1);
  }

  //一级颜色

  /deep/ .el-table__body tr.level_two>td.el-table__cell {
    background: rgba(21, 144, 85, 0.06);
  }

  //二级颜色

  /deep/ .el-table__body tr.level_three>td.el-table__cell {
    background: rgba(102, 102, 204, 0.05);
  }


  /deep/.el-table td.el-table__cell {
    border-bottom: none;
  }

  /deep/.el-table th.el-table__cell {
    // background-color: #03ada8;
    // color: #fff;
  }

  /deep/.el-checkbox__input.is-checked .el-checkbox__inner,
  .el-checkbox__input.is-indeterminate .el-checkbox__inner {
    background-color: #0454F2;
    border-color: #0454F2;
  }

  /deep/.el-checkbox__input.is-indeterminate .el-checkbox__inner {
    background-color: #0454F2;
    border-color: #0454F2;
  }
}

.southern_echarts {
  // width: 800px;
  height: 400px;
}

.developer_pagination {
  display: flex;
  justify-content: space-between;
  align-content: center;
  margin-top: 10px;

  .developer_pagination_total {
    font-size: 13px;
    min-width: 35.5px;
    height: 28px;
    line-height: 28px;
    vertical-align: top;
    box-sizing: border-box;
  }

}

/deep/.two_pagination {
  .el-pagination__total {
    display: none;
  }
}

/deep/.el-radio-button__orig-radio:checked+.el-radio-button__inner {
  color: #FFF;
  background-color: #0454F2;
  border-color: #0454F2;
  box-shadow: -1px 0 0 0 #0454F2;
}



/deep/.two_dialog {
  border-radius: 16px;
}
</style>