<template>
  <div class="secondary_bigscreen zdfyjgtj" :style="{
  width: '1485px',
  height: '100%',
}" ref="bigscreen" :id="id">
    <div class="topTitltExport">
      <div>
        <div class="topXieImg"></div>
        <span>&nbsp;&nbsp;&nbsp;无人机频次统计表</span>
      </div>
      <el-button plain class="plainButton" @click="tableToExcel(dataALl)">导出</el-button>
    </div>
    <div>
      <span class="selectSpan">所在省份</span>
      <el-select popper-class="inputSelectBacPoper" v-model="provinceSelect" placeholder="请选择" class="inputSelectBac"
        :disabled="Boolean(province)" @change="changeProvince" value-key="province_id" style="width: 120px"
        size="small">
        <el-option v-for="item in provinceOption" :key="item.province_id" :label="item.province_name" :value="item">
        </el-option>
      </el-select>
      <span class="selectSpan">所在市</span>
      <el-select size="small" v-model="citySelect" :disabled="Boolean(city)" popper-class="inputSelectBacPoper"
        placeholder="请选择" class="inputSelectBac" @change="changeCity" value-key="city_id" style="width: 120px">
        <el-option v-for="item in cityOption" :key="item.city_id" :label="item.city_name" :value="item"> </el-option>
      </el-select>
      <span class="selectSpan">站点名称</span>
      <el-select size="small" v-model="stationSelect" popper-class="inputSelectBacPoper" placeholder="请选择"
        :disabled="Boolean(substationName)" class="inputSelectBac" @change="changeStation" value-key="substation_no"
        style="width: 120px">
        <el-option v-for="item in stationOption" :key="item.substation_no" :label="item.substation_name" :value="item">
        </el-option>
      </el-select>
      <span class="selectSpan">重点目标等级</span>
      <el-select size="small" v-model="levelSelect" popper-class="inputSelectBacPoper" placeholder="请选择"
        class="inputSelectBac" value-key="value" style="width: 120px">
        <el-option v-for="item in levelOption" :key="item.value" :label="item.label" :value="item"> </el-option>
      </el-select>
      <span class="selectSpan">巡检日期</span>
      <el-date-picker v-model="searchDate" popper-class="inputSelectBacPoper" type="daterange" class="inputSelectBac"
        style="width: 210px" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期"
        value-format="yyyy-MM-dd" size="small">
      </el-date-picker>
      <el-button plain class="searchReload" @click="searchTable">查询</el-button>
      <el-button plain class="searchReload" @click="reloadSearch">重置</el-button>
    </div>
    <el-table :data="tableData" stripe max-height="600px"
      :header-cell-style="{ color: '#fff', background: 'linear-gradient(0deg, #235B80 0%, #27536F 100%)', fontSize: '12px', border: 'unset' }"
      style="width: 100%; margin-top: 16px; margin-bottom: 10px">
      <el-table-column type="index" width="50" label="序号"> </el-table-column>
      <el-table-column prop="province" label="所在省份" width="100"> </el-table-column>
      <el-table-column prop="city" label="所在市区" width="100"> </el-table-column>
      <el-table-column prop="level" label="重点目标等级" width="100"> </el-table-column>
      <el-table-column prop="substationName" label="站点名称">
        <template slot-scope="scope">
          <el-tooltip class="item" effect="dark" :content="scope.row.substationName" placement="top">
            <div class="tooltip_table">{{ scope.row.substationName }}</div>
          </el-tooltip>
        </template>
      </el-table-column>
      <el-table-column prop="uavType" label="无人机类型" width="100"> </el-table-column>
      <el-table-column prop="count" label="出现频次" width="100"> </el-table-column>
      <el-table-column prop="successCount" label="防御成功次数" width="100"> </el-table-column>
      <el-table-column prop="successRate" label="防御成功率(%)" width="100"> </el-table-column>
      <el-table-column prop="happenTimeFirst" label="首次发生时间" width="160"> </el-table-column>
      <el-table-column prop="happenTimeLast" label="最后发生时间" width="160"> </el-table-column>
    </el-table>
    <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange"
      :current-page="pageObj.currentPage" :page-sizes="[5, 10, 20, 50]" :page-size="pageObj.pageSize" background
      popper-class="inputSelectBacPoper" layout="sizes, total, prev, pager, next, jumper" :total="pageObj.total">
    </el-pagination>
  </div>
