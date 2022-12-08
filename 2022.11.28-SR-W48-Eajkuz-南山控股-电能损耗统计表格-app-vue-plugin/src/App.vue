<template>
  <!-- 定义外层容器标识，宽高百分百 不可删除 -->
  <div :id="id" style="width: 100%; height: 100%" :ref="id">
    <!-- -->
    <el-card class="topCard">
      <span class="bigTitle">多级电能损耗</span>
      <br />
      <div class="choose_Box">
        <el-radio-group v-model="dateChoose" @change="dateChange" size="small" class="dateChoose">
          <el-radio-button label="1">月</el-radio-button>
          <el-radio-button label="2">年</el-radio-button>
        </el-radio-group>
        <div class="dateChooseBox">
          <div v-show="dateChoose == '2'" class="dateChooseBoxLeft" @click="yearLeft"><</div>
          <el-date-picker v-show="dateChoose == '2'" value-format="yyyy" v-model="yearPicker" class="yearDataPicker" type="year" size="small" placeholder="选择年">
          </el-date-picker>
          <div v-show="dateChoose == '2'" class="dateChooseBoxRight" @click="yearRight">></div>
          <div v-show="dateChoose == '1'" class="dateChooseBoxLeft" @click="monLeft"><</div>
          <el-date-picker v-show="dateChoose == '1'" value-format="yyyy-MM" v-model="monPicker" class="monDataPicker" type="month" size="small" placeholder="选择月">
          </el-date-picker>
          <div v-show="dateChoose == '1'" class="dateChooseBoxRight" @click="monRight">></div>
        </div>

        <el-select v-model="selectData" placeholder="请选择" value-key="ammeter_level_one" size="small" class="selectPicker">
          <el-option v-for="item in options" :key="item.ammeter_level_one" :label="item.ammeter_name" :value="item"> </el-option>
        </el-select>
        <el-radio-group v-model="watchChoose" size="small" class="watchChoose" @change="watchChooseChange">
          <el-radio-button label="0">总表-二级表间损耗</el-radio-button>
          <el-radio-button label="1">总表-末端表间损耗</el-radio-button>
          <el-radio-button label="2">二级-末端表间损耗</el-radio-button>
        </el-radio-group>
        <el-button class="searchButton" icon="el-icon-search" size="small" @click="searchTableData">查询</el-button>
        <el-select v-model="unitSelectData" placeholder="请选择" value-key="value" size="small" style="width: 104px; float: right">
          <el-option v-for="item in unitOptions" :key="item.value" :label="item.label" :value="item"> </el-option>
        </el-select>
      </div>
      <el-table
        :data="tableData"
        style="width: 100%"
        max-height="270px"
        class="useTable"
        ref="table"
        stripe
        @selection-change="handleSelectionChange"
        :row-key="getRowKeys"
        :header-cell-style="{
          textAlign: 'center',
          height: '30px',
          padding: '3px 0',
          color: '#626973',
          borderColor: '#dadde5',
          fontWeight: 500,
        }"
      >
        <el-table-column v-if="this.watchChoose == '2'" align="center" fixed="left" type="selection" width="35" reserve-selection> </el-table-column>
        <el-table-column align="center" type="index" width="50" fixed="left" label="序列"> </el-table-column>
        <el-table-column align="center" prop="ammeter_name" fixed="left" label="回路名称/KW·h" min-width="150"> </el-table-column>
        <template>
          <el-table-column align="center" v-for="(item, index) in headerData" :key="index" :prop="item" :label="item" min-width="110"> </el-table-column>
        </template>
        <!-- <template v-else>
          <el-table-column align="center" v-for="(item, index) in tableHeaderYear" :key="index" :prop="item.props" :label="item.name"> </el-table-column>
        </template> -->
      </el-table>
    </el-card>
    <el-card class="bottomCard">
      <div class="electricUseChart" v-show="this.watchChoose !== '2'" ref="electricUseChart" id="electricUseChart"></div>
      <div class="electricUseChartMany" v-if="this.watchChoose == '2'" ref="electricUseChartMany" id="electricUseChartMany"></div>
    </el-card>
  </div>
