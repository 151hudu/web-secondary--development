<template>
  <!-- 定义外层容器标识，宽高百分百 不可删除 -->
  <div :id="identification" style="width: 100%; height: 100%" :ref="identification">
    <div class="main">
      <div class="top_Title" style="position: relative">
        <span>光伏自发自用电费结算明细单</span>
        <el-button style="position: absolute; top: 10px; right: 160px" v-if="mainEdit == 0" type="primary" size="small" @click="saveTable">保存</el-button>
        <el-button style="position: absolute; top: 10px; right: 100px" v-if="mainEdit == 0" type="primary" size="small" @click="exportExcel">导出</el-button>
      </div>
      <div class="top_Info">
        <div style="width: 300px">发电单位：{{ this.excelAllData.generating_unit }}</div>
        <div></div>
        <div></div>
        <div></div>
        <div></div>
        <div></div>
        <div></div>
        <div style="width: 300px">电站名称：{{ this.excelAllData.station_name }}</div>
        <div></div>
        <div></div>
        <div></div>
        <div></div>
        <div></div>
        <div></div>
        <div></div>
        <div></div>
        <div></div>
        <div></div>
        <div></div>
        <div></div>
        <div class="div_Right"></div>
      </div>
      <div class="top_Info2">
        <div style="width: 500px">用电单位：{{ this.excelAllData.electricity_user }}</div>
        <div></div>
        <div></div>
        <div></div>
        <div></div>
        <div style="width: 300px">用电类型：{{ this.excelAllData.power_type }}</div>
        <div></div>
        <div></div>
        <div></div>
        <div></div>
        <div></div>
        <div></div>
        <div></div>
        <div></div>
        <div></div>
        <div></div>
        <div></div>
        <div></div>
        <div class="div_Right"></div>
      </div>
      <div class="topTable">
        <el-table :data="tableDataTop" border show-summary :summary-method="getTopSummaries" :header-cell-style="{ background: '#DCE6F1', color: 'black' }">
          <el-table-column align="center" prop="dnbmc" label="电能表名称" width="150"> </el-table-column>
          <el-table-column align="center" prop="jjlx" label="计量类型" width="150"> </el-table-column>
          <el-table-column align="center" prop="dnbbl" label="电能表倍率" width="100"> </el-table-column>
          <el-table-column align="center" prop="user_code" label="客户编号" width="200"> </el-table-column>
          <el-table-column align="center" prop="bjzc_no" label="表记资产号" width="200"> </el-table-column>
          <el-table-column align="center" prop="jl_code" label="计量编号" width="200"> </el-table-column>
          <el-table-column align="center" label="光伏发电量" width="300">
            <el-table-column align="center" prop="poweroutput_last" label="上期正向有功" width="100">
              <template slot-scope="scope">
                <template v-if="mainEdit == 0">
                  <template v-if="scope.row.jjlx == '发电并网表'">
                    <input type="number" @input="InputChange" style="width: 89%" v-if="!scope.row.poweroutput_last" v-model="scope.row.poweroutput_last" />
                    <span v-if="scope.row.poweroutput_last">{{ scope.row.poweroutput_last }}</span>
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
                  (scope.row.poweroutput_all = (Number(scope.row.poweroutput_now) - Number(scope.row.poweroutput_last)) * Number(scope.row.dnbbl)).toFixed(2)
                }}</span>
              </template>
            </el-table-column>
          </el-table-column>
          <el-table-column align="center" label="光伏上网电量" width="300">
            <el-table-column align="center" prop="swdl_last" label="上期反向有功" width="100">
              <template slot-scope="scope">
                <template v-if="mainEdit == 0">
                  <template v-if="scope.row.jjlx == '上网关口表（反向）'">
                    <input v-if="!scope.row.swdl_last" v-model="scope.row.swdl_last" style="width: 89%" type="number" @input="InputChange" />
                    <span v-if="scope.row.swdl_last">{{ scope.row.swdl_last }}</span>
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
                  (scope.row.swdl_all = (Number(scope.row.swdl_now) - Number(scope.row.swdl_last)) * Number(scope.row.dnbbl)).toFixed(2)
                }}</span>
              </template>
            </el-table-column>
          </el-table-column>
          <el-table-column align="center" prop="zfzydl_all" label="自发自用电量" width="200"> </el-table-column>
          <el-table-column align="center" prop="frezz_time" :formatter="formatDate" label="抄表日期" width="300"> </el-table-column>
          <el-table-column align="center" prop="beizhu" label="备注" width="400"> </el-table-column>
        </el-table>
      </div>
      <div class="bottomTable">
        <el-table
          :data="tableDataBottom"
          border
          class="bottomTable"
          show-summary
          :summary-method="getBottomSummaries"
          :header-cell-style="{ background: '#DCE6F1', color: 'black' }"
        >
          <el-table-column align="center" prop="jl_name" label="计量点" width="150"> </el-table-column>
          <el-table-column align="center" prop="price_avg" :render-header="renderheader" label="平均电价|（元/kwh）" width="150">
            <template slot-scope="scope">
              <span style="display: none">{{ (scope.row.price_avg = (Number(scope.row.fees_all) / Number(scope.row.poweruse_all)).toFixed(9)) }}</span>
              <span>{{ isNaN(scope.row.price_avg) || scope.row.price_avg == Infinity ? "0" : Number(scope.row.fees_all).toFixed(9) }}</span>
            </template>
          </el-table-column>
          <el-table-column align="center" label="总" width="200">
            <el-table-column align="center" prop="poweruse_all" :render-header="renderheader" label="用量|（kwh）" width="100">
              <template slot-scope="scope">
                <span>{{
                  (scope.row.poweruse_all = Number(scope.row.poweruse_j) + Number(scope.row.poweruse_f) + Number(scope.row.poweruse_p) + Number(scope.row.poweruse_g))
                }}</span>
              </template>
            </el-table-column>
            <el-table-column align="center" prop="fees_all" :render-header="renderheader" label="电费|（kwh）" width="100">
              <template slot-scope="scope">
                <span>{{ (scope.row.fees_all = (Number(scope.row.fees_j) + Number(scope.row.fees_f) + Number(scope.row.fees_p) + Number(scope.row.fees_g)).toFixed(2)) }}</span>
              </template>
            </el-table-column>
          </el-table-column>
          <el-table-column align="center" label="尖" width="500">
            <el-table-column align="center" prop="lastnum_j" label="上期结存数" width="100">
              <template slot-scope="scope">
                <input v-if="mainEdit == 0 && !scope.row.lastnum_j" v-model="scope.row.lastnum_j" style="width: 89%" type="number" @input="InputChange" />
                <span v-else>{{ scope.row.lastnum_j }}</span>
              </template>
            </el-table-column>
            <el-table-column align="center" prop="nownum_j" label="本期结存数" width="100">
              <template slot-scope="scope">
                <input v-if="mainEdit == 0" v-model="scope.row.nownum_j" style="width: 89%" type="number" @input="InputChange" />
                <span v-else>{{ scope.row.nownum_j }}</span>
              </template>
            </el-table-column>
            <el-table-column align="center" prop="poweruse_j" :render-header="renderheader" label="用量|(kwh）" width="100">
              <template slot-scope="scope">
                <span>{{ (scope.row.poweruse_j = ((Number(scope.row.nownum_j) - Number(scope.row.lastnum_j)) * Number(scope.row.dnbbl)).toFixed(2)) }}</span>
              </template>
            </el-table-column>
            <el-table-column align="center" prop="price_j" :render-header="renderheader" label="电价|（元/kwh）" width="100">
              <template slot-scope="scope">
                <span>{{ Number(scope.row.price_j).toFixed(5) }}</span>
              </template>
            </el-table-column>
            <el-table-column align="center" prop="fees_j" :render-header="renderheader" label="电费|（元）" width="100">
              <template slot-scope="scope">
                <span>{{ (scope.row.fees_j = (Number(scope.row.price_j) * Number(scope.row.poweruse_j)).toFixed(2)) }}</span>
              </template>
            </el-table-column>
          </el-table-column>
          <el-table-column align="center" label="峰" width="500">
            <el-table-column align="center" prop="lastnum_f" label="上期结存数" width="100">
              <template slot-scope="scope">
                <input v-if="mainEdit == 0 && !scope.row.lastnum_f" v-model="scope.row.lastnum_f" style="width: 89%" type="number" @input="InputChange" />
                <span v-else>{{ scope.row.lastnum_f }}</span>
              </template>
            </el-table-column>
            <el-table-column align="center" prop="nownum_f" label="本期结存数" width="100">
              <template slot-scope="scope">
                <input v-if="mainEdit == 0" v-model="scope.row.nownum_f" style="width: 89%" type="number" @input="InputChange" />
                <span v-else>{{ scope.row.nownum_f }}</span>
              </template>
            </el-table-column>
            <el-table-column align="center" prop="poweruse_f" :render-header="renderheader" label="用量|（kwh）" width="100">
              <template slot-scope="scope">
                <span>{{ (scope.row.poweruse_f = ((Number(scope.row.nownum_f) - Number(scope.row.lastnum_f)) * Number(scope.row.dnbbl)).toFixed(2)) }}</span>
              </template></el-table-column
            >
            <el-table-column align="center" prop="price_f" :render-header="renderheader" label="电价|（元/kwh）" width="100">
              <template slot-scope="scope">
                <span>{{ Number(scope.row.price_f).toFixed(5) }}</span>
              </template>
            </el-table-column>
            <el-table-column align="center" prop="fees_f" :render-header="renderheader" label="电费|（元）" width="100">
              <template slot-scope="scope">
                <span>{{ (scope.row.fees_f = (Number(scope.row.price_f) * Number(scope.row.poweruse_f)).toFixed(2)) }}</span>
              </template>
            </el-table-column>
          </el-table-column>
          <el-table-column align="center" label="平" width="400">
            <el-table-column align="center" prop="lastnum_p" label="上期结存数" width="100">
              <template slot-scope="scope">
                <input v-if="mainEdit == 0 && !scope.row.lastnum_p" v-model="scope.row.lastnum_p" style="width: 89%" type="number" @input="InputChange" />
                <span v-else>{{ scope.row.lastnum_p }}</span>
              </template>
            </el-table-column>
            <el-table-column align="center" prop="nownum_p" label="本期结存数" width="100">
              <template slot-scope="scope">
                <input v-if="mainEdit == 0" v-model="scope.row.nownum_p" style="width: 89%" type="number" @input="InputChange" />
                <span v-else>{{ scope.row.nownum_p }}</span>
              </template>
            </el-table-column>
            <el-table-column align="center" prop="poweruse_p" :render-header="renderheader" label="用量|（kwh）" width="100">
              <template slot-scope="scope">
                <span>{{ (scope.row.poweruse_p = ((Number(scope.row.nownum_p) - Number(scope.row.lastnum_p)) * Number(scope.row.dnbbl)).toFixed(2)) }}</span>
              </template>
            </el-table-column>
            <el-table-column align="center" prop="price_p" :render-header="renderheader" label="电价|（元/kwh）" width="100">
              <template slot-scope="scope">
                <span>{{ Number(scope.row.price_p).toFixed(5) }}</span>
              </template>
            </el-table-column>
            <el-table-column align="center" prop="fees_p" :render-header="renderheader" label="电费|（元）" width="100">
              <template slot-scope="scope">
                <span>{{ (scope.row.fees_p = (Number(scope.row.price_p) * Number(scope.row.poweruse_p)).toFixed(2)) }}</span>
              </template>
            </el-table-column>
          </el-table-column>
          <el-table-column align="center" label="谷" width="400">
            <el-table-column align="center" prop="lastnum_g" label="上期结存数" width="100">
              <template slot-scope="scope">
                <input v-if="mainEdit == 0 && !scope.row.lastnum_g" v-model="scope.row.lastnum_g" style="width: 89%" type="number" @input="InputChange" />
                <span v-else>{{ scope.row.lastnum_g }}</span>
              </template>
            </el-table-column>
            <el-table-column align="center" prop="nownum_g" label="本期结存数" width="100">
              <template slot-scope="scope">
                <input v-if="mainEdit == 0" v-model="scope.row.nownum_g" style="width: 89%" type="number" @input="InputChange" />
                <span v-else>{{ scope.row.nownum_g }}</span>
              </template>
            </el-table-column>
            <el-table-column align="center" prop="poweruse_g" :render-header="renderheader" label="用量|（kwh）" width="100">
              <template slot-scope="scope">
                <span>{{ (scope.row.poweruse_g = ((Number(scope.row.nownum_g) - Number(scope.row.lastnum_g)) * Number(scope.row.dnbbl)).toFixed(2)) }}</span>
              </template>
            </el-table-column>
            <el-table-column align="center" prop="price_g" :render-header="renderheader" label="电价|（元/kwh）" width="100">
              <template slot-scope="scope">
                <span>{{ Number(scope.row.price_g).toFixed(5) }}</span>
              </template>
            </el-table-column>
            <el-table-column align="center" prop="fees_g" :render-header="renderheader" label="电费|（元）" width="100">
              <template slot-scope="scope">
                <span>{{ (scope.row.fees_g = (Number(scope.row.price_g) * Number(scope.row.poweruse_g)).toFixed(2)) }}</span>
              </template>
            </el-table-column>
          </el-table-column>
        </el-table>
      </div>
    </div>
  </div>