</template>

<script>
import MsgCompConfig from "./msgCompConfig.js";
import Utils from "@/utils/index.js";
import { queryDropDownBox, stationFlawStatistics } from "../../api/asset";
import { RadioButton, Tooltip, RadioGroup, Table, TableColumn, Pagination, Input, DatePicker, Select, Option } from "element-ui";
import Vue from "vue";
import "./index.css";
Vue.use(RadioGroup);
Vue.use(RadioButton);
Vue.use(Table);
Vue.use(TableColumn);
Vue.use(Pagination);
Vue.use(Input);
Vue.use(DatePicker);
Vue.use(Select);
Vue.use(Option);
Vue.use(Tooltip);
export default {
  name: "Main",
  components: {},
  data() {
    return {
      id: "",
      pageSize: 5,
      total: 0,
      pageNo: 1,
      searchDate: [],
      tableData: [],
      planInput: "",
      levelOption: [
        {
          value: "1",
          label: "一级",
        },
        {
          value: "2",
          label: "二级",
        },
        {
          value: "3",
          label: "三级",
        },
      ],
      dataAll: [],
      levelSelect: {},
      provinceOption: [],
      provinceData: [],
      provinceSelect: {},
      cityOption: [],
      cityData: [],
      citySelect: {},
      stationOption: [],
      stationData: [],
      stationSelect: {},
      city: '',
      substationName: '',
      province: '',
      pageObj: { currentPage: 1, pageSize: 10, total: null },
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
      this.stationData = this.stationOption;

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
    }).catch(err => {
      this.stationOption = [
        {
          "city_name": "北京市",
          "province_id": 11,
          "substation_no": "1258812588001",
          "substation_level": "1",
          "substation_name": "北京市一级变电站",
          "concat": "11011258812588001",
          "province_name": "北京市",
          "city_id": 1101
        },
        {
          "city_name": "南京市",
          "province_id": 32,
          "substation_no": "320100",
          "substation_level": "1",
          "substation_name": "南京市一级变电站",
          "concat": "3201320100",
          "province_name": "江苏省",
          "city_id": 3201
        },
        {
          "city_name": "滁州市",
          "province_id": 34,
          "substation_no": "2",
          "substation_level": "1",
          "substation_name": "安徽滁州一级变电站",
          "concat": "34112",
          "province_name": "安徽省",
          "city_id": 3411
        },
        {
          "city_name": "揭阳市",
          "province_id": 44,
          "substation_no": "p0Lx8TI3mpOr3",
          "substation_level": "1",
          "substation_name": "揭阳市变电站",
          "concat": "4452p0Lx8TI3mpOr3",
          "province_name": "广东省",
          "city_id": 4452
        }
      ]
      this.provinceOption = [
        {
          "city_name": "北京市",
          "province_id": 11,
          "substation_no": "1258812588001",
          "substation_level": "1",
          "substation_name": "北京市一级变电站",
          "concat": "11011258812588001",
          "province_name": "北京市",
          "city_id": 1101
        },
        {
          "city_name": "南京市",
          "province_id": 32,
          "substation_no": "320100",
          "substation_level": "1",
          "substation_name": "南京市一级变电站",
          "concat": "3201320100",
          "province_name": "江苏省",
          "city_id": 3201
        },
        {
          "city_name": "滁州市",
          "province_id": 34,
          "substation_no": "2",
          "substation_level": "1",
          "substation_name": "安徽滁州一级变电站",
          "concat": "34112",
          "province_name": "安徽省",
          "city_id": 3411
        },
        {
          "city_name": "揭阳市",
          "province_id": 44,
          "substation_no": "p0Lx8TI3mpOr3",
          "substation_level": "1",
          "substation_name": "揭阳市变电站",
          "concat": "4452p0Lx8TI3mpOr3",
          "province_name": "广东省",
          "city_id": 4452
        }
      ]
      this.cityOption = [
        {
          "city_name": "北京市",
          "province_id": 11,
          "substation_no": "1258812588001",
          "substation_level": "1",
          "substation_name": "北京市一级变电站",
          "concat": "11011258812588001",
          "province_name": "北京市",
          "city_id": 1101
        },
        {
          "city_name": "南京市",
          "province_id": 32,
          "substation_no": "320100",
          "substation_level": "1",
          "substation_name": "南京市一级变电站",
          "concat": "3201320100",
          "province_name": "江苏省",
          "city_id": 3201
        },
        {
          "city_name": "滁州市",
          "province_id": 34,
          "substation_no": "2",
          "substation_level": "1",
          "substation_name": "安徽滁州一级变电站",
          "concat": "34112",
          "province_name": "安徽省",
          "city_id": 3411
        },
        {
          "city_name": "揭阳市",
          "province_id": 44,
          "substation_no": "p0Lx8TI3mpOr3",
          "substation_level": "1",
          "substation_name": "揭阳市变电站",
          "concat": "4452p0Lx8TI3mpOr3",
          "province_name": "广东省",
          "city_id": 4452
        }
      ]
      this.provinceData = this.provinceOption;
      this.cityData = this.cityOption;
      this.stationData = this.stationOption;
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
    this.searchTable();
    this.pubSub &&
      this.pubSub.subscribe("updateChart" + this.componentId, (data) => {
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
      });
    window.componentCenter?.register && window.componentCenter.register(this.componentId, "comp", this, MsgCompConfig);
    this.updateProcess && this.updateProcess();
    let id = this.options?.externalVariables?.id;
    this.id = id ? `secondary_analyzer_${id}` : `secondary_bigscreen_${Utils.generateUUID()}`;
  },
  methods: {

    oneFixed(row, column, cellValue, index) {
      // console.log(row, column, cellValue, '=============ds');
      return row.total == 0 ? '--' : Number(cellValue).toFixed(2) + '%'
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
    levelFn(row, column, cellValue, index) {
      const levelTemp = ['一级', '二级', '三级']
      let res = levelTemp[cellValue - 1]
      return res
    },
    changeProvince(val) {
      console.log(val);
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
    reloadSearch() {
      if (!this.province) this.provinceSelect = {};
      if (!this.city) this.citySelect = {};
      if (!this.substationName) this.stationSelect = {};
      if (!this.province) {
        this.provinceOption = this.provinceData;
        this.cityOption = this.cityData;
        this.stationOption = this.stationData;
      }

      this.levelSelect = {};
      this.searchDate = [];

      this.pageSize = 5;
      this.pageNo = 1;
      this.total = 0;
      this.searchTable();
    },
    changeStation(val) { },
    searchTable() {
      let message = {
        province: this.provinceSelect?.province_id || this.province || "", //省
        city: this.citySelect?.city_id || this.city || "", //市
        substationName: this.stationSelect?.substation_name || this.substationName || "", //电站名称
        level: this.levelSelect.value || "1", //等级
        startTime: this.searchDate[0] || "",
        endTime: this.searchDate[1] || "",
        // pageSize: this.pageSize || "", //页面数据条数  数字
        // pageNo: this.pageNo || "", //页码  数字
      };
      stationFlawStatistics(message).then((res) => {
        this.dataAll = JSON.parse(JSON.stringify(res.data))
        this.dataAll.forEach((item, index) => {
          item.successRate = item.count == 0 ? '--' : Number(item.successRate * 100).toFixed(2)
        });
        this.pageObj.currentPage = 1
        this.tableData = this.dataAll.slice(0, this.pageObj.currentPage * this.pageObj.pageSize)
        // console.log(this.tableData, '======a');
        this.pageObj.total = this.dataAll.length;
      });
    },
    tableToExcel(tableData) {
      const headArr = Object.keys(tableData[0]); // 要导出的json数据 // 列标题
      let str = "<tr>";
      const levelTemp = ['一级', '二级', '三级']
      headArr[0] = "province";
      headArr[1] = "city";
      headArr[2] = "level";
      headArr[3] = "substationName";
      headArr[4] = "uavType";
      headArr[5] = "count";
      headArr[6] = "successCount";
      headArr[7] = "successRate";
      headArr[8] = "happenTimeFirst";
      headArr[9] = "happenTimeLast";
      headArr.forEach((item, index) => {
        switch (item) {
          case "province":
            item = "所在省份";
            break;
          case "city":
            item = "所在市区";
            break;
          case "level":
            item = "重点目标等级";
            break;
          case "substationName":
            item = "站点名称";
            break;
          case "uavType":
            item = "无人机类型";
            break;
          case "count":
            item = "出现频次";
            break;
          case "successCount":
            item = "防御成功次数";
            break;
          case "successRate":
            item = "防御成功率(%)";
            break;
          case "happenTimeFirst":
            item = "首次发生时间";
            break;
          case "happenTimeLast":
            item = "最后发生时间";
            break;
        }
        str += index == headArr.length - 1 ? `<td>${item}</td></tr>` : `<td>${item}</td>`;
      }); // 循环遍历，每行加入tr标签，每个单元格加td标签
      for (let i = 0; i < tableData.length; i++) {
        str += "<tr>";
        for (const key of headArr) {
          // 增加\t为了不让表格显示科学计数法或者其他格式
          str += `<td>${tableData[i][key] || '' + "\t"}</td>`;
        }
        str += "</tr>";
      } // Worksheet名
      const worksheet = "Sheet1";
      const uri = "data:application/vnd.ms-excel;base64,"; // 下载的表格模板数据

      const template = `<html
             xmlns:o="urn:schemas-microsoft-com:office:office" 
             xmlns:x="urn:schemas-microsoft-com:office:excel"
        xmlns="http://www.w3.org/TR/REC-html40">
      <head> <!--[if gte mso 9]><xml><x:ExcelWorkbook><x:ExcelWorksheets><x:ExcelWorksheet>
          <x:Name>${worksheet}</x:Name>
          <x:WorksheetOptions><x:DisplayGridlines/></x:WorksheetOptions></x:ExcelWorksheet>
          </x:ExcelWorksheets></x:ExcelWorkbook></xml><![endif]--> </head>
    <body><table style="vnd.ms-excel.numberformat:@" >${str}</table></body>
      </html>`;// 下载模板 // 输出base64编码
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
      a.download = "站点缺陷统计表" + ".xls";
      a.click();
    },
    formatDate(row) {
      const date = new Date(row);
      const Y = date.getFullYear() + ".";
      const M = date.getMonth() + 1 + ".";
      const D = date.getDate() + " ";
      const h = (date.getHours() + ":").padStart(3, "0");
      const m = (date.getMinutes() + ":").padStart(3, "0");
      const s = (date.getSeconds() + "").padStart(2, "0");
      return Y + M + D + h + m + s;
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
    // handleSizeChange(val) {
    //   console.log(`每页 ${val} 条`);
    //   this.pageSize = val;
    //   this.searchTable();
    // },
    // handleCurrentChange(val) {
    //   console.log(`当前页: ${val}`);
    //   this.pageNo = val;
    //   this.searchTable();
    // },
    Event_Center_getName: () => {
      return this.id;
    },
  },
};
</script>
<style lang="less" scoped>
.topTitltExport {
  display: flex;
  justify-content: space-between;
  height: 40px;
  margin-bottom: 20px;

  div {
    display: flex;
  }

  .topXieImg {
    height: 22px;
    width: 50px;
    background: no-repeat url("../../../pluginTemp/images/xiegang.png");
    margin-top: 12px;
  }

  span {
    color: #fff;
    line-height: 40px;
    font-size: 16px;
    font-weight: 600;
  }
}

.selectSpan {
  color: #d0deee;
  margin-right: 10px;
  margin-left: 15px;
  font-size: 12px;

  &:first-child {
    margin-left: 0px;
  }
}

.inputSelectBac {
  background: linear-gradient(180deg, rgba(8, 57, 87, 0.7) 0%, rgba(9, 24, 39, 0.7) 100%) !important;

  /deep/.el-input__inner,
  /deep/.el-range-input {
    background: linear-gradient(180deg, rgba(8, 57, 87, 0.7) 0%, rgba(9, 24, 39, 0.7) 100%) !important;
    color: #fff;
    font-size: 12px;
  }

  /deep/.is-disabled .el-input__inner {
    color: #666666;

  }

  /deep/ .is-disabled .el-input__inner::-webkit-input-placeholder {
    color: #666666;
  }
}

.plainButton {
  width: 80px;
  height: 32px;
  padding: 8px 20px;
  border-radius: 2px;
  border-color: #2bdde8;
  color: #fff;
  background: linear-gradient(178.39deg, #148fff 1.01%, #5bdeda 98.25%);

  &:hover {
    border-color: #2bdde8 !important;
    color: #fff !important;
    background: linear-gradient(178.39deg, #148fff 1.01%, #5bdeda 98.25%) !important;
  }

  &:focus {
    border-color: #2bdde8 !important;
    color: #fff !important;
    background: linear-gradient(178.39deg, #148fff 1.01%, #5bdeda 98.25%) !important;
  }
}

/deep/.el-button {
  span {
    font-size: 12px !important;
  }
}

.searchReload {
  border-radius: 2px;
  width: 80px;
  height: 32px;
  padding: 8px 20px;
  color: #fff;
  border-color: #2bdde8;
  margin-left: 15px;
  background: linear-gradient(174.13deg, rgba(20, 143, 255, 0.3) 25.38%, rgba(21, 246, 238, 0.5) 94.06%);

  &:hover {
    border-color: #2bdde8 !important;
    color: #fff !important;
    background: linear-gradient(174.13deg, rgba(20, 143, 255, 0.3) 25.38%, rgba(21, 246, 238, 0.5) 94.06%) !important;
  }

  &:focus {
    border-color: #2bdde8 !important;
    color: #fff !important;
    background: linear-gradient(174.13deg, rgba(20, 143, 255, 0.3) 25.38%, rgba(21, 246, 238, 0.5) 94.06%) !important;
  }
}

/deep/.el-range-separator {
  color: #fff !important;
  padding: 0px !important;
  width: 10% !important;
}

.tooltip_table {
  overflow: hidden;

  white-space: nowrap;

  text-overflow: ellipsis;
}

/deep/.el-table th.el-table__cell.is-leaf,
/deep/.el-table td.el-table__cell,
.el-table th.el-table__cell.is-leaf {
  border: 0px;
}

/deep/.el-table__row {
  background: #08314c;
  color: #fff;

  .el-table__cell:first-child {
    border-left: 2px solid #08314c;
  }

  .el-table__cell:last-child {
    border-right: 2px solid #08314c !important;
  }
}

/deep/.el-table--striped .el-table__body tr.el-table__row--striped td.el-table__cell {
  background: transparent;
  border-bottom: #18486c 1px solid;
  border-top: #4192d9 1px solid;
}

/deep/.el-table__body {
  background: linear-gradient(90deg, rgba(37, 61, 84, 1) 20%, rgba(68, 117, 111, 1) 100%);
}

/deep/.el-table,
.el-table__expanded-cell {
  background: transparent;
}

/deep/.el-table__row--striped {
  background: linear-gradient(90deg, rgba(37, 61, 84, 1) 20%, rgba(68, 117, 111, 1) 100%);
}

/deep/.el-table--striped .el-table__body tr.el-table__row--striped td.el-table__cell:last-child {
  border-right: 2px solid #215884 !important;
}

/deep/.el-table--striped .el-table__body tr.el-table__row--striped td.el-table__cell:first-child {
  border-left: 2px solid #215884 !important;
}

/deep/.el-table tbody tr:hover>td {
  background-color: #08314c !important;
}

/deep/.el-pagination {
  display: flex;
  justify-content: end;
}

/deep/.el-pagination__total {
  color: #fff;
}

/deep/.number {
  color: #fff !important;
}

/deep/.el-pagination__jump {
  color: #fff !important;
}

/deep/.el-input__inner {
  border-color: #117abc !important;
  font-size: 12px !important;
}

/deep/.el-pagination span,
/deep/.el-pagination li {
  font-size: 12px !important;
}

/deep/.el-pagination.is-background .btn-next,
.el-pagination.is-background .btn-prev,
.el-pagination.is-background .el-pager li {}

/deep/.el-pager li {
  background: linear-gradient(180deg, #147570 0%, rgba(8, 57, 87, 0.7) 25.12%, rgba(8, 57, 87, 0.0001) 49.98%, rgba(8, 57, 87, 0.7) 73.41%, #005954 100%) !important;
  border: 1px solid rgba(35, 163, 255, 0.6) !important;
}

/deep/.el-pager .active {
  background: linear-gradient(180deg,
      rgba(21, 246, 238, 0.5) 0%,
      rgba(21, 154, 255, 0.5) 25.12%,
      rgba(21, 154, 255, 0.2) 49.98%,
      rgba(21, 154, 255, 0.5) 73.41%,
      rgba(21, 246, 238, 0.5) 100%) !important;
}

/deep/.btn-prev,
/deep/.btn-next {
  display: none;
}

.el-table::before {
  height: 0px;
}

/deep/.el-table__header-wrapper {
  height: 36px;
}

/deep/.el-table__header-wrapper {
  .el-table__cell {
    padding: 6px 0;
  }
}

/deep/.el-table__header-wrapper {
  tr {
    background: linear-gradient(0deg, #235b80 0%, #27536f 100%) !important;
  }
}

/deep/.el-table__body-wrapper {
  .el-table__cell {
    height: 44px !important;
    padding: 10px 0;

    div {
      font-size: 12px !important;
    }
  }
}

/deep/.el-date-editor--daterange {
  padding: 3px 6px;
}

/deep/.el-date-editor .el-range-separator {
  background: linear-gradient(180deg, rgba(8, 57, 87, 0.7) 0%, rgba(9, 24, 39, 0.7) 100%) !important;
}

.el-popper[x-placement^="bottom"] .popper__arrow {
  border-bottom-color: rgba(21, 154, 255, 0.7);
}

.el-popper[x-placement^="bottom"] .popper__arrow::after {
  border-bottom-color: rgba(21, 154, 255, 0.7);
}

.el-select-dropdown__item {
  color: #99afcc;
}

.el-select-dropdown__item.hover,
.el-select-dropdown__item:hover {
  background: linear-gradient(270deg, rgba(91, 222, 218, 0.3) -7.2%, rgba(23, 82, 101, 0.5) 100%) !important;
  color: #d0deee;
}

/deep/.el-pagination input {
  color: #fff !important;
  background: linear-gradient(180deg, #147570 0%, rgba(8, 57, 87, 0.7) 25.12%, rgba(8, 57, 87, 0.0001) 49.98%, rgba(8, 57, 87, 0.7) 73.41%, #005954 100%);
}
</style>
<style>
/* .inputSelectBacPoper .el-select-dropdown__list,
.inputSelectBacPoper .el-picker-panel__content {
  background: linear-gradient(180deg, rgba(8, 57, 87, 0.9) 0%, rgba(9, 24, 39, 0.9) 100%) !important;
}

.inputSelectBacPoper .el-picker-panel {
  border: 0px;
}

.inputSelectBacPoper {
  border: 1px solid rgba(21, 154, 255, 0.7) !important;
}

.inputSelectBacPoper .available {
  color: #99afcc;
}

.inputSelectBacPoper .popper__arrow::after,
.inputSelectBacPoper .popper__arrow {
  border-bottom-color: rgba(21, 154, 255, 0.7) !important;
}

.inputSelectBacPoper .in-range div {
  background: rgb(51, 125, 150) !important;
}

.inputSelectBacPoper .el-select-dropdown__item.hover,
.inputSelectBacPoper .el-select-dropdown__item:hover {
  background: linear-gradient(270deg, rgba(91, 222, 218, 0.3) -7.2%, rgba(23, 82, 101, 0.5) 100%);
  color: #d0deee;
} */


.inputSelectBacPoper {
  background: linear-gradient(180deg, rgba(8, 57, 87, 0.9) 0%, rgba(9, 24, 39, 0.9) 100%) !important;
  border: 1px solid rgba(21, 154, 255, 0.7) !important;
  color: #fff !important;

}

.inputSelectBacPoper .in-range div {
  background: linear-gradient(rgba(20, 143, 255, 0.3) 25.38%, rgba(21, 246, 238, 0.5) 94.06%)
}

.inputSelectBacPoper .el-date-table td.end-date span {
  background-color: none !important;
}

.inputSelectBacPoper .el-date-table td.start-date span {
  background-color: none !important;
}


.inputSelectBacPoper .el-picker-panel__icon-btn {
  color: #fff;
}

.inputSelectBacPoper.el-popper[x-placement^=bottom] .popper__arrow {
  border-bottom-color: rgba(21, 154, 255, 0.7);
}

.inputSelectBacPoper.el-popper[x-placement^=bottom] .popper__arrow::after {
  border-bottom-color: rgba(21, 154, 255, 0.7);
}

.inputSelectBacPoper .el-select-dropdown__item {
  color: #99AFCC;
}

.inputSelectBacPoper .el-select-dropdown__item.hover,
.el-select-dropdown__item:hover {
  background: linear-gradient(270deg, rgba(91, 222, 218, 0.3) -7.2%, rgba(23, 82, 101, 0.5) 100%);
  color: #D0DEEE;

}
</style>