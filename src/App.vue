<template>
  <!-- 定义外层容器标识，宽高百分百 不可删除 -->
  <div :id="identification" style="width: 100%; height: 100%; background-color: #fff" :ref="identification">
    <div class="settlement-details">
      <div class="button-line">
        <img src="../pluginTemp/images/export.png" style="cursor: pointer" v-if="mainEdit == 0" @click="exportExcel" alt="" />
      </div>
      <div class="top_Title">光伏电费结算明细单</div>
      <div class="top_Info">
        <div style="width: 120px; color: #000" class="info-label">发电单位</div>
        <div style="width: 270px; color: #000">{{ this.excelAllData.generating_unit }}</div>
        <div style="width: 210px; color: #000" class="info-label">电站名称</div>
        <div style="width: 450px; color: #000">{{ this.excelAllData.station_name }}</div>
        <div style="width: 300px; color: #000" class="info-label">结算方式</div>
        <div style="width: calc(100% - 1350px); color: #000" class="div_Right">
          {{ this.excelAllData.settlement_type }}
        </div>
      </div>
      <div class="top_Info2">
        <div style="width: 120px; color: #000" class="info-label">用电单位</div>
        <div style="width: 270px; color: #000">{{ this.excelAllData.electricity_user }}</div>
        <div style="width: 210px; color: #000" class="info-label">用电类型</div>
        <div style="width: 450px; color: #000">{{ this.excelAllData.power_type }}</div>
        <div style="width: 300px; color: #000" class="info-label">
          {{ this.excelAllData.settlement_type === "分时电价" ? "折扣率" : "电价" }}
        </div>
        <div style="width: calc(100% - 1350px); color: #000" class="div_Right">
          {{
            this.excelAllData.settlement_type === "分时电价"
              ? this.excelAllData.discount_rate
                ? this.excelAllData.discount_rate + "%"
                : ""
              : this.excelAllData.fixed_tariff
              ? this.excelAllData.fixed_tariff + "元/kWh"
              : ""
          }}
        </div>
      </div>
      <div class="topTable">
        <el-table :data="tableDataTop" border show-summary :summary-method="getTopSummaries" :header-cell-style="headerCellStyle" :cell-style="cellStyle">
          <el-table-column prop="dnbmc" label="电能表名称" width="120" />
          <el-table-column prop="jjlx" label="计量类型" width="80" />
          <el-table-column prop="dnbbl" label="电能表倍率" width="95" />
          <el-table-column prop="user_code" label="客户编号" width="95" />
          <el-table-column prop="bjzc_no" label="表计资产号" width="210" />
          <el-table-column prop="jl_code" label="计量编号" width="150" />
          <el-table-column label="光伏发电量">
            <el-table-column prop="poweroutput_last" label="上期正向有功" width="100">
              <template slot-scope="scope">
                <template v-if="mainEdit == 0">
                  <template v-if="scope.row.jjlx == '发电并网表'">
                    <input type="number" @input="InputChange" style="width: 80%" v-if="scope.row.poweroutput_last == null" v-model="scope.row.poweroutput_last" />
                    <span v-if="scope.row.poweroutput_last">
                      {{ scope.row.poweroutput_last }}
                    </span>
                  </template>
                </template>
                <span v-if="mainEdit !== 0 && scope.row.jjlx == '发电并网表'">
                  {{ scope.row.poweroutput_last }}
                </span>
              </template>
            </el-table-column>
            <el-table-column prop="poweroutput_now" label="本期正向有功" width="100">
              <template slot-scope="scope">
                <template v-if="mainEdit == 0">
                  <template v-if="scope.row.jjlx == '发电并网表'">
                    <input type="number" @input="InputChange" style="width: 80%" v-model="scope.row.poweroutput_now" />
                  </template>
                </template>
                <span v-if="mainEdit !== 0 && scope.row.jjlx == '发电并网表'">
                  {{ scope.row.poweroutput_now }}
                </span>
              </template>
            </el-table-column>
            <el-table-column prop="poweroutput_all" label="发电量(kWh)" width="100">
              <template slot-scope="scope">
                <span v-if="scope.row.jjlx == '发电并网表'">
                  {{ (scope.row.poweroutput_all = (Number(scope.row.poweroutput_now) - Number(scope.row.poweroutput_last)) * Number(scope.row.dnbbl)).toFixed(2) }}
                </span>
              </template>
            </el-table-column>
          </el-table-column>
          <el-table-column label="光伏上网电量">
            <el-table-column prop="swdl_last" label="上期反向有功" width="100">
              <template slot-scope="scope">
                <template v-if="mainEdit == 0">
                  <template v-if="scope.row.jjlx == '上网关口表（反向）'">
                    <input v-if="scope.row.swdl_last == null" v-model="scope.row.swdl_last" style="width: 80%" type="number" @input="InputChange" />
                    <span v-if="scope.row.swdl_last">
                      {{ scope.row.swdl_last }}
                    </span>
                  </template>
                </template>
                <span v-if="mainEdit !== 0 && scope.row.jjlx == '上网关口表（反向）'">
                  {{ scope.row.swdl_last }}
                </span>
              </template>
            </el-table-column>
            <el-table-column prop="swdl_now" label="本期反向有功" width="100">
              <template slot-scope="scope">
                <template v-if="mainEdit == 0">
                  <template v-if="scope.row.jjlx == '上网关口表（反向）'">
                    <input v-model="scope.row.swdl_now" style="width: 80%" type="number" @input="InputChange" />
                  </template>
                </template>
                <span v-if="mainEdit !== 0 && scope.row.jjlx == '上网关口表（反向）'">
                  {{ scope.row.swdl_now }}
                </span>
              </template>
            </el-table-column>
            <el-table-column prop="swdl_all" label="上网电量(kWh)" width="100">
              <template slot-scope="scope">
                <span v-if="scope.row.jjlx == '上网关口表（反向）'">
                  {{ (scope.row.swdl_all = (Number(scope.row.swdl_now) - Number(scope.row.swdl_last)) * Number(scope.row.dnbbl)).toFixed(2) }}
                </span>
              </template>
            </el-table-column>
          </el-table-column>
          <el-table-column prop="zfzydl_all" :render-header="renderHeader" label="自发自用电量|(kWh)" width="160" />
          <el-table-column prop="frezz_time" :formatter="formatDate" label="抄表日期" />
          <el-table-column prop="beizhu" label="备注" />
        </el-table>
      </div>
      <div class="bottomTable">
        <el-table :data="tableDataBottom" border class="bottomTable" show-summary :summary-method="getBottomSummaries" :header-cell-style="headerCellStyle" :cell-style="cellStyle">
          <el-table-column prop="jl_name" label="计量点" width="120" />
          <el-table-column prop="price_avg" :render-header="renderHeader" :formatter="myfixedPrice_avg" label="平均电价|(元/kWh)" width="80">
            <!-- <template slot-scope="scope">
              <span style="display: none">{{ (scope.row.price_avg = (Number(scope.row.fees_all) / Number(scope.row.poweruse_all)).toFixed(9)) }}</span>
              <span style="display: none">{{ (scope.row.price_avg = myFixed(Number(scope.row.fees_all) / Number(scope.row.poweruse_all), 9)) }}</span>
              <span>{{ isNaN(scope.row.price_avg) || scope.row.price_avg == Infinity ? "0" : Number(scope.row.fees_all).toFixed(9) }}</span>
            </template> -->
          </el-table-column>
          <el-table-column label="总">
            <el-table-column prop="poweruse_all" :render-header="renderHeader" label="用量|(kWh)" width="95">
              <template slot-scope="scope">
                <span>{{
                  (scope.row.poweruse_all = Number(scope.row.poweruse_j) + Number(scope.row.poweruse_f) + Number(scope.row.poweruse_p) + Number(scope.row.poweruse_g)).toFixed(2)
                }}</span>
              </template>
            </el-table-column>
            <el-table-column prop="fees_all" :render-header="renderHeader" label="电费|(元)" width="95">
              <template slot-scope="scope">
                <span>{{ (scope.row.fees_all = (Number(scope.row.fees_j) + Number(scope.row.fees_f) + Number(scope.row.fees_p) + Number(scope.row.fees_g)).toFixed(2)) }}</span>
              </template>
            </el-table-column>
          </el-table-column>
          <el-table-column label="尖">
            <el-table-column prop="lastnum_j" :render-header="renderHeader" label="上期|结存数" width="70">
              <template slot-scope="scope">
                <input v-if="mainEdit == 0 && scope.row.lastnum_j == null" v-model="scope.row.lastnum_j" style="width: 80%" type="number" @input="InputChange" />
                <span v-else>{{ scope.row.lastnum_j }}</span>
              </template>
            </el-table-column>
            <el-table-column prop="nownum_j" :render-header="renderHeader" label="本期|结存数" width="70">
              <template slot-scope="scope">
                <input v-if="mainEdit == 0" v-model="scope.row.nownum_j" style="width: 80%" type="number" @input="InputChange" />
                <span v-else>{{ scope.row.nownum_j }}</span>
              </template>
            </el-table-column>
            <el-table-column prop="poweruse_j" :render-header="renderHeader" label="用量|(kWh)" width="70">
              <template slot-scope="scope">
                <span>{{ (scope.row.poweruse_j = ((Number(scope.row.nownum_j) - Number(scope.row.lastnum_j)) * Number(scope.row.dnbbl)).toFixed(2)) }}</span>
              </template>
            </el-table-column>
            <el-table-column prop="price_j" :render-header="renderHeader" label="电价|(元/kWh)" width="80">
              <template slot-scope="scope">
                <span>{{ myFixed(Number(scope.row.price_j), 5) }}</span>
              </template>
            </el-table-column>
            <el-table-column prop="fees_j" :render-header="renderHeader" label="电费|(元)" width="70">
              <template slot-scope="scope">
                <span>{{ (scope.row.fees_j = (Number(scope.row.price_j) * Number(scope.row.poweruse_j)).toFixed(2)) }}</span>
              </template>
            </el-table-column>
          </el-table-column>
          <el-table-column label="峰">
            <el-table-column prop="lastnum_f" :render-header="renderHeader" label="上期|结存数" width="80">
              <template slot-scope="scope">
                <input v-if="mainEdit == 0 && scope.row.lastnum_f == null" v-model="scope.row.lastnum_f" style="width: 80%" type="number" @input="InputChange" />
                <span v-else>{{ scope.row.lastnum_f }}</span>
              </template>
            </el-table-column>
            <el-table-column prop="nownum_f" :render-header="renderHeader" label="本期|结存数" width="80">
              <template slot-scope="scope">
                <input v-if="mainEdit == 0" v-model="scope.row.nownum_f" style="width: 80%" type="number" @input="InputChange" />
                <span v-else>{{ scope.row.nownum_f }}</span>
              </template>
            </el-table-column>
            <el-table-column prop="poweruse_f" :render-header="renderHeader" label="用量|(kWh)" width="80">
              <template slot-scope="scope">
                <span>{{ (scope.row.poweruse_f = ((Number(scope.row.nownum_f) - Number(scope.row.lastnum_f)) * Number(scope.row.dnbbl)).toFixed(2)) }}</span>
              </template>
            </el-table-column>
            <el-table-column prop="price_f" :render-header="renderHeader" label="电价|(元/kWh)" width="80">
              <template slot-scope="scope">
                <span>{{ myFixed(Number(scope.row.price_f), 5) }}</span>
              </template>
            </el-table-column>
            <el-table-column prop="fees_f" :render-header="renderHeader" label="电费|(元)" width="80">
              <template slot-scope="scope">
                <span>{{ (scope.row.fees_f = (Number(scope.row.price_f) * Number(scope.row.poweruse_f)).toFixed(2)) }}</span>
              </template>
            </el-table-column>
          </el-table-column>
          <el-table-column label="平">
            <el-table-column prop="lastnum_p" :render-header="renderHeader" label="上期|结存数" width="70">
              <template slot-scope="scope">
                <input v-if="mainEdit == 0 && scope.row.lastnum_p == null" v-model="scope.row.lastnum_p" style="width: 80%" type="number" @input="InputChange" />
                <span v-else>{{ scope.row.lastnum_p }}</span>
              </template>
            </el-table-column>
            <el-table-column prop="nownum_p" :render-header="renderHeader" label="本期|结存数" width="70">
              <template slot-scope="scope">
                <input v-if="mainEdit == 0" v-model="scope.row.nownum_p" style="width: 80%" type="number" @input="InputChange" />
                <span v-else>{{ scope.row.nownum_p }}</span>
              </template>
            </el-table-column>
            <el-table-column prop="poweruse_p" :render-header="renderHeader" label="用量|(kWh)" width="70">
              <template slot-scope="scope">
                <span>{{ (scope.row.poweruse_p = ((Number(scope.row.nownum_p) - Number(scope.row.lastnum_p)) * Number(scope.row.dnbbl)).toFixed(2)) }}</span>
              </template>
            </el-table-column>
            <el-table-column prop="price_p" :render-header="renderHeader" label="电价|(元/kWh)" width="80">
              <template slot-scope="scope">
                <span>{{ myFixed(Number(scope.row.price_p), 5) }}</span>
              </template>
            </el-table-column>
            <el-table-column prop="fees_p" :render-header="renderHeader" label="电费|(元)" width="70">
              <template slot-scope="scope">
                <span>{{ (scope.row.fees_p = (Number(scope.row.price_p) * Number(scope.row.poweruse_p)).toFixed(2)) }}</span>
              </template>
            </el-table-column>
          </el-table-column>
          <el-table-column label="谷">
            <el-table-column prop="lastnum_g" :render-header="renderHeader" label="上期|结存数" width="70">
              <template slot-scope="scope">
                <input v-if="mainEdit == 0 && scope.row.lastnum_g == null" v-model="scope.row.lastnum_g" style="width: 80%" type="number" @input="InputChange" />
                <span v-else>{{ scope.row.lastnum_g }}</span>
              </template>
            </el-table-column>
            <el-table-column prop="nownum_g" :render-header="renderHeader" label="本期|结存数" width="70">
              <template slot-scope="scope">
                <input v-if="mainEdit == 0" v-model="scope.row.nownum_g" style="width: 80%" type="number" @input="InputChange" />
                <span v-else>{{ scope.row.nownum_g }}</span>
              </template>
            </el-table-column>
            <el-table-column prop="poweruse_g" :render-header="renderHeader" label="用量|(kWh)" width="70">
              <template slot-scope="scope">
                <span>{{ (scope.row.poweruse_g = ((Number(scope.row.nownum_g) - Number(scope.row.lastnum_g)) * Number(scope.row.dnbbl)).toFixed(2)) }}</span>
              </template>
            </el-table-column>
            <el-table-column prop="price_g" :render-header="renderHeader" label="电价|(元/kWh)" width="80">
              <template slot-scope="scope">
                <span>{{ myFixed(Number(scope.row.price_g), 5) }}</span>
              </template>
            </el-table-column>
            <el-table-column prop="fees_g" :render-header="renderHeader" label="电费|(元)" width="70">
              <template slot-scope="scope">
                <span>{{ (scope.row.fees_g = (Number(scope.row.price_g) * Number(scope.row.poweruse_g)).toFixed(2)) }}</span>
              </template>
            </el-table-column>
          </el-table-column>
        </el-table>
      </div>
      <div class="button-line">
        <div v-if="mainEdit == 0" @click="queryDataDetailFunc" style="width: 85px; height: 32px;cursor: pointer; border-radius: 2px; margin-right: 10px; background-color: #0084ff">
          <img src="../pluginTemp/images/重置.png" style="margin-top: 5px; margin-left: 8px" alt="" />
          <span style="color: #fff; font-size: 16px; vertical-align: top; margin-top: 5px; margin-left: 15px; display: inline-block">重置</span>
        </div>
        <img src="../pluginTemp/images/save.png" style="cursor: pointer" v-if="mainEdit == 0" @click="saveTable" alt="" />
      </div>
    </div>
  </div>