</template>

<script>
import eventActionDefine from "./components/msgCompConfig";
import { RadioButton, RadioGroup } from "element-ui";
import Vue from "vue";
import { queryDataDetail, saveData, queryViewTableInfo, exportTempleDetailData } from "././api/asset";
import utils from "@/utils";
import $ from "jquery";
import "./index.less";
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
      selected: "",
      buttons: [],
      data_id: "",
      defaultValue: "",
      styleEle: null,
      mainEdit: "",
      excelAllData: {},
      //组件数据
      tableDataTop: [],
      tableDataBottom: [],
      tableData: [],
    };
  },
  mounted() {
    let message = {
      form_id: this.GetQueryString("form_id"),
      id: this.GetQueryString("data_id"),
    };
    queryDataDetail(message).then((res) => {
      for (let k in res.data.childData[0]) {
        this.tableData = res.data.childData[0][k];
      }
      this.excelAllData = res.data;
      this.tableData = this.tableData.sort((a, b) => {
        return a.show_rank - b.show_rank;
      });
      this.tableDataTop = JSON.parse(JSON.stringify(this.tableData));
      this.tableDataBottom = JSON.parse(JSON.stringify(this.tableData));
      this.tableDataBottom.forEach((item, index) => {
        if (item.jjlx == "上网关口表（反向）") {
          this.tableDataBottom.splice(index, 1);
          index - 1;
        }
      });
      this.mainEdit = this.excelAllData.edit_flag;
    });
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
    handleValueChange(value) {
      this.triggerEvent("valueChange", {
        value,
      });
    },
    exportExcel() {
      if (this.excelAllData.zfzydl_all !== this.excelAllData.poweruse_all) {
        return this.$message({
          message: "自发自用电量不匹配",
          type: "error",
        });
      } else {
        let message = {
          view_id: this.GetQueryString("view_id"),
        };
        queryViewTableInfo(message).then((res) => {
          let message2 = {
            template_id: res.data.queryColumn.formViewDetailButtons[0].exportTemplates[0].id,
            view_id: res.data.filters.defaultFilter.id,
            form_id: this.GetQueryString("form_id"),
            export_type: 1,
          };
          let message3 = {
            queryParams: [{ colName: "data_id", type: 0, value: this.GetQueryString("id") }],
          };
          exportTempleDetailData(message2, message3)
            .then((res) => {
              if (res.status == 200) {
                window.open(window.location.origin + res.data, "_self");
              }
            })
            .catch((error) => {
              return this.$message({
                message: "导出失败",
                type: "error",
              });
            });
        });
      }
    },
    InputChange() {
      console.log(this.tableData);
    },
    saveTable() {
      if (this.excelAllData.zfzydl_all == this.excelAllData.poweruse_all) {
        return this.$message({
          message: "自发自用电量不匹配",
          type: "error",
        });
      } else {
        this.tableDataTop.forEach((item, index) => {
          this.tableDataBottom.forEach((itemSon, indexSon) => {
            if (item.data_id == itemSon.data_id) {
              item.jl_name = JSON.parse(JSON.stringify(itemSon.jl_name));
              item.price_avg = JSON.parse(JSON.stringify(itemSon.price_avg));
              item.poweruse_all = JSON.parse(JSON.stringify(itemSon.poweruse_all));
              item.fees_all = JSON.parse(JSON.stringify(itemSon.fees_all));
              item.lastnum_j = JSON.parse(JSON.stringify(itemSon.lastnum_j));
              item.nownum_j = JSON.parse(JSON.stringify(itemSon.nownum_j));
              item.poweruse_j = JSON.parse(JSON.stringify(itemSon.poweruse_j));
              item.price_j = JSON.parse(JSON.stringify(itemSon.price_j));
              item.fees_j = JSON.parse(JSON.stringify(itemSon.fees_j));
              item.lastnum_f = JSON.parse(JSON.stringify(itemSon.lastnum_f));
              item.nownum_f = JSON.parse(JSON.stringify(itemSon.nownum_f));
              item.poweruse_f = JSON.parse(JSON.stringify(itemSon.poweruse_f));
              item.price_f = JSON.parse(JSON.stringify(itemSon.price_f));
              item.fees_f = JSON.parse(JSON.stringify(itemSon.fees_f));
              item.lastnum_p = JSON.parse(JSON.stringify(itemSon.lastnum_p));
              item.nownum_p = JSON.parse(JSON.stringify(itemSon.nownum_p));
              item.poweruse_p = JSON.parse(JSON.stringify(itemSon.poweruse_p));
              item.price_p = JSON.parse(JSON.stringify(itemSon.price_p));
              item.fees_p = JSON.parse(JSON.stringify(itemSon.fees_p));
              item.lastnum_g = JSON.parse(JSON.stringify(itemSon.lastnum_g));
              item.nownum_g = JSON.parse(JSON.stringify(itemSon.nownum_g));
              item.poweruse_g = JSON.parse(JSON.stringify(itemSon.poweruse_g));
              item.price_g = JSON.parse(JSON.stringify(itemSon.price_g));
              item.fees_g = JSON.parse(JSON.stringify(itemSon.fees_g));
            }
          });
        });
        for (let k in this.excelAllData.childData[0]) {
          this.excelAllData.childData[0][k] = this.tableDataTop;
        }
        let message = {
          form_id: this.GetQueryString("form_id"),
          id: this.GetQueryString("data_id"),
        };
        saveData(message, this.excelAllData)
          .then((res) => {
            if (res.status == 200) {
              return this.$message({
                message: "更新成功",
                type: "success",
              });
            }
          })
          .catch((error) => {
            return this.$message({
              message: "更新失败",
              type: "error",
            });
          });
      }
    },
    getTopSummaries(param) {
      const { columns, data } = param;
      const sums = [];
      columns.forEach((column, index) => {
        if (index === 0) {
          sums[index] = "合计";
          return;
        }
        if (index == 2 || index == 3 || index == 4 || index == 5 || index == 6 || index == 7 || index == 9 || index == 10 || index == 13 || index == 14) {
          sums[index] = "";
          return;
        }
        const values = data.map((item) => Number(item[column.property]));
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
      sums[8] = Number(sums[8]).toFixed(2);
      sums[11] = Number(sums[11]).toFixed(2);
      this.excelAllData.poweroutput_all = sums[8];
      this.excelAllData.swdl_all = sums[11];
      this.excelAllData.zfzydl_all = sums[12];
      return sums;
    },
    getBottomSummaries(param) {
      const { columns, data } = param;
      const sums = [];
      columns.forEach((column, index) => {
        if (index === 0) {
          sums[index] = "合计";
          return;
        }
        if (
          index == 1 ||
          index == 4 ||
          index == 5 ||
          index == 7 ||
          index == 9 ||
          index == 10 ||
          index == 12 ||
          index == 14 ||
          index == 15 ||
          index == 17 ||
          index == 19 ||
          index == 20 ||
          index == 22
        ) {
          sums[index] = " ";
          return;
        }
        const values = data.map((item) => Number(item[column.property]));
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
      this.excelAllData.poweruse_all = sums[2];
      this.excelAllData.fees_all = sums[3];
      this.excelAllData.poweruse_j = sums[6];
      this.excelAllData.fees_j = sums[8];
      this.excelAllData.poweruse_f = sums[11];
      this.excelAllData.fees_f = sums[13];
      this.excelAllData.poweruse_p = sums[16];
      this.excelAllData.fees_p = sums[18];
      this.excelAllData.poweruse_g = sums[21];
      this.excelAllData.fees_g = sums[23];
      sums[2] = Number(sums[2]).toFixed(2);
      sums[3] = Number(sums[3]).toFixed(2);
      sums[6] = Number(sums[6]).toFixed(2);
      sums[8] = Number(sums[8]).toFixed(2);
      sums[11] = Number(sums[11]).toFixed(2);
      sums[13] = Number(sums[13]).toFixed(2);
      sums[16] = Number(sums[16]).toFixed(2);
      sums[18] = Number(sums[18]).toFixed(2);
      sums[21] = Number(sums[21]).toFixed(2);
      sums[23] = Number(sums[23]).toFixed(2);
      console.log(sums);
      return sums;
    },
    formatDate(row) {
      let date = new Date(row["frezz_time"]);
      console.log(date);
      console.log(row);
      console.log(row["frezz_time"]);
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
  width: 2500px;
  .top_Title {
    width: 2500px;
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
    width: 2500px;
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
