<template>
  <!-- 定义外层容器标识，宽高百分百 不可删除 -->
  <div :id="identification" style="width: 100%; height: 100%" :ref="identification">
    <!-- -->
    <div class="main">
      <div class="top_Title" style="position: relative">
        <span>光伏自发自用电费结算明细单</span>
        <el-button style="position: absolute; top: 10px; right: 100px" type="primary" size="small" @click="exportExcel">导出</el-button>
      </div>
      <div class="top_Info">
        <div style="width: 400px; text-align: center">发电单位：{{ this.excelAllData.generating_unit }}</div>
        <div style="width: 400px; text-align: center">用电单位：{{ this.excelAllData.electricity_user }}</div>
        <div></div>
        <div style="width: 400px; text-align: center">电站名称：{{ this.excelAllData.power_station }}</div>
        <div></div>
        <div></div>
        <div style="width: 404px" class="div_Right">用电类型：{{ this.excelAllData.power_type }}</div>
      </div>
      <div class="topTable">
        <el-table :data="tableData" border show-summary :summary-method="getSummaries" :header-cell-style="{ background: '#DCE6F1', color: 'black' }">
          <el-table-column align="center" prop="dnbmc" label="电能表名称" width="150"> </el-table-column>
          <el-table-column align="center" prop="jjlx" label="计量类型" width="150"> </el-table-column>
          <el-table-column align="center" prop="dnbbl" label="电能表倍率" width="100"> </el-table-column>
          <el-table-column align="center" prop="user_code" label="户号" width="100"> </el-table-column>
          <el-table-column align="center" prop="bjzc_no" label="表记资产号" width="200"> </el-table-column>
          <el-table-column align="center" label="光伏发电量" width="300">
            <el-table-column align="center" prop="poweroutput_last" label="上期正向有功" width="100">
              <template slot-scope="scope">
                <template v-if="mainEdit == 0">
                  <template v-if="scope.row.jjlx == '发电并网表'">
                    <input type="number" @input="InputChange" style="width: 89%" v-if="scope.row.poweroutput_last_edit" v-model="scope.row.poweroutput_last" />
                    <span v-if="!scope.row.poweroutput_last_edit">{{ scope.row.poweroutput_last }}</span>
                  </template>
                </template>
                <span v-if="mainEdit !== 0 && scope.row.jjlx == '发电并网表'">{{ scope.row.poweroutput_last }}</span>
              </template>
            </el-table-column>
            <el-table-column align="center" prop="poweroutput_now" label="本期正向有功" width="100">
              <template slot-scope="scope">
                <template v-if="mainEdit == 0">
                  <template v-if="scope.row.jjlx == '发电并网表'">
                    <input type="number" @input="InputChange" style="width: 89%" v-model="scope.row.poweroutput_now" />
                  </template>
                </template>
                <span v-if="mainEdit !== 0 && scope.row.jjlx == '发电并网表'">{{ scope.row.poweroutput_now }}</span>
              </template>
            </el-table-column>
            <el-table-column align="center" prop="poweroutput_all" :render-header="renderheader" label="发电量|（kwh）" width="100">
              <template slot-scope="scope">
                <span v-if="scope.row.jjlx == '发电并网表'">{{
                  isNaN((scope.row.poweroutput_all = (Number(scope.row.poweroutput_now) - Number(scope.row.poweroutput_last)) * Number(scope.row.dnbbl)).toFixed(2))
                    ? (scope.row.poweroutput_all = 0)
                    : (scope.row.poweroutput_all = (Number(scope.row.poweroutput_now) - Number(scope.row.poweroutput_last)) * Number(scope.row.dnbbl)).toFixed(2)
                }}</span>
              </template>
            </el-table-column>
          </el-table-column>
          <el-table-column align="center" label="光伏上网电量" width="300">
            <el-table-column align="center" prop="swdl_last" label="上期反向有功" width="100">
              <template slot-scope="scope">
                <template v-if="mainEdit == 0">
                  <template v-if="scope.row.jjlx == '上网关口表（反向）'">
                    <input v-if="scope.row.swdl_last_edit" v-model="scope.row.swdl_last" style="width: 89%" type="number" @input="InputChange" />
                    <span v-if="!scope.row.swdl_last_edit">{{ scope.row.swdl_last }}</span>
                  </template>
                </template>
                <span v-if="mainEdit !== 0 && scope.row.jjlx == '上网关口表（反向）'">{{ scope.row.swdl_last }}</span>
              </template>
            </el-table-column>
            <el-table-column align="center" prop="swdl_now" label="本期反向有功" width="100">
              <template slot-scope="scope">
                <template v-if="mainEdit == 0">
                  <template v-if="scope.row.jjlx == '上网关口表（反向）'">
                    <input v-model="scope.row.swdl_now" style="width: 89%" type="number" @input="InputChange" />
                  </template>
                </template>
                <span v-if="mainEdit !== 0 && scope.row.jjlx == '上网关口表（反向）'">{{ scope.row.swdl_now }}</span>
              </template>
            </el-table-column>
            <el-table-column align="center" prop="swdl_all" :render-header="renderheader" label="上网电量|(kwh)" width="100">
              <template slot-scope="scope">
                <span v-if="scope.row.jjlx == '上网关口表（反向）'">{{
                  isNaN((scope.row.swdl_all = (Number(scope.row.swdl_now) - Number(scope.row.swdl_last)) * Number(scope.row.dnbbl)).toFixed(2))
                    ? (scope.row.swdl_all = 0)
                    : (scope.row.swdl_all = (Number(scope.row.swdl_now) - Number(scope.row.swdl_last)) * Number(scope.row.dnbbl)).toFixed(2)
                }}</span>
              </template>
            </el-table-column>
          </el-table-column>
          <el-table-column align="center" prop="zfzydl_all" :render-header="renderheader" label="自发自用电量|(kwh)" width="100"> </el-table-column>
          <el-table-column align="center" prop="price_all" :render-header="renderheader" label="电价|(元/kwh)" width="100"> </el-table-column>
          <el-table-column align="center" prop="fees_all" :render-header="renderheader" label="电费|(元)" width="100"> </el-table-column>
          <el-table-column align="center" prop="frezz_time" :formatter="formatDate" label="抄表日期" width="150"> </el-table-column>
          <el-table-column align="center" prop="beizhu" label="备注" width="154"> </el-table-column>
        </el-table>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button v-if="mainEdit == 0" type="primary" size="small" @click="saveTable">保存</el-button>
        <el-button v-if="mainEdit == 0" type="info" size="small" @click="getTableData">取消</el-button>
      </span>
    </div>
  </div>