</template>

<script>
import eventActionDefine from "./components/msgCompConfig";
import { queryDataDetail, saveData, queryViewTableInfo, exportTempleDetailData, queryAll } from "././api/asset";
import utils from "@/utils";

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
      const { theme_global_config } = this.themeInfo || {
        theme_global_config: {
          "--theme-public-pinPai-color": "rgba(24,144,255,1)",
          "--theme-public-text-color-1": "rgba(12, 13, 14,1)",
        },
      };

      const themeColor = theme_global_config["--theme-public-pinPai-color"];
      const textColor = theme_global_config["--theme-public-text-color-1"];
      this.$nextTick(() => {
        const style = `#${this.identification} .el-radio-button__inner:hover{
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
      mainEdit: 0,
      excelAllData: {},
      //组件数据
      tableDataTop: [],
      tableDataBottom: [],
      tableData: [],
      queryAllData: {},
      headerCellStyle: {
        background: "#F2F4F5",
        color: "black",
        textAlign: "center",
      },
      cellStyle: {
        textAlign: "center",
        color: "black",
      },
    };
  },
  mounted() {
    this.queryAllFunc();
    this.queryDataDetailFunc();
    //用于注册事件定义，不可删除
    const { componentId } = this.customConfig || {};
    componentId && window.componentCenter?.register(componentId, "comp", this, eventActionDefine);
    const { buttons, id } = this.customConfig;
    const componentName = this.$vnode.tag.split("-").pop().toLowerCase();
    this.identification = `secondary_${componentName}_` + (id || utils.generateUUID());
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
    if (document.querySelectorAll(".application-add")[0]) {
      document.querySelectorAll(".application-add")[0].style.minHeight = "100%";
    }
  },
  methods: {
    queryAllFunc() {
      const sessionValue = sessionStorage.getItem("sessionValue");
      if (sessionValue) {
        this.queryAllData = JSON.parse(sessionValue);
      } else {
        queryAll().then((res) => {
          this.queryAllData = res.data;
          sessionStorage.setItem("sessionValue", JSON.stringify(res.data));
        });
      }
    },
    queryDataDetailFunc() {
      const params = {
        form_id: this.GetQueryString("form_id"),
        id: this.GetQueryString("data_id"),
      };
      queryDataDetail(params).then((res) => {
        for (const k in res.data.childData[0]) {
          this.tableData = res.data.childData[0][k];
        }
        this.excelAllData = res.data;
        const keyArr = [
          "dnbbl",
          // "lastnum_all",
          // "nownum_all",
          "poweruse_all",
          "price_all",
          "fees_all",
          "lastnum_j",
          "nownum_j",
          "poweruse_j",
          "price_j",
          "fees_j",
          "lastnum_f",
          "nownum_f",
          "poweruse_f",
          "price_f",
          "fees_f",
          "lastnum_p",
          "nownum_p",
          "poweruse_p",
          "price_p",
          "fees_p",
          "lastnum_g",
          "nownum_g",
          "poweruse_g",
          "price_g",
          "fees_g",
          "poweroutput_last",
          "poweroutput_now",
          "poweroutput_all",
          "swdl_last",
          "swdl_now",
          "swdl_all",
          "zfzydl_all",
          "price_avg",
        ];
        this.tableData.forEach((item) => {
          keyArr.forEach((key) => (item[key] = item[key] || 0));
        });
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
    },
    myFixed(num, digit) {
      if (Object.is(parseFloat(num), NaN)) {
        return "-";
      }
      num = parseFloat(num);
      return (Math.round((num + Number.EPSILON) * Math.pow(10, digit)) / Math.pow(10, digit)).toFixed(digit);
    },
    handleValueChange(value) {
      this.triggerEvent("valueChange", {
        value,
      });
    },
    exportExcel() {
      if (Number(this.excelAllData.zfzydl_all).toFixed(2) !== Number(this.excelAllData.poweruse_all).toFixed(2)) {
        return this.$message({
          message: "自发自用电量不匹配",
          type: "error",
        });
      } else {
        const message = {
          view_id: this.queryAllData.export_excel_template_view_id.current_value,
        };
        queryViewTableInfo(message).then((res) => {
          const message2 = {
            template_id: res.data.queryColumn.formViewDetailButtons[0].exportTemplates[0].id,
            view_id: this.queryAllData.export_excel_template_view_id.current_value,
            form_id: this.GetQueryString("form_id"),
            export_type: 1,
          };
          const message3 = {
            queryParams: [
              {
                colName: "data_id",
                type: 0,
                value: this.GetQueryString("data_id"),
              },
            ],
          };
          exportTempleDetailData(message2, message3)
            .then((res) => {
              if (res.status == 200) {
                window.open(window.location.origin + res.data);
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
      if (Number(this.excelAllData.zfzydl_all).toFixed(2) !== Number(this.excelAllData.poweruse_all).toFixed(2)) {
        return this.$message({
          message: "自发自用电量不匹配",
          type: "error",
        });
      } else {
        const keyArray = [
          "jl_name",
          "price_avg",
          "poweruse_all",
          "fees_all",
          "lastnum_j",
          "nownum_j",
          "poweruse_j",
          "price_j",
          "fees_j",
          "lastnum_f",
          "nownum_f",
          "poweruse_f",
          "price_f",
          "fees_f",
          "lastnum_p",
          "nownum_p",
          "poweruse_p",
          "price_p",
          "fees_p",
          "lastnum_g",
          "nownum_g",
          "poweruse_g",
          "price_g",
          "fees_g",
        ];
        this.tableDataTop.forEach((item) => {
          this.tableDataBottom.forEach((itemSon) => {
            if (item.data_id === itemSon.data_id) {
              keyArray.forEach((key) => (item[key] = JSON.parse(JSON.stringify(itemSon[key]))));
            }
          });
        });
        for (const k in this.excelAllData.childData[0]) {
          this.excelAllData.childData[0][k] = this.tableDataTop;
        }
        this.excelAllData.display_flag = "1";
        const message = {
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
          .catch(() => {
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
        if ([2, 3, 4, 5, 6, 7, 9, 10, 13, 14].includes(index)) {
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
      sums[12] = Number(sums[8]).toFixed(2) - Number(sums[11]).toFixed(2);
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
        if ([1, 4, 5, 7, 9, 10, 12, 14, 15, 17, 19, 20, 22].includes(index)) {
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
      return sums;
    },
    myfixedPrice_avg(row) {
      row.price_avg = this.myFixed(Number(row.fees_all) / Number(row.poweruse_all), 9);
      if (row.price_avg == Infinity ? "0" : Number(row.fees_all).toFixed(9)) {
        return row.price_avg;
      } else {
        return "";
      }
    },
    formatDate(row) {
      const date = new Date(row["frezz_time"]);
      const Y = date.getFullYear() + ".";
      const M = date.getMonth() + 1 + ".";
      const D = date.getDate() + " ";
      const h = (date.getHours() + ":").padStart(3, "0");
      const m = (date.getMinutes() + ":").padStart(3, "0");
      const s = (date.getSeconds() + "").padStart(2, "0");
      return Y + M + D + h + m + s;
    },

    // table表头换行
    renderHeader(h, { column, $index }) {
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
      const { componentId, appId } = this.customConfig || {};
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
    this.styleEle && document.head.removeChild(this.styleEle);
  },
};
</script>
<style lang="less" scoped>
.settlement-details {
  height: 100%;
  width: 100%;
  padding: 0 20px 0 20px;
  box-sizing: border-box;

  .button-line {
    width: 100%;
    height: 60px;
    display: flex;
    align-items: center;
    justify-content: flex-end;

    /deep/.el-button {
      font-size: 14px;
    }
    /deep/.el-button--primary {
      background-color: #1b85ff;
    }
  }

  .top_Title {
    width: 100%;
    height: 64px;
    line-height: 64px;
    text-align: center;
    font-size: 20px;
    font-family: "Microsoft YaHei";
    font-weight: 700;
    color: #000000;
  }

  .top_Info,
  .top_Info2 {
    width: 100%;
    display: flex;
    box-sizing: border-box;

    div {
      box-sizing: border-box;
      padding: 0px;
      margin: 0px;
      line-height: 30px;
      height: 30px;
      border-left: 1px solid #00000040;
      border-top: 1px solid #00000040;
      display: inline-block;
      text-align: center;
      font-size: 14px;
    }

    .info-label {
      font-weight: bold;
      background-color: #f2f4f5;
    }

    .div_Right {
      border-right: 1px solid #00000040;
      text-align: center;
    }
  }

  .top_Info2 {
    div {
      border-bottom: 0px;
    }
  }

  .topTable,
  .bottomTable {
    /deep/.el-table--border:after,
    /deep/.el-table--group:after,
    /deep/.el-table:before {
      background-color: #00000040;
    }

    /deep/.el-table--border,
    /deep/.el-table--group {
      border-color: #00000040;
      border-width: 1px;
    }

    /deep/.el-table td,
    /deep/.el-table th.is-leaf {
      border-color: #00000040;
      border-width: 1px;
    }

    /deep/.el-table--border th,
    /deep/.el-table--border th.gutter:last-of-type {
      border-color: #00000040;
      border-width: 1px;
    }

    /deep/.el-table--border td,
    /deep/.el-table--border th {
      border-color: #00000040;
      border-width: 1px;
    }

    /deep/.el-table .cell {
      padding: 0;
    }

    /deep/.el-table .el-table__cell {
      padding: 3px 0;
    }

    /* 表格不出现横向滚动条 */
    /deep/.el-table--scrollable-x .el-table__body-wrapper {
      overflow-x: hidden;
    }

    /deep/.has-gutter {
      td {
        background: #fff;
        color: black;
        text-align: center;
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
.application-add {
  min-height: 100% !important;
}
</style>