</template>

<script>
import eventActionDefine from "./components/msgCompConfig";
import { queryAmmeterLevelOneList, queryAmmeterInfo } from "./api/asset";
import { RadioButton, RadioGroup, Radio, DatePicker, Select, Option, Button, Table, TableColumn, Card } from "element-ui";
import Vue from "vue";
import Utils from "./utils";
import moment from "moment";
import "./index.css";
Vue.use(RadioGroup);
Vue.use(RadioButton);
Vue.use(Radio);
Vue.use(DatePicker);
Vue.use(Select);
Vue.use(Option);
Vue.use(Button);
Vue.use(Table);
Vue.use(TableColumn);
Vue.use(Card);

export default {
  //这里写组件英文名称，容器dom的id及事件中心命名均用到这个name，请认真填写
  name: "ButtonChange",
  props: {
    customConfig: Object,
    info: Object,
    eventBus: Object,
    //应用变量和系统变量 7.26 V8R4C50SPC220需求新加 之前版本取不到appVariables和sysVariables
    appVariables: Array,
    sysVariables: Array,
    //8.11 V8R4C60SPC100需求新加，之前版本取不到themeInfo
    themeInfo: Object,
  },
  computed: {
    theme() {
      let { theme_global_config } = this.themeInfo || {
        theme_global_config: {
          "--theme-public-pinPai-color": "rgba(24,144,255,1)",
          "--theme-public-text-color-1": "rgba(12, 13, 14,1)",
        },
      };

      let themeColor = theme_global_config["--theme-public-pinPai-color"];
      let textColor = theme_global_config["--theme-public-text-color-1"];
      this.$nextTick(() => {
        let style = `#${this.id} .el-radio-button__inner:hover{
                      color:${this.theme.themeColor};
                      }
                     #${this.id} .el-radio-button.is-active .el-radio-button__inner:hover{
                      color: #FFF;
                      }
                      `;
        if (this.$refs[this.id]) {
          this.styleEle = document.createElement("style");
          document.head.appendChild(this.styleEle);
          this.styleEle.innerText = style;
        }
      });
      return {
        themeColor,
        textColor,
      };
    },
  },
  data() {
    return {
      //必需，不可删除
      id: "",
      //业务代码
      dateChoose: "1",
      watchChoose: "0",
      yearPicker: new Date(),
      monPicker: new Date(),
      selectData: {
        ammeter_level_one: "all",
        ammeter_name: "全部",
      },
      unitSelectData: {
        value: "0",
        label: "电量Kwh",
      },
      options: [],
      unitOptions: [
        {
          value: "0",
          label: "电量Kwh",
        },
        {
          value: "1",
          label: "百分比",
        },
      ],
      tableData: [],
      // tableHeaderDay: [
      //   {
      //     name: "0时",
      //     props: "0时",
      //   },
      //   {
      //     name: "1时",
      //     props: "1时",
      //   },
      //   {
      //     name: "2时",
      //     props: "2时",
      //   },
      //   {
      //     name: "3时",
      //     props: "3时",
      //   },
      //   {
      //     name: "4时",
      //     props: "4时",
      //   },
      //   {
      //     name: "5时",
      //     props: "5时",
      //   },
      //   {
      //     name: "6时",
      //     props: "6时",
      //   },
      //   {
      //     name: "7时",
      //     props: "7时",
      //   },
      //   {
      //     name: "8时",
      //     props: "8时",
      //   },
      //   {
      //     name: "9时",
      //     props: "9时",
      //   },
      //   {
      //     name: "10时",
      //     props: "10时",
      //   },
      //   {
      //     name: "11时",
      //     props: "11时",
      //   },
      //   {
      //     name: "12时",
      //     props: "12时",
      //   },
      //   {
      //     name: "13时",
      //     props: "13时",
      //   },
      //   {
      //     name: "14时",
      //     props: "14时",
      //   },
      //   {
      //     name: "15时",
      //     props: "15时",
      //   },
      //   {
      //     name: "16时",
      //     props: "16时",
      //   },
      //   {
      //     name: "17时",
      //     props: "17时",
      //   },
      //   {
      //     name: "18时",
      //     props: "18时",
      //   },
      //   {
      //     name: "19时",
      //     props: "19时",
      //   },
      //   {
      //     name: "20时",
      //     props: "20时",
      //   },
      //   {
      //     name: "21时",
      //     props: "21时",
      //   },
      //   {
      //     name: "22时",
      //     props: "22时",
      //   },
      //   {
      //     name: "23时",
      //     props: "23时",
      //   },
      //   {
      //     name: "24时",
      //     props: "24时",
      //   },
      // ],
      tableHeaderMon: [
        {
          name: "1日",
          props: "1日",
        },
        {
          name: "2日",
          props: "2日",
        },
        {
          name: "3日",
          props: "3日",
        },
        {
          name: "4日",
          props: "4日",
        },
        {
          name: "5日",
          props: "5日",
        },
        {
          name: "6日",
          props: "6日",
        },
        {
          name: "7日",
          props: "7日",
        },
        {
          name: "8日",
          props: "8日",
        },
        {
          name: "9日",
          props: "9日",
        },
        {
          name: "10日",
          props: "10日",
        },
        {
          name: "11日",
          props: "11日",
        },
        {
          name: "12日",
          props: "12日",
        },
        {
          name: "13日",
          props: "13日",
        },
        {
          name: "14日",
          props: "14日",
        },
        {
          name: "15日",
          props: "15日",
        },
        {
          name: "16日",
          props: "16日",
        },
        {
          name: "17日",
          props: "17日",
        },
        {
          name: "18日",
          props: "18日",
        },
        {
          name: "19日",
          props: "19日",
        },
        {
          name: "20日",
          props: "20日",
        },
        {
          name: "21日",
          props: "21日",
        },
        {
          name: "22日",
          props: "22日",
        },
        {
          name: "23日",
          props: "23日",
        },
        {
          name: "24日",
          props: "24日",
        },
        {
          name: "25日",
          props: "25日",
        },
        {
          name: "26日",
          props: "26日",
        },
        {
          name: "27日",
          props: "27日",
        },
        {
          name: "28日",
          props: "28日",
        },
        {
          name: "29日",
          props: "29日",
        },
        {
          name: "30日",
          props: "30日",
        },
        {
          name: "31日",
          props: "31日",
        },
      ],
      tableHeaderYear: [
        {
          name: "0月",
          props: "0月",
        },
        {
          name: "1月",
          props: "1月",
        },
        {
          name: "2月",
          props: "2月",
        },
        {
          name: "3月",
          props: "3月",
        },
        {
          name: "4月",
          props: "4月",
        },
        {
          name: "5月",
          props: "5月",
        },
        {
          name: "6月",
          props: "6月",
        },
        {
          name: "7月",
          props: "7月",
        },
        {
          name: "8月",
          props: "8月",
        },
        {
          name: "9月",
          props: "9月",
        },
        {
          name: "10月",
          props: "10月",
        },
        {
          name: "11月",
          props: "11月",
        },
        {
          name: "12月",
          props: "12月",
        },
      ],
      headerData: [],
      company: "",
      regional: "",
      park: "",
      selectInfo: {},
      getRowKeys(row) {
        return row.ammeter_name;
      },
    };
  },
  watch: {
    appVariables: {
      handler: function (val, oldVal) {
        console.log(val, oldVal);
      },
      deep: true,
      immediate: true,
    },
  },
  mounted() {
    this.eventBus.on((newProps) => {
      newProps.appVariables?.forEach((item, index) => {
        if (item.name == this.customConfig.应用变量公司) {
          if (item.default_value !== this.selectInfo.company) {
            this.selectInfo.company = item.default_value;
            this.selectInfo.regional = item.default_value;
            this.selectInfo.park = item.default_value;
            if (!item.default_value) {
              this.sysVariables.forEach((itemSon, indexSon) => {
                if (itemSon.name == "current_office_id") {
                  this.selectInfo.company = itemSon.default_value;
                  this.selectInfo.regional = itemSon.default_value;
                  this.selectInfo.park = itemSon.default_value;
                }
              });
            }
            this.searchTableData();
          }
        }
      });
      this.queryAmmeterLevelOneList();
      console.log(newProps, 468);
    });
    this.getParams();
    this.monPicker = moment(new Date()).format("YYYY-MM");
    this.yearPicker = moment(new Date()).format("YYYY");

    this.queryAmmeterLevelOneList();
    // this.electricUseChartMany();
    //用于注册事件定义，不可删除
    let { componentId } = this.customConfig || {};
    componentId && window.componentCenter?.register(componentId, "comp", this, eventActionDefine);
    let { id } = this.customConfig;
    let componentName = this.$vnode.tag.split("-").pop().toLowerCase();
    this.id = id ? `secondary_${componentName}_${id}` : `secondary_${componentName}_${Utils.generateUUID()}`;
    //用于定义接收用户输入
    //业务代码
  },
  methods: {
    queryAmmeterLevelOneList() {
      this.selectData = { ammeter_level_one: "all", ammeter_name: "全部" };
      queryAmmeterLevelOneList(this.selectInfo).then((res) => {
        this.options = this.unique(res.data);
        this.options.unshift({
          ammeter_level_one: "all",
          ammeter_name: "全部",
        });
        this.searchTableData();
      });
    },
    unique(arr1) {
      const res = new Map();
      return arr1.filter((item) => !res.has(item.ammeter_level_one) && res.set(item.ammeter_level_one, 1));
    },
    getParams() {
      this.appVariables?.forEach((item, index) => {
        if (item.name == this.customConfig.应用变量公司) {
          this.selectInfo.company = item.default_value;
          if (!item.default_value) {
            this.sysVariables.forEach((itemSon, indexSon) => {
              if (itemSon.name == "current_office_id") {
                this.selectInfo.company = itemSon.default_value;
              }
            });
          }
        }
        if (item.name == this.customConfig.应用变量大区) {
          this.selectInfo.regional = item.default_value;
          if (!item.default_value) {
            this.sysVariables.forEach((itemSon, indexSon) => {
              if (itemSon.name == "current_office_id") {
                this.selectInfo.regional = itemSon.default_value;
              }
            });
          }
        }
        if (item.name == this.customConfig.应用变量园区) {
          this.selectInfo.park = item.default_value;
          if (!item.default_value) {
            this.sysVariables.forEach((itemSon, indexSon) => {
              if (itemSon.name == "current_office_id") {
                this.selectInfo.park = itemSon.default_value;
              }
            });
          }
        }
      });
      this.selectInfo.asset_id = this.customConfig.表资产id;
    },
    monLeft() {
      this.monPicker = moment(moment(this.monPicker, "YYYY-MM").format()).subtract(1, "month").startOf("month").format("YYYY-MM");
      this.searchTableData();
      this.$nextTick(() => {
        this.$refs.table.doLayout();
      });
    },
    monRight() {
      this.monPicker = moment(moment(this.monPicker, "YYYY-MM").format()).add(1, "month").startOf("month").format("YYYY-MM");
      this.searchTableData();
      this.$nextTick(() => {
        this.$refs.table.doLayout();
      });
    },
    yearLeft() {
      this.yearPicker = (Number(this.yearPicker) - 1).toString();
      this.searchTableData();
      this.$nextTick(() => {
        this.$refs.table.doLayout();
      });
    },
    yearRight() {
      this.yearPicker = (Number(this.yearPicker) + 1).toString();
      this.searchTableData();
      this.$nextTick(() => {
        this.$refs.table.doLayout();
      });
    },
    electricUseChart(y1Data, y2Data, y1Name, y2Name) {
      const myChart = this.$echarts.init(this.$refs.electricUseChart);
      let option = {
        tooltip: {
          trigger: "axis",
          axisPointer: {
            type: "cross",
            label: {
              backgroundColor: "#6a7985",
            },
          },
        },
        grid: {
          left: "0%",
          right: "2%",
          bottom: "0%",
          show: false,
          backgroundColor: "#fff",
          containLabel: true,
        },

        xAxis: [
          {
            axisLine: {
              show: true,
              lineStyle: {
                color: "#DDDDDD",
              },
            },
            axisLabel: {
              //x轴文字的配置
              show: true,
              textStyle: {
                color: "#999999",
              },
            },
            type: "category",
            boundaryGap: false,
            data: this.headerData,
          },
        ],
        yAxis: [
          {
            axisLine: {
              show: false,
            },
            type: "value",
            splitLine: {
              show: true,
              lineStyle: {
                type: "dashed",
              },
            },
            axisLabel: {
              //x轴文字的配置
              show: true,
              textStyle: {
                color: "#999999",
              },
            },
          },
        ],
        series: [
          {
            name: y1Name,
            type: "line",
            z: 0,
            symbolSize: "5",
            symbol: "circle",
            itemStyle: {
              normal: {
                color: "rgba(177, 126, 50, 1)",
                lineStyle: {
                  color: "#E9DBC6",
                },
              },
            },

            legendHoverLink: false,
            areaStyle: {
              origin: "start",
              //normal: {
              color: "#F7F2EB",
              opacity: 1,
              width: 4,
              shadowColor: "#E9DBC6",
              //}
            },
            data: y1Data,
          },
          {
            name: y2Name,
            z: 0,
            type: "line",
            symbolSize: "5",
            symbol: "circle",
            itemStyle: {
              normal: {
                color: "rgba(177, 126, 50, 1)",
                lineStyle: {
                  color: "#E9DBC6",
                },
              },
            },
            legendHoverLink: false,
            areaStyle: {
              origin: "start",
              // normal: {
              color: "#fff",
              opacity: 1,
              shadowColor: "#fff",
              //}
            },
            data: y2Data,
          },
        ],
      };
      myChart.setOption(option, true);
      function debounce(func, ms = 1000) {
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
      const task = () => {
        console.log("resize");
        myChart.resize();
      };
      const debounceTask = debounce(task, 1000);
      window.addEventListener("resize", debounceTask);
    },
    electricUseChartMany(seriesInfo, y1Data, y2Data) {
      const myChart = this.$echarts.init(this.$refs.electricUseChartMany);
      myChart.resize();
      let option = {
        backgroundColor: "#fff",
        tooltip: {
          trigger: "axis",
          backgroundColor: "#fff",
          textStyle: {
            color: "#000",
          },
        },
        grid: {
          left: "0%",
          right: "2%",
          bottom: "0%",
          show: false,
          backgroundColor: "#fff",
          containLabel: true,
        },
        xAxis: [
          {
            type: "category",
            axisLine: {
              show: true,
              lineStyle: {
                color: "#DDDDDD",
              },
            },
            splitLine: {
              show: false,
            },
            axisLabel: {
              margin: 10,
              textStyle: {
                color: "#000",
              },
            },
            boundaryGap: false,
            data: this.headerData,
          },
        ],
        yAxis: [
          {
            type: "value",
            splitNumber: 4,
            splitLine: {
              show: true,
              lineStyle: {
                type: "dashed",
              },
            },
            axisLine: {
              show: false,
            },
            axisLabel: {
              show: true,
              margin: 20,
              formatter: "{value}",
            },
            axisTick: {
              show: false,
            },
          },
        ],
        series: seriesInfo,
      };
      myChart.setOption(option, true);
      function debounce(func, ms = 1000) {
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
      const task = () => {
        console.log("resize");
        myChart.resize();
      };
      const debounceTask = debounce(task, 1000);
      window.addEventListener("resize", debounceTask);
    },
    watchChooseChange(val) {
      this.searchTableData();
      if (val == 2) {
        this.electricUseChartMany();
      }
      this.$nextTick(() => {
        this.$refs.table.doLayout();
      });
    },
    dateChange(val) {
      this.$nextTick(() => {
        this.$refs.table.doLayout();
      });
    },
    searchTableData() {
      console.log(this.appVariables);
      let message2 = {
        dateType: this.dateChoose,
        tableType: this.watchChoose,
        dateTime: this.dateChoose == "1" ? this.monPicker : this.yearPicker,
        ammeter_level_one: this.selectData.ammeter_level_one,
        type: this.unitSelectData.value,
      };
      queryAmmeterInfo(this.selectInfo, message2).then((resp) => {
        let y1Data = [];
        let y2Data = [];
        let y1Name = "";
        let y2Name = "";
        this.tableData = [];
        this.headerData = [];
        resp.data.forEach((item, index) => {
          if (index == 0) {
            y1Name = item.ammeter_name;
          }
          if (index == 1) {
            y2Name = item.ammeter_name;
          }
          if(this.watchChoose == 0 && this.selectData.ammeter_level_one !== "all"&&index == 1){
            y1Name=item.ammeter_name;
          }
          let message = {};
          if (item.data.length > 0) {
            item.data.forEach((element) => {
              if (element.time && this.headerData.indexOf(element.time) == -1) {
                this.headerData.push(element.time);
                y1Data.push(element.electric_power);
              }

              if (index == 1) {
                y2Data.push(element.electric_power);
              }
              message.ammeter_name = item.ammeter_name;
              message[element.time] = element.electric_power;
            });
            this.tableData.push(message);
          }
        });
        if (this.watchChoose == 2) {
          let info = [];
          this.$refs.table.clearSelection();
          this.tableData.forEach((item) => {
            if (item.ammeter_name == "二级表-末端表总损耗") {
              this.$refs.table.toggleRowSelection(item, true);
              info.push(item);
            }
          });
          this.handleSelectionChange(info);
        }
        if (this.watchChoose == 0 && this.selectData.ammeter_level_one !== "all") {
          y2Name = "二级表总用电";
          if (this.unitSelectData.value == 1) {
            y2Data.forEach((item, index) => {
              y1Data[index] = item - ((item * Number(y1Data[index].toString().replace("%", ""))) / 100).toFixed(0);
            });
            this.electricUseChart(y2Data, y1Data, y1Name, y2Name);
          } else {
            y2Data.forEach((item, index) => {
              y1Data[index] = item - y1Data[index];
            });
            this.electricUseChart(y2Data, y1Data, y1Name, y2Name);
          }
        } else {
          this.electricUseChart(y1Data, y2Data, y1Name, y2Name);
        }
        console.log(y1Data, y2Data, y1Name, y2Name);
        // this.electricUseChart(y1Data, y2Data);
      });
    },

    handleSelectionChange(val) {
      let info = JSON.parse(JSON.stringify(val))
      var result = [];
      var obj = {};
      for (var i = 0; i < info.length; i++) {
        if (!obj[info[i].ammeter_name]) {
          result.push(info[i]);
          obj[info[i].ammeter_name] = true;
        }
      }
      let seriesInfo = [];
      result.forEach((item, index) => {
        let message = {
          data: [],
          type: "line",
        };
        for (let k in item) {
          if (k !== "ammeter_name") {
            item[k] = item[k].toString().replace("%", "");
            message.data.push(item[k]);
          } else {
            message.name = item[k];
          }
        }
        seriesInfo.push(message);
      });
      this.electricUseChartMany(seriesInfo);
      this.multipleSelection = val;
    },
    /**
     * 触发事件 必需，不可删除
     * @param {String} eventName 事件名
     * @param {Array} payload 事件传参
     *
     */
    triggerEvent(eventName, payload) {
      let { componentId, appId } = this.customConfig || {};
      componentId && appId && window.eventCenter?.triggerEvent(componentId, eventName, payload);
    },
    //必需，不可删除
    Event_Center_getName() {
      return this.id;
    },
    //与msgCompConfig.js文件actions相对应，组件动作，依据定义加上do_message前缀
    do_EventCenter_setValue(value) {
      this.setValue(value);
    },
    setValue(value) {
      this.selected = value;
    },
  },
  destroyed() {
    //必需，不可删除
    window.componentCenter?.removeInstance(this.customConfig?.componentId);
    //业务代码，不需要记得清除
    document.head.removeChild(this.styleEle);
  },
};
</script>
<style lang="less" scoped>
.bigTitle {
  font-weight: 600;
  font-size: 20px;
  line-height: 32px;
}
.dateChooseBox {
  display: inline-flex;
  .dateChooseBoxLeft {
    cursor: pointer;
    margin-left: 22px;
    height: 32px;
    width: 30px;
    box-sizing: border-box;
    margin-bottom: 1px;
    border-radius: 4px;
    border: 1px solid #dcdfe6;
    border-right: 0px;
    line-height: 28px;
    text-align: right;
  }
  .dateChooseBoxRight {
    cursor: pointer;
    margin-left: 95px;
    height: 32px;
    width: 30px;
    box-sizing: border-box;
    margin-bottom: 1px;
    border-radius: 4px;
    border: 1px solid #dcdfe6;
    border-left: 0px;
    line-height: 28px;
    text-align: left;
  }
}
.choose_Box {
  margin: 16px 0;
  .dateChoose {
    /deep/.el-radio-button__inner {
      width: 56px;
    }
    /deep/.is-active span {
      background: #0454f2;
    }
  }
  .watchChoose {
    margin-left: 25%;
    /deep/.el-radio-button__inner {
      width: 136px;
    }
    /deep/.is-active span {
      background: #0454f2;
    }
  }
  .selectPicker {
    position: absolute;
    width: 145px;
    margin-left: 13%;
  }
  .yearDataPicker,
  .monDataPicker {
    position: absolute;
    margin-left: 50px;
    width: 100px;
    border-left: 0px;
    border-right: 0px;
    /deep/.el-input__inner {
      padding: 0;
      text-align: center;
      border-left: 0px;
      border-right: 0px;
      border-radius: 0;
      &:focus {
        border-color: #dcdfe6;
      }
      &:hover {
        border-color: #dcdfe6;
      }
    }
    /deep/.el-input__prefix,
    /deep/.el-input__suffix {
      display: none;
    }
  }
  .searchButton {
    float: right;
    width: 90px;
    height: 32px;
    margin-left: 24px;
    background: #0454f2;
    color: #fff;
    border-radius: 4px;
  }
}
.topCard {
  max-height: 48%;
  /deep/.el-card__body {
    height: 100%;
  }
}
.bottomCard {
  height: 400px;
  /deep/.el-card__body {
    height: 100%;
  }
}
.bottomCard {
  margin-top: 30px;
  .electricUseChart,
  .electricUseChartMany {
    height: 90%;
    width: 100%;
  }
}
.useTable {
  border: 1px solid #dadde5;
  background: #ffffff;
  border-radius: 4px;
  /deep/.el-table__cell {
    border: 0px;
  }
}
</style>