</template>

<script>
import eventActionDefine from "./components/msgCompConfig";
import { RadioButton, RadioGroup } from "element-ui";
import { queryDataDetail, saveData, queryViewTableInfo, exportTempleDetailData, queryAll } from "././api/asset";
import Vue from "vue";
import utils from "@/utils";
import $ from "jquery";

Vue.use(RadioGroup);
Vue.use(RadioButton);

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
        let style = `#${this.identification} .el-radio-button__inner:hover{
                      color:${this.theme.themeColor};
                      }
                     #${this.identification} .el-radio-button.is-active .el-radio-button__inner:hover{
                      color: #FFF;
                      }
                      `;
        if (this.$refs[this.identification]) {
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
      identification: "",
      //业务代码
      //组件数据
      tableData: [],
      queryAllData: {},
      excelAllData: {},
      mainEdit: "",
      viewId: "",
    };
  },
  mounted() {
    queryAll().then((res) => {
      this.queryAllData = res.data;
      let message = res.data.excel_template_info.current_value.split("view_id=");
      this.viewId = message[1].split("&")[0];
      console.log(this.queryAllData.excel_template_info.current_value);
    });
    this.getTableData();
    //用于注册事件定义，不可删除
    let { componentId } = this.customConfig || {};
    componentId && window.componentCenter?.register(componentId, "comp", this, eventActionDefine);
    let { buttons, id } = this.customConfig;
    let componentName = this.$vnode.tag.split("-").pop().toLowerCase();
    this.identification = id ? `secondary_${componentName}_${id}` : `secondary_${componentName}_${utils.generateUUID()}`;
    //用于定义接收用户输入
    this.buttons = JSON.parse(buttons).data;
    this.defaultValue = JSON.parse(buttons).defaultValue;
    //业务代码
    if (this.defaultValue) {
      this.selected = this.defaultValue;
      this.triggerEvent("valueChange", {
        value: this.defaultValue,
      });
    }
  },
  methods: {
    exportExcel() {
      console.log(this.excelAllData.zfzydl_all, this.excelAllData.poweruse_all);
      let message = {
        view_id: this.viewId,
      };
      queryViewTableInfo(message).then((res) => {
        let message2 = this.queryAllData.excel_template_info.current_value;
        let message3 = {
          queryParams: [{ colName: "data_id", type: 0, value: this.GetQueryString("data_id") }],
        };
        exportTempleDetailData(message2, message3)
          .then((res) => {
            if (res.status == 200) {
              var filePath = window.location.origin + res.data + "?attname=光伏自发自用电费结算明细单.xlsx";
              const link = document.createElement("a");
              link.style.display = "none";
              link.href = filePath;
              link.setAttribute("download", name);
              document.body.appendChild(link);
              link.click();
              // console.log(fileUrl);
              // window.open(fileUrl);
            }
          })
          .catch((error) => {
            return this.$message({
              message: "导出失败",
              type: "error",
            });
          });
      });
    },
    getTableData() {
      let message = {
        form_id: this.GetQueryString("form_id"),
        id: this.GetQueryString("data_id"),
      };
      queryDataDetail(message).then((res) => {
        for (let k in res.data.childData[0]) {
          res.data.childData[0][k].forEach((item, index) => {
            if (!item.poweroutput_last) {
              item.poweroutput_last_edit = true;
            } else {
              item.poweroutput_last_edit = false;
            }
            if (!item.swdl_last) {
              item.swdl_last_edit = true;
            } else {
              item.swdl_last_edit = false;
            }
            // item.poweroutput_last = "";
            // item.poweroutput_now = "";
            if (!item.poweroutput_all) {
              item.poweroutput_all = "";
            }
            if (!item.swdl_all) {
              item.swdl_all = "";
            }
          });
          this.tableData = res.data.childData[0][k];
        }
        this.excelAllData = res.data;
        this.mainEdit = this.excelAllData.edit_flag;

        // this.mainEdit = 0;
      });
    },
    InputChange() {
      console.log(this.excelAllData);
    },
    saveTable() {
      let message = {
        form_id: this.GetQueryString("form_id"),
        id: this.GetQueryString("data_id"),
      };
      saveData(message, this.excelAllData)
        .then((res) => {
          if (res.status == 200) {
            this.$message({
              message: "更新成功",
              type: "success",
            });
            return this.getTableData();
          }
        })
        .catch((error) => {
          return this.$message({
            message: "更新失败",
            type: "error",
          });
        });
    },
    getSummaries(param) {
      const { columns, data } = param;
      const sums = [];
      columns.forEach((column, index) => {
        if (index === 0) {
          sums[index] = "合计";
          return;
        }
        if (index == 2 || index == 3 || index == 4 || index == 5 || index == 6 || index == 8 || index == 9 || index == 14 || index == 15) {
          sums[index] = "";
          return;
        }
        const values = data.map((item) => Number(item[column.property]));
        console.log(values);
        if (!values.every((value) => isNaN(value))) {
          sums[index] = values.reduce((prev, curr) => {
            const value = Number(curr);
            if (!isNaN(value)) {
              return prev + curr;
            } else {
              return prev;
            }
          }, 0);
          sums[index] += "";
        } else {
          sums[index] = "";
        }
      });
      console.log(columns, data);
      sums[7] = Number(sums[7]).toFixed(2);
      sums[10] = Number(sums[10]).toFixed(2);
      sums[11] = (Number(sums[7]).toFixed(2) - Number(sums[10]).toFixed(2)).toFixed(2);
      sums[12] = Number(this.excelAllData.price_all).toFixed(2);
      sums[13] = (Number(sums[11]) * Number(sums[12])).toFixed(2);
      this.excelAllData.poweroutput_all = sums[8];
      this.excelAllData.swdl_all = sums[11];
      this.excelAllData.zfzydl_all = sums[12];
      this.excelAllData.fees_all = sums[13];
      return sums;
    },
    myFixed(num, digit) {
      if (Object.is(parseFloat(num), NaN)) {
        // return console.log(`传入的值：${num}不是一个数字`);
        return "-";
      }
      num = parseFloat(num);
      return (Math.round((num + Number.EPSILON) * Math.pow(10, digit)) / Math.pow(10, digit)).toFixed(digit);
    },
    formatDate(row) {
      let date = new Date(row["frezz_time"]);
      let Y = date.getFullYear() + "-";
      let M = date.getMonth() + 1 < 10 ? "0" + (date.getMonth() + 1) + "-" : date.getMonth() + 1 + "-";
      let D = date.getDate() < 10 ? "0" + date.getDate() + " " : date.getDate() + " ";
      let h = date.getHours() < 10 ? "0" + date.getHours() + ":" : date.getHours() + ":";
      let m = date.getMinutes() < 10 ? "0" + date.getMinutes() + ":" : date.getMinutes() + ":";
      let s = date.getSeconds() < 10 ? "0" + date.getSeconds() : date.getSeconds();
      return Y + M + D + h + m + s;
    },
    // table表头换行
    renderheader(h, { column, $index }) {
      return h("span", {}, [h("span", {}, column.label.split("|")[0]), h("br"), h("span", {}, column.label.split("|")[1])]);
    },
    // 获取URL参数
    GetQueryString(name) {
      var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
      var r = window.location.search.substr(1).match(reg); //获取url中"?"符后的字符串并正则匹配
      var context = "";
      if (r != null) context = r[2];
      reg = null;
      r = null;
      return context == null || context == "" || context == "undefined" ? "" : context;
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
      return this.identification;
    },
    //与msgCompConfig.js文件actions相对应，组件动作，依据定义加上do_message前缀
    do_message_setValue(value) {
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
.main {
  height: 100%;
  width: 1900px;
  .top_Title {
    width: 1900px;
    height: 60px;
    text-align: center;
    span {
      line-height: 60px;
      font-size: 36px;
      font-family: "NSimSun" !important;
      font-weight: 700;
    }
  }
  .top_Info,
  .top_Info2 {
    width: 1900px;
    display: flex;
    div {
      box-sizing: border-box;
      padding: 0px;
      margin: 0px;
      width: 100px;
      line-height: 40px;
      height: 40px;
      border: 1px solid #c6cddf;
      border-right: 0px solid #c6cddf;
      display: inline-block;
    }
    .div_Right {
      border-right: 1px solid #c6cddf;
      text-align: center;
    }
  }
  .top_Info2 {
    div {
      border-top: 0px solid #c6cddf;
    }
  }

  .topTable {
    // width: calc(100% - 4px);
  }
  .topTable,
  .bottomTable {
    /deep/.el-table--border:after,
    /deep/.el-table--group:after,
    /deep/.el-table:before {
      background-color: black;
    }

    /deep/.el-table--border,
    /deep/.el-table--group {
      border-color: black;
      border-width: 1px;
    }

    /deep/.el-table td,
    /deep/.el-table th.is-leaf {
      border-color: black;
      border-width: 1px;
    }

    /deep/.el-table--border th,
    /deep/.el-table--border th.gutter:last-of-type {
      border-color: black;
      border-width: 1px;
    }

    /deep/.el-table--border td,
    /deep/.el-table--border th {
      border-color: black;
      border-width: 1px;
    }
    /* 表格不出现横向滚动条 */
    /deep/.el-table--scrollable-x .el-table__body-wrapper {
      overflow-x: hidden;
    }
    /deep/.el-table_1_column_7_column_8,
    /deep/.el-table_1_column_7_column_9,
    /deep/.el-table_1_column_11_column_12,
    /deep/.el-table_1_column_11_column_13 {
      font-size: 13px;
    }
    /deep/.has-gutter {
      td {
        background: #ffffff;
        font-weight: 700;
        color: black;
      }
    }
  }
  .bottomTable {
    margin-top: -1px;
  }
  .dialog-footer {
    float: right;
    margin-top: 10px;
    margin-right: 100px;
  }
}
</style>
<style>
input::-webkit-outer-spin-button,
input::-webkit-inner-spin-button {
  -webkit-appearance: none;
}
input[type="number"] {
  -moz-appearance: textfield;
}
</style>
