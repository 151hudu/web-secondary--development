<template>
  <!-- 定义外层容器标识，宽高百分百 不可删除 -->
  <div :id="identification" style="width: 100%; height: 100%; background-color: #fff" :ref="identification" v-loading="loading" element-loading-text="正在生成PDF">
    <div class="headerTab" v-show="isSaveTable">
      <div class="tabLeft" :class="{ active: activeShow }" @click="switchActive(true)">账单明细</div>
      <div class="tabRight" :class="{ active: !activeShow }" @click="switchActive(false)">表码明细</div>
    </div>
    <div class="settlement-details">
      <div class="button-line" v-show="activeShow">
        <img src="../pluginTemp/images/export.png" v-show="isSaveTable" style="cursor: pointer" @click="saveTable('D')" alt="" />
      </div>
      <div class="button-line" v-show="!activeShow">
        <img src="../pluginTemp/images/export.png" v-show="isSaveTable" style="cursor: pointer" @click="saveTable('B')" alt="" />
      </div>
      <div class="top_Title" v-show="activeShow">光伏自发自用电费账单</div>
      <div class="top_Title" v-show="!activeShow">光伏计量表表码值明细</div>
      <div class="topInfoText" v-show="activeShow">
        <span>自发自用电费账单：</span>
        <span>账单月份：{{ this.formatDateMon(this.excelAllData.month) }}</span>
      </div>
      <div class="topInfoText" v-show="!activeShow">
        <span></span>
        <span>计量周期：{{ this.excelAllData.settlement_cycle }}</span>
      </div>
      <div class="top_Info" v-show="activeShow">
        <div style="width: 310px; color: #000" class="info-label">发电单位</div>
        <div style="width: 310px; color: #000">{{ this.excelAllData.generating_unit }}</div>
        <div style="width: 310px; color: #000" class="info-label">发电单元名称</div>
        <div style="width: 310px; color: #000">{{ this.excelAllData.power_cell_name }}</div>
        <div style="width: 310px; color: #000" class="info-label">结算方式</div>
        <div style="width: calc(100% - 1550px); color: #000" class="div_Right">
          {{ this.excelAllData.settlement_type }}
        </div>
      </div>
      <div class="top_Info2" v-show="activeShow">
        <div style="width: 310px; color: #000" class="info-label">用电单位</div>
        <div style="width: 310px; color: #000">{{ this.excelAllData.electricity_user }}</div>
        <div style="width: 310px; color: #000" class="info-label">用电类型</div>
        <div style="width: 310px; color: #000">{{ this.excelAllData.power_type }}</div>
        <div style="width: 310px; color: #000" class="info-label">
          {{ this.excelAllData.settlement_type === "分时电价" ? "折扣率" : "电价" }}
        </div>
        <div style="width: calc(100% - 1550px); color: #000" class="div_Right">
          {{ this.excelAllData.settlement_type === "分时电价" ? this.excelAllData.discount_rate + "%" : this.excelAllData.fixed_tariff + "元/kWh" }}
        </div>
      </div>
      <div class="top_Info" v-show="!activeShow">
        <div style="width: 250px; color: #000" class="info-label">发电单位</div>
        <div style="width: 460px; color: #000">{{ this.excelAllData.generating_unit }}</div>
        <div style="width: 230px; color: #000" class="info-label">用电单位</div>
        <div style="width: 375px; color: #000">{{ this.excelAllData.electricity_user }}</div>
        <div style="width: 115px; color: #000" class="info-label">发电单元名称</div>
        <div style="width: calc(100% - 1430px); color: #000" class="div_Right">
          {{ this.excelAllData.power_cell_name }}
        </div>
      </div>
      <div class="topTable" v-show="activeShow">
        <el-table :data="tableData.t_monthly_bill_list" border :header-cell-style="headerCellStyle" :cell-style="cellStyle">
          <el-table-column prop="data_type" label="名称" width="310" />
          <el-table-column prop="data_value_j" label="“尖”" width="310" :formatter="data_value_jCount" />
          <el-table-column prop="data_value_f" label="“峰”" width="310" :formatter="data_value_fCount" />
          <el-table-column prop="data_value_p" label="“平”" width="310" :formatter="data_value_pCount" />
          <el-table-column prop="data_value_g" label="“谷”" width="310" :formatter="data_value_gCount" />
          <el-table-column prop="data_value_all" label="合计" :formatter="data_value_allCount" />
        </el-table>
      </div>
      <div class="topTable" v-show="!activeShow">
        <el-table :data="tableData.t_monthly_bill_details_new" border :header-cell-style="headerCellStyle" :cell-style="cellStyle">
          <el-table-column type="index" width="50" label="序号"></el-table-column>
          <el-table-column prop="dnbmc" label="电能表名称" width="200" />
          <el-table-column prop="dnbbl" label="倍率" width="115" />
          <el-table-column prop="bjzc_no" label="表计资产号" width="230" />
          <el-table-column label="“尖”">
            <el-table-column label="上期结存数">
              <el-table-column label="本期结存数" width="115">
                <template slot-scope="scope">
                  <template>
                    <input type="number" v-if="mainEdit == 0 && scope.row.lastnum_j_edit" @input="InputChange" style="width: 80%" v-model="scope.row.lastnum_j" />
                    <div v-if="mainEdit == 1 || !scope.row.lastnum_j_edit" style="border-bottom: 1px solid #00000040">{{ scope.row.lastnum_j }}</div>
                  </template>
                  <template>
                    <input type="number" v-if="mainEdit == 0" @input="InputChange" style="width: 80%; margin-top: 2px" v-model="scope.row.nownum_j" />
                    <div v-else>{{ scope.row.nownum_j }}</div>
                  </template>
                </template>
              </el-table-column>
            </el-table-column>
            <el-table-column prop="poweruse_j" :render-header="renderHeader" label="电量|(kWh)" width="115">
              <template slot-scope="scope">
                {{ (scope.row.poweruse_j = myFixed((Number(scope.row.nownum_j) - Number(scope.row.lastnum_j)) * Number(scope.row.dnbbl), 2)) }}
              </template>
            </el-table-column>
          </el-table-column>
          <el-table-column label="“峰”">
            <el-table-column label="上期结存数">
              <el-table-column prop="jjlx" label="本期结存数" width="115">
                <template slot-scope="scope">
                  <template>
                    <input type="number" v-if="mainEdit == 0 && scope.row.lastnum_f_edit" @input="InputChange" style="width: 80%" v-model="scope.row.lastnum_f" />
                    <div v-if="mainEdit == 1 || !scope.row.lastnum_f_edit" style="border-bottom: 1px solid #00000040">{{ scope.row.lastnum_f }}</div>
                  </template>
                  <template>
                    <input type="number" v-if="mainEdit == 0" @input="InputChange" style="width: 80%; margin-top: 2px" v-model="scope.row.nownum_f" />
                    <div v-else>{{ scope.row.nownum_f }}</div>
                  </template>
                </template>
              </el-table-column>
            </el-table-column>
            <el-table-column prop="poweruse_f" :render-header="renderHeader" label="电量|(kWh)" width="115">
              <template slot-scope="scope">
                {{ (scope.row.poweruse_f = myFixed((Number(scope.row.nownum_f) - Number(scope.row.lastnum_f)) * Number(scope.row.dnbbl), 2)) }}
              </template>
            </el-table-column>
          </el-table-column>
          <el-table-column label="“平”">
            <el-table-column label="上期结存数">
              <el-table-column prop="jjlx" label="本期结存数" width="115">
                <template slot-scope="scope">
                  <template>
                    <input type="number" v-if="mainEdit == 0 && scope.row.lastnum_p_edit" @input="InputChange" style="width: 80%" v-model="scope.row.lastnum_p" />
                    <div v-if="mainEdit == 1 || !scope.row.lastnum_p_edit" style="border-bottom: 1px solid #00000040">{{ scope.row.lastnum_p }}</div>
                  </template>
                  <template>
                    <input type="number" v-if="mainEdit == 0" @input="InputChange" style="width: 80%; margin-top: 2px" v-model="scope.row.nownum_p" />
                    <div v-else>{{ scope.row.nownum_p }}</div>
                  </template>
                </template>
              </el-table-column>
            </el-table-column>
            <el-table-column prop="poweruse_p" :render-header="renderHeader" label="电量|(kWh)" width="145">
              <template slot-scope="scope">
                {{ (scope.row.poweruse_p = myFixed((Number(scope.row.nownum_p) - Number(scope.row.lastnum_p)) * Number(scope.row.dnbbl), 2)) }}
              </template>
            </el-table-column>
          </el-table-column>
          <el-table-column label="“谷”">
            <el-table-column label="上期结存数">
              <el-table-column prop="jjlx" label="本期结存数" width="115">
                <template slot-scope="scope">
                  <template>
                    <input type="number" v-if="mainEdit == 0 && scope.row.lastnum_g_edit" @input="InputChange" style="width: 80%" v-model="scope.row.lastnum_g" />
                    <div v-if="mainEdit == 1 || !scope.row.lastnum_g_edit" style="border-bottom: 1px solid #00000040">{{ scope.row.lastnum_g }}</div>
                  </template>
                  <template>
                    <input type="number" v-if="mainEdit == 0" @input="InputChange" style="width: 80%; margin-top: 2px" v-model="scope.row.nownum_g" />
                    <div v-else>{{ scope.row.nownum_g }}</div>
                  </template>
                </template>
              </el-table-column>
            </el-table-column>
            <el-table-column prop="poweruse_g" :render-header="renderHeader" label="电量|(kWh)" width="115">
              <template slot-scope="scope">
                {{ (scope.row.poweruse_g = myFixed((Number(scope.row.nownum_g) - Number(scope.row.lastnum_g)) * Number(scope.row.dnbbl), 2)) }}
              </template>
            </el-table-column>
          </el-table-column>
          <el-table-column label="“总”">
            <el-table-column label="上期结存数">
              <el-table-column prop="jjlx" label="本期结存数" width="115">
                <template slot-scope="scope">
                  <div style="border-bottom: 1px solid #00000040">
                    {{
                      (scope.row.lastnum_all = myFixed(Number(scope.row.lastnum_j) + Number(scope.row.lastnum_f) + Number(scope.row.lastnum_p) + Number(scope.row.lastnum_g), 2))
                    }}
                  </div>
                  <div>
                    {{ (scope.row.nownum_all = myFixed(Number(scope.row.nownum_j) + Number(scope.row.nownum_f) + Number(scope.row.nownum_p) + Number(scope.row.nownum_g), 2)) }}
                  </div>
                </template>
              </el-table-column>
            </el-table-column>
            <el-table-column prop="poweruse_all" :render-header="renderHeader" label="电量|(kWh)" min-width="115" max-width="202">
              <template slot-scope="scope">
                {{ (scope.row.poweruse_all = myFixed((Number(scope.row.nownum_all) - Number(scope.row.lastnum_all)) * Number(scope.row.dnbbl), 2)) }}
              </template>
            </el-table-column>
          </el-table-column>
        </el-table>
      </div>
      <div class="button-line" v-if="mainEdit == 0 && !activeShow && isSaveTable">
        <div
          v-if="mainEdit == 0 && !activeShow"
          @click="queryDataDetailFunc(false)"
          style="width: 85px; height: 32px; cursor: pointer; border-radius: 2px; margin-right: 10px; background-color: #0084ff"
        >
          <img src="../pluginTemp/images/重置.png" style="margin-top: 5px; margin-left: 8px" alt="" />
          <span v-show="isSaveTable" style="color: #fff; font-size: 16px; vertical-align: top; margin-top: 3px; margin-left: 14px; display: inline-block">重置</span>
        </div>
        <img src="../pluginTemp/images/save.png" style="cursor: pointer" v-if="mainEdit == 0 && !activeShow" @click="saveTable('flag')" alt="" />
      </div>
      <div class="topInfoText" v-show="activeShow">
        <span>自发自用电量明细：</span>
      </div>
      <div class="bottomTable" v-show="activeShow">
        <el-table :data="tableData.t_monthly_electricity_bill_details" border class="bottomTable" :header-cell-style="headerCellStyle" :cell-style="cellStyle">
          <el-table-column prop="dnbmc" label="电能表名称" width="310" />
          <el-table-column prop="bjzc_no" label="表计资产号" width="310" />
          <el-table-column prop="data_value_j" :render-header="renderHeader" label="“尖”|(kWh)" width="232.5" :formatter="data_value_jSum"></el-table-column>
          <el-table-column prop="data_value_f" :render-header="renderHeader" label="“峰”|(kWh)" width="232.5" :formatter="data_value_fSum"></el-table-column>
          <el-table-column prop="data_value_p" :render-header="renderHeader" label="“平”|(kWh)" width="232.5" :formatter="data_value_pSum"></el-table-column>
          <el-table-column prop="data_value_g" :render-header="renderHeader" label="“谷”|(kWh)" width="232.5" :formatter="data_value_gSum"></el-table-column>
          <el-table-column prop="data_value_all" :render-header="renderHeader" label="“总”|(kWh)" :formatter="data_value_allSum"></el-table-column>
        </el-table>
      </div>
      <div class="bottomTable" v-show="!activeShow && xxxx">
        <el-table :data="tableData.t_monthly_bill_details_record" :key="xxxx" border class="bottomTable" :header-cell-style="headerCellStyle" :cell-style="cellStyle">
          <el-table-column type="index" width="50" label="序号"></el-table-column>
          <el-table-column prop="dnbmc" label="电能表名称" width="200"></el-table-column>
          <el-table-column :render-header="renderHeader" label="“尖”">
            <el-table-column prop="nownum_j" :render-header="renderHeader" label="本期|原结存数" width="115"> </el-table-column>
            <el-table-column prop="nownum_j_act" :render-header="renderHeader" label="本期|已修改结存数" width="115" :formatter="nownum_j_actSum"> </el-table-column>
            <el-table-column prop="nownum_j_gap" :render-header="renderHeader" label="差额" width="115">
              <template slot-scope="scope">
                {{ (scope.row.nownum_j_gap = myFixed(Number(scope.row.nownum_j_act) - Number(scope.row.nownum_j), 2)) }}
              </template>
            </el-table-column>
          </el-table-column>
          <el-table-column :render-header="renderHeader" label="“峰”">
            <el-table-column prop="nownum_f" :render-header="renderHeader" label="本期|原结存数" width="115"> </el-table-column>
            <el-table-column prop="nownum_f_act" :render-header="renderHeader" label="本期|已修改结存数" width="115" :formatter="nownum_f_actSum"> </el-table-column>
            <el-table-column prop="nownum_f_gap" :render-header="renderHeader" label="差额" width="115">
              <template slot-scope="scope">
                {{ (scope.row.nownum_f_gap = myFixed(Number(scope.row.nownum_f_act) - Number(scope.row.nownum_f), 2)) }}
              </template>
            </el-table-column>
          </el-table-column>
          <el-table-column :render-header="renderHeader" label="“平”">
            <el-table-column prop="nownum_p" :render-header="renderHeader" label="本期|原结存数" width="115"> </el-table-column>
            <el-table-column prop="nownum_p_act" :render-header="renderHeader" label="本期|已修改结存数" width="115" :formatter="nownum_p_actSum"> </el-table-column>
            <el-table-column prop="nownum_p_gap" :render-header="renderHeader" label="差额" width="72.5">
              <template slot-scope="scope">
                {{ (scope.row.nownum_p_gap = myFixed(Number(scope.row.nownum_p_act) - Number(scope.row.nownum_p), 2)) }}
              </template>
            </el-table-column>
          </el-table-column>
          <el-table-column :render-header="renderHeader" label="“谷”">
            <el-table-column prop="nownum_g" :render-header="renderHeader" label="本期|原结存数" width="115"> </el-table-column>
            <el-table-column prop="nownum_g_act" :render-header="renderHeader" label="本期|已修改结存数" width="115" :formatter="nownum_g_actSum"> </el-table-column>
            <el-table-column prop="nownum_g_gap" :render-header="renderHeader" label="差额" width="72.5">
              <template slot-scope="scope">
                {{ (scope.row.nownum_g_gap = myFixed(Number(scope.row.nownum_g_act) - Number(scope.row.nownum_g), 2)) }}
              </template>
            </el-table-column>
          </el-table-column>
          <el-table-column :render-header="renderHeader" label="“总”">
            <el-table-column prop="nownum_all" :render-header="renderHeader" label="本期|原结存数" width="115" :formatter="nownum_allSum"> </el-table-column>
            <el-table-column prop="nownum_all_act" :render-header="renderHeader" label="本期|已修改结存数" width="115" :formatter="nownum_all_actSum"> </el-table-column>
            <el-table-column prop="nownum_all_gap" :render-header="renderHeader" label="差额">
              <template slot-scope="scope">
                {{ (scope.row.nownum_all_gap = myFixed(Number(scope.row.nownum_all_act) - Number(scope.row.nownum_all), 2)) }}
              </template>
            </el-table-column>
          </el-table-column>
        </el-table>
      </div>
      <el-descriptions title="" :column="3" border v-show="activeShow">
        <el-descriptions-item label="发电单位：">{{ this.excelAllData.generating_unit }}</el-descriptions-item>
        <el-descriptions-item label="用电单位：">{{ this.excelAllData.electricity_user }}</el-descriptions-item>
        <el-descriptions-item label="服务单位：">{{ this.excelAllData.customer_service_unit }}</el-descriptions-item>
        <el-descriptions-item label="确认人签字（盖章）："> </el-descriptions-item>
        <el-descriptions-item label="确认人签字（盖章）："></el-descriptions-item>
        <el-descriptions-item label="确认人签字（盖章）："></el-descriptions-item>
        <el-descriptions-item label="日期："></el-descriptions-item>
        <el-descriptions-item label="日期："></el-descriptions-item>
        <el-descriptions-item label="日期："></el-descriptions-item>
      </el-descriptions>
    </div>
  </div>
</template>

<script>
import eventActionDefine from "./components/msgCompConfig";
import { queryDataDetail, saveData, queryViewTableInfo, exportTempleDetailData, queryAll, uploadPic, img2pdf } from "././api/asset";
import utils from "@/utils";
import html2canvas from "html2canvas";
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
      activeShow: true,
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
      xxxx: 1, //重新渲染表格key值
      timer: null,
      lastTime: null,
      loading: false,
      isSaveTable: true,
      uploadPDF: [],
    };
  },
  mounted() {
    this.queryAllFunc();
    this.queryDataDetailFunc(true);
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
    saveTableExportPDF() {
      this.activeShow = true;
      this.isSaveTable = false;
      this.loading = true;
      this.$nextTick(() => {
        // 手动创建一个 canvas 标签
        const canvas = document.createElement("canvas");
        // 获取父标签，意思是这个标签内的 DOM 元素生成图片
        // imageTofile是给截图范围内的父级元素自定义的ref名称
        let canvasBox = this.$refs[this.identification];
        // 获取父级的宽高
        const width = parseInt(window.getComputedStyle(canvasBox).width);
        const height = parseInt(window.getComputedStyle(canvasBox).height);
        // 宽高 * 2 并放大 2 倍 是为了防止图片模糊
        canvas.width = width * 2;
        canvas.height = height * 2;
        canvas.style.width = width + "px";
        canvas.style.height = height + "px";
        const context = canvas.getContext("2d");
        context.scale(2, 2);
        const options = {
          backgroundColor: null,
          canvas: canvas,
          useCORS: true,
        };
        html2canvas(canvasBox, options).then(async (canvas) => {
          let dataURL = canvas.toDataURL("image/png");
          await this.uploadIMG(dataURL);
          this.activeShow = false;
          this.loading = false;
          this.$nextTick(() => {
            const canvas2 = document.createElement("canvas");
            let canvasBox2 = this.$refs[this.identification];
            this.loading = true;
            const width2 = parseInt(window.getComputedStyle(canvasBox2).width);
            const height2 = parseInt(window.getComputedStyle(canvasBox2).height);
            canvas2.width = width2 * 2;
            canvas2.height = height2 * 2;
            canvas2.style.width = width2 + "px";
            canvas2.style.height = height2 + "px";
            const context = canvas2.getContext("2d");
            context.scale(2, 2);
            const options2 = {
              backgroundColor: null,
              canvas: canvas2,
              useCORS: true,
            };
            html2canvas(canvasBox2, options2).then(async (canvas) => {
              let dataURL2 = canvas.toDataURL("image/png");
              await this.uploadIMG(dataURL2);
              console.log(this.uploadPDF);
              img2pdf(this.uploadPDF).then((res) => {
                console.log(res);
                this.$message({
                  message: "生成PDF成功",
                  type: "success",
                });
              });
              this.loading = false;
              this.isSaveTable = true;
            });
          });
        });
      });
    },
    //下载图片
    async uploadIMG(url) {
      var formData = new FormData();
      formData.append("file", this.base64toFile(url));
      let res = await uploadPic(formData);
      this.uploadPDF.push(res.data);
    },
    base64toFile(dataurl, filename = "file") {
      let arr = dataurl.split(",");
      let mime = arr[0].match(/:(.*?);/)[1];
      let suffix = mime.split("/")[1];
      let bstr = atob(arr[1]);
      let n = bstr.length;
      let u8arr = new Uint8Array(n);
      while (n--) {
        u8arr[n] = bstr.charCodeAt(n);
      }
      let file = new File([u8arr], `${filename}.${suffix}`, {
        type: mime,
      });
      return file;
    },
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
    switchActive(bool) {
      this.activeShow = bool;
    },
    queryDataDetailFunc(flag) {
      const params = {
        form_id: this.GetQueryString("form_id"),
        id: this.GetQueryString("data_id"),
      };
      queryDataDetail(params).then((res) => {
        res.data.childData.forEach((item, index) => {
          for (let k in item) {
            let message = k.split(",");
            this.tableData[message[1]] = item[k];
          }
          // if (item.t_monthly_bill_list) {
          //   this.tableData.t_monthly_bill_list = item.t_monthly_bill_list;
          // } else if (item.t_monthly_electricity_bill_details) {
          //   this.tableData.t_monthly_electricity_bill_details = item.t_monthly_electricity_bill_details;
          // } else if (item.t_monthly_bill_details_new) {
          //   this.tableData.t_monthly_bill_details_new = item.t_monthly_bill_details_new;
          // } else if (item.t_monthly_bill_details_record) {
          //   this.tableData.t_monthly_bill_details_record = item.t_monthly_bill_details_record;
          // }
        });
        console.log(this.tableData);
        this.excelAllData = res.data;
        // const keyArr = [
        //   "dnbbl",
        //   // "lastnum_all",
        //   // "nownum_all",
        //   "poweruse_all",
        //   "price_all",
        //   "fees_all",
        //   // "lastnum_j",
        //   "nownum_j",
        //   "poweruse_j",
        //   "price_j",
        //   "fees_j",
        //   // "lastnum_f",
        //   "nownum_f",
        //   "poweruse_f",
        //   "price_f",
        //   "fees_f",
        //   // "lastnum_p",
        //   "nownum_p",
        //   "poweruse_p",
        //   "price_p",
        //   "fees_p",
        //   // "lastnum_g",
        //   "nownum_g",
        //   "poweruse_g",
        //   "price_g",
        //   "fees_g",
        //   "poweroutput_last",
        //   "poweroutput_now",
        //   "poweroutput_all",
        //   // "swdl_last",
        //   "swdl_now",
        //   "swdl_all",
        //   "zfzydl_all",
        //   "price_avg",
        // ];
        this.tableData.t_monthly_bill_list = this.tableData.t_monthly_bill_list.sort((a, b) => {
          return a.show_rank - b.show_rank;
        });
        this.tableData.t_monthly_electricity_bill_details = this.tableData.t_monthly_electricity_bill_details.sort((a, b) => {
          return a.show_rank - b.show_rank;
        });
        this.tableData.t_monthly_bill_details_new = this.tableData.t_monthly_bill_details_new.sort((a, b) => {
          return a.show_rank - b.show_rank;
        });
        this.tableData.t_monthly_bill_details_record = this.tableData.t_monthly_bill_details_record.sort((a, b) => {
          return a.show_rank - b.show_rank;
        });
        this.tableData.t_monthly_bill_details_new.forEach((item) => {
          // keyArr.forEach((key) => (item[key] = item[key] || 0));
          if (typeof item.lastnum_j == "number") {
            item.lastnum_j = item.lastnum_j;
          } else {
            item.lastnum_j_edit = true;
            item.lastnum_j = null;
          }
          if (typeof item.lastnum_f == "number") {
            item["lastnum_f"] = item["lastnum_f"];
          } else {
            item.lastnum_f_edit = true;
            item["lastnum_f"] = null;
          }
          if (typeof item.lastnum_p == "number") {
            item["lastnum_p"] = item["lastnum_p"];
          } else {
            item.lastnum_p_edit = true;
            item["lastnum_p"] = null;
          }
          if (typeof item.lastnum_g == "number") {
            item["lastnum_g"] = item["lastnum_g"];
          } else {
            item.lastnum_g_edit = true;
            item["lastnum_g"] = null;
          }
        });
        this.tableData.t_monthly_bill_details_new = JSON.parse(JSON.stringify(this.tableData.t_monthly_bill_details_new));
        this.tableDataTop = JSON.parse(JSON.stringify(this.tableData));
        this.tableDataBottom = JSON.parse(JSON.stringify(this.tableData));
        this.tableDataBottom.forEach((item, index) => {
          if (item.jjlx == "上网关口表（反向）") {
            this.tableDataBottom.splice(index, 1);
            index - 1;
          }
        });
        this.mainEdit = this.excelAllData.edit_flag;
        window.setTimeout(() => {
          this.activeShow = !flag;
          window.setTimeout(() => {
            this.activeShow = flag;
          }, 500);
        }, 10);
        // this.mainEdit = 0;
      });
    },
    myFixed(num, digit) {
      if (Object.is(parseFloat(num), NaN)) {
        return null;
      }
      num = parseFloat(num);
      return (Math.round((num + Number.EPSILON) * Math.pow(10, digit)) / Math.pow(10, digit)).toFixed(digit);
    },
    exportExcel(type) {
      let url = "";
      if (type == "D") {
        if (this.excelAllData.settlement_type == "分时电价") {
          url = `?${this.queryAllData.dian_fei_fenshi_mo_ban.current_value}`;
        } else {
          url = `?${this.queryAllData.dian_fei_mo_ban.current_value}`;
        }
      } else {
        url = `?${this.queryAllData.biao_ma_mo_ban.current_value}`;
      }
      const message = {
        view_id: this.GetQueryString2("view_id", url),
      };
      queryViewTableInfo(message).then((res) => {
        const message2 = {
          template_id: this.GetQueryString2("template_id", url),
          view_id: this.GetQueryString2("view_id", url),
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
              let a = document.createElement("a");
              let event = new MouseEvent("click");
              if (type == "D") {
                a.href = `${this.customConfig.导出地址前面部分 ? this.customConfig.导出地址前面部分 : window.location.origin + "/dtyq/pngf"}${res.data}`;
                a.download = "光伏自发自用电费账单.xlsx";
                a.dispatchEvent(event);
              } else {
                a.href = `${this.customConfig.导出地址前面部分 ? this.customConfig.导出地址前面部分 : window.location.origin + "/dtyq/pngf"}${res.data}`;
                a.download = "光伏计量表表码值明细.xlsx";
                a.dispatchEvent(event);
              }
              // window.open(window.location.origin + res.data);
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
    InputChange() {
      let now = +new Date();
      if (this.lastTime && now - this.lastTime < 200) {
        clearTimeout(this.timer);
      } else {
        this.lastTime = now;
        this.timer = setTimeout(() => {
          ++this.xxxx;
          this.lastTime = +new Date();
        }, 200);
      }
    },
    saveTable(flag) {
      for (let k = 0; k < this.tableData.t_monthly_bill_details_new.length; k++) {
        console.log(this.tableData["t_monthly_bill_details_new"][k].lastnum_f_edit);
        delete this.tableData["t_monthly_bill_details_new"][k].lastnum_j_edit;
        delete this.tableData["t_monthly_bill_details_new"][k].lastnum_f_edit;
        delete this.tableData["t_monthly_bill_details_new"][k].lastnum_p_edit;
        delete this.tableData["t_monthly_bill_details_new"][k].lastnum_g_edit;
        delete this.tableData["t_monthly_bill_details_new"][k].lastnum_all_edit;
      }
      this.tableData.t_monthly_bill_details_new.forEach((item, index) => {
        // delete item.lastnum_j_edit;
        // delete item.lastnum_f_edit;
        // delete item.lastnum_p_edit;
        // delete item.lastnum_g_edit;
        // delete item.lastnum_all_edit;
      });
      // this.excelAllData.childData[0].t_monthly_bill_list = this.tableData.t_monthly_bill_list;
      // this.excelAllData.childData[0].childTableName = "t_monthly_bill_list";
      // this.excelAllData.childData[1].t_monthly_electricity_bill_details = this.tableData.t_monthly_electricity_bill_details;
      // this.excelAllData.childData[1].childTableName = "t_monthly_electricity_bill_details";
      // this.excelAllData.childData[2].t_monthly_bill_details_new = this.tableData.t_monthly_bill_details_new;
      // this.excelAllData.childData[2].childTableName = "t_monthly_bill_details_new";
      // this.excelAllData.childData[3].t_monthly_bill_details_record = this.tableData.t_monthly_bill_details_record;
      // this.excelAllData.childData[3].childTableName = "t_monthly_bill_details_record";
      this.excelAllData.childData.forEach((item, index) => {
        for (let k in item) {
          if (k.indexOf("t_monthly_bill_list") !== -1) {
            item[k] = this.tableData.t_monthly_bill_list;
          }
          if (k.indexOf("t_monthly_electricity_bill_details") !== -1) {
            item[k] = this.tableData.t_monthly_electricity_bill_details;
          }
          if (k.indexOf("t_monthly_bill_details_new") !== -1) {
            item[k] = this.tableData.t_monthly_bill_details_new;
          }
          if (k.indexOf("t_monthly_bill_details_record") !== -1) {
            item[k] = this.tableData.t_monthly_bill_details_record;
          }
        }
      });
      const message = {
        form_id: this.GetQueryString("form_id"),
        id: this.GetQueryString("data_id"),
      };
      this.excelAllData.display_flag = 0;
      saveData(message, this.excelAllData)
        .then((res) => {
          if (res.status == 200) {
            this.queryDataDetailFunc(false);
            if (flag !== "flag") {
              this.exportExcel(flag);
            }
            this.saveTableExportPDF();
            return this.$message({
              message: "更新成功请稍等",
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
    },

    data_value_jCount(row) {
      switch (row.data_type) {
        case "自发自用电量（kWh）":
          let message = 0;
          this.tableData.t_monthly_electricity_bill_details.forEach((item, index) => {
            if (item.dnbmc == "自发自用电量") {
              message = item.data_value_j;
            }
          });
          return (row.data_value_j = message);
          break;
        case "市电单价（元/kWh）":
          return this.myFixed(row.data_value_j, 5);
          break;
        case "市电电费（元）":
          let messagesddfj1 = 0;
          let messagesddfj2 = 0;
          this.tableData.t_monthly_bill_list.forEach((item, index) => {
            if (item.data_type == "自发自用电量（kWh）") {
              messagesddfj1 = Number(item.data_value_j);
            }
            if (item.data_type == "市电单价（元/kWh）") {
              messagesddfj2 = Number(item.data_value_j);
            }
          });
          return (row.data_value_j = this.myFixed(messagesddfj1 * messagesddfj2, 2));
          break;
        case "协议单价（元/kWh）":
          // let messagexydj = 0;
          // this.tableData.t_monthly_bill_list.forEach((item, index) => {
          //   if (item.data_type == "市电单价（元/kWh）") {
          //     messagexydj = Number(item.data_value_j) * (this.excelAllData.discount_rate / 100);
          //   }
          // });
          return (row.data_value_j = this.myFixed(row.data_value_j, 5));
          break;
        case "协议电费（元）":
          let messagexydf1 = 0;
          let messagexydf2 = 0;
          this.tableData.t_monthly_bill_list.forEach((item, index) => {
            if (item.data_type == "自发自用电量（kWh）") {
              messagexydf1 = Number(item.data_value_j);
            }
            if (item.data_type == "协议单价（元/kWh）") {
              messagexydf2 = Number(item.data_value_j);
            }
          });
          return (row.data_value_j = this.myFixed(messagexydf1 * messagexydf2, 2));
          break;
        case "节省电费（元）":
          let messagejsdf1 = 0;
          let messagejsdf2 = 0;
          this.tableData.t_monthly_bill_list.forEach((item, index) => {
            if (item.data_type == "市电电费（元）") {
              messagejsdf1 = Number(item.data_value_j);
            }
            if (item.data_type == "协议电费（元）") {
              messagejsdf2 = Number(item.data_value_j);
            }
          });
          return (row.data_value_j = this.myFixed(messagejsdf1 - messagejsdf2, 2));
          break;
      }
    },
    data_value_fCount(row) {
      switch (row.data_type) {
        case "自发自用电量（kWh）":
          let message = 0;
          this.tableData.t_monthly_electricity_bill_details.forEach((item, index) => {
            if (item.dnbmc == "自发自用电量") {
              message = item.data_value_f;
            }
          });
          return (row.data_value_f = message);
          break;
        case "市电单价（元/kWh）":
          return this.myFixed(row.data_value_f, 5);
          break;
        case "市电电费（元）":
          let messagesddff1 = 0;
          let messagesddff2 = 0;
          this.tableData.t_monthly_bill_list.forEach((item, index) => {
            if (item.data_type == "自发自用电量（kWh）") {
              messagesddff1 = Number(item.data_value_f);
            }
            if (item.data_type == "市电单价（元/kWh）") {
              messagesddff2 = Number(item.data_value_f);
            }
          });
          return (row.data_value_f = this.myFixed(messagesddff1 * messagesddff2, 2));
          break;
        case "协议单价（元/kWh）":
          // let messagexydf = 0;
          // this.tableData.t_monthly_bill_list.forEach((item, index) => {
          //   if (item.data_type == "市电单价（元/kWh）") {
          //     messagexydf = Number(item.data_value_f) * (this.excelAllData.discount_rate / 100);
          //   }
          // });
          return (row.data_value_f = this.myFixed(row.data_value_f, 5));
          break;
        case "协议电费（元）":
          let messagexydf1 = 0;
          let messagexydf2 = 0;
          this.tableData.t_monthly_bill_list.forEach((item, index) => {
            if (item.data_type == "自发自用电量（kWh）") {
              messagexydf1 = Number(item.data_value_f);
            }
            if (item.data_type == "协议单价（元/kWh）") {
              messagexydf2 = Number(item.data_value_f);
            }
          });
          return (row.data_value_f = this.myFixed(messagexydf1 * messagexydf2, 2));
          break;
        case "节省电费（元）":
          let messagejsdf1 = 0;
          let messagejsdf2 = 0;
          this.tableData.t_monthly_bill_list.forEach((item, index) => {
            if (item.data_type == "市电电费（元）") {
              messagejsdf1 = Number(item.data_value_f);
            }
            if (item.data_type == "协议电费（元）") {
              messagejsdf2 = Number(item.data_value_f);
            }
          });
          return (row.data_value_f = this.myFixed(messagejsdf1 - messagejsdf2, 2));
          break;
      }
    },
    data_value_pCount(row) {
      switch (row.data_type) {
        case "自发自用电量（kWh）":
          let message = 0;
          this.tableData.t_monthly_electricity_bill_details.forEach((item, index) => {
            if (item.dnbmc == "自发自用电量") {
              message = item.data_value_p;
            }
          });
          return (row.data_value_p = message);
          break;
        case "市电单价（元/kWh）":
          return this.myFixed(row.data_value_p, 5);
          break;
        case "市电电费（元）":
          let messagesddfp1 = 0;
          let messagesddfp2 = 0;
          this.tableData.t_monthly_bill_list.forEach((item, index) => {
            if (item.data_type == "自发自用电量（kWh）") {
              messagesddfp1 = Number(item.data_value_p);
            }
            if (item.data_type == "市电单价（元/kWh）") {
              messagesddfp2 = Number(item.data_value_p);
            }
          });
          return (row.data_value_p = this.myFixed(messagesddfp1 * messagesddfp2, 2));
          break;
        case "协议单价（元/kWh）":
          // let messagexydf = 0;
          // this.tableData.t_monthly_bill_list.forEach((item, index) => {
          //   if (item.data_type == "市电单价（元/kWh）") {
          //     messagexydf = Number(item.data_value_p) * (this.excelAllData.discount_rate / 100);
          //   }
          // });
          return (row.data_value_p = this.myFixed(row.data_value_p, 5));
          break;
        case "协议电费（元）":
          let messagexydf1 = 0;
          let messagexydf2 = 0;
          this.tableData.t_monthly_bill_list.forEach((item, index) => {
            if (item.data_type == "自发自用电量（kWh）") {
              messagexydf1 = Number(item.data_value_p);
            }
            if (item.data_type == "协议单价（元/kWh）") {
              messagexydf2 = Number(item.data_value_p);
            }
          });
          return (row.data_value_p = this.myFixed(messagexydf1 * messagexydf2, 2));
          break;
        case "节省电费（元）":
          let messagejsdf1 = 0;
          let messagejsdf2 = 0;
          this.tableData.t_monthly_bill_list.forEach((item, index) => {
            if (item.data_type == "市电电费（元）") {
              messagejsdf1 = Number(item.data_value_p);
            }
            if (item.data_type == "协议电费（元）") {
              messagejsdf2 = Number(item.data_value_p);
            }
          });
          return (row.data_value_p = this.myFixed(messagejsdf1 - messagejsdf2, 2));
          break;
      }
    },
    data_value_gCount(row) {
      switch (row.data_type) {
        case "自发自用电量（kWh）":
          let message = 0;
          this.tableData.t_monthly_electricity_bill_details.forEach((item, index) => {
            if (item.dnbmc == "自发自用电量") {
              message = item.data_value_g;
            }
          });
          return (row.data_value_g = message);
          break;
        case "市电单价（元/kWh）":
          return this.myFixed(row.data_value_g, 5);
          break;
        case "市电电费（元）":
          let messagesddfg1 = 0;
          let messagesddfg2 = 0;
          this.tableData.t_monthly_bill_list.forEach((item, index) => {
            if (item.data_type == "自发自用电量（kWh）") {
              messagesddfg1 = Number(item.data_value_g);
            }
            if (item.data_type == "市电单价（元/kWh）") {
              messagesddfg2 = Number(item.data_value_g);
            }
          });
          return (row.data_value_g = this.myFixed(messagesddfg1 * messagesddfg2, 2));
          break;
        case "协议单价（元/kWh）":
          // let messagexydf = 0;
          // this.tableData.t_monthly_bill_list.forEach((item, index) => {
          //   if (item.data_type == "市电单价（元/kWh）") {
          //     messagexydf = Number(item.data_value_g) * (this.excelAllData.discount_rate / 100);
          //   }
          // });
          return (row.data_value_g = this.myFixed(row.data_value_g, 5));
          break;
        case "协议电费（元）":
          let messagexydf1 = 0;
          let messagexydf2 = 0;
          this.tableData.t_monthly_bill_list.forEach((item, index) => {
            if (item.data_type == "自发自用电量（kWh）") {
              messagexydf1 = Number(item.data_value_g);
            }
            if (item.data_type == "协议单价（元/kWh）") {
              messagexydf2 = Number(item.data_value_g);
            }
          });
          return (row.data_value_g = this.myFixed(messagexydf1 * messagexydf2, 2));
          break;
        case "节省电费（元）":
          let messagejsdf1 = 0;
          let messagejsdf2 = 0;
          this.tableData.t_monthly_bill_list.forEach((item, index) => {
            if (item.data_type == "市电电费（元）") {
              messagejsdf1 = Number(item.data_value_g);
            }
            if (item.data_type == "协议电费（元）") {
              messagejsdf2 = Number(item.data_value_g);
            }
          });
          return (row.data_value_g = this.myFixed(messagejsdf1 - messagejsdf2, 2));
          break;
      }
    },
    data_value_allCount(row) {
      switch (row.data_type) {
        case "自发自用电量（kWh）":
          let message = 0;
          this.tableData.t_monthly_electricity_bill_details.forEach((item, index) => {
            if (item.dnbmc == "自发自用电量") {
              message = item.data_value_all;
            }
          });
          return (row.data_value_all = message);
          break;
        case "市电单价（元/kWh）":
          let messagesddj1 = 0;
          let messagesddj2 = 0;
          let messagesddj3 = 0;
          this.tableData.t_monthly_bill_list.forEach((item, index) => {
            if (item.data_type == "自发自用电量（kWh）") {
              messagesddj1 = Number(item.data_value_all);
            }
            if (item.data_type == "市电电费（元）") {
              messagesddj2 = Number(item.data_value_all);
            }
          });
          console.log(messagesddj1, messagesddj2);
          messagesddj3 = messagesddj2 / messagesddj1 == "Infinity" || isNaN(messagesddj2 / messagesddj1) ? 0 : messagesddj2 / messagesddj1;

          return (row.data_value_all = this.myFixed(messagesddj3, 5));
          break;
        case "市电电费（元）":
          return (row.data_value_all = this.myFixed(Number(row.data_value_j) + Number(row.data_value_f) + Number(row.data_value_p) + Number(row.data_value_g), 2));
          break;
        case "协议单价（元/kWh）":
          let messagexydj1 = 0;
          let messagexydj2 = 0;
          let messagexydj3 = 0;
          this.tableData.t_monthly_bill_list.forEach((item, index) => {
            if (item.data_type == "协议电费（元）") {
              messagexydj1 = Number(item.data_value_all);
            }
            if (item.data_type == "自发自用电量（kWh）") {
              messagexydj2 = Number(item.data_value_all);
            }
          });
          messagexydj3 = messagexydj1 / messagexydj2 == "Infinity" || isNaN(messagexydj1 / messagexydj2) ? 0 : messagexydj1 / messagexydj2;
          return (row.data_value_all = this.myFixed(messagexydj3, 5));
          break;
        case "协议电费（元）":
          return (row.data_value_all = this.myFixed(Number(row.data_value_j) + Number(row.data_value_f) + Number(row.data_value_p) + Number(row.data_value_g), 2));
          break;
        case "节省电费（元）":
          return (row.data_value_all = this.myFixed(Number(row.data_value_j) + Number(row.data_value_f) + Number(row.data_value_p) + Number(row.data_value_g), 2));
          break;
      }
    },
    data_value_jSum(row) {
      if (row.dnbmc == "发电量合计") {
        let messageSum = 0;
        this.tableData.t_monthly_electricity_bill_details.forEach((item, index) => {
          if (item.jjlx == "发电并网表") {
            messageSum += item.data_value_j ? Number(item.data_value_j) : 0;
          }
        });
        return (row.data_value_j = this.myFixed(messageSum, 2));
      } else if (row.dnbmc == "自发自用电量") {
        let messageSum1 = 0;
        let messageSum2 = 0;
        this.tableData.t_monthly_electricity_bill_details.forEach((item, index) => {
          if (item.jjlx == "上网关口表（反向）") {
            messageSum1 += item.data_value_j ? Number(item.data_value_j) : 0;
          }
          if (item.dnbmc == "发电量合计") {
            messageSum2 = Number(item.data_value_j);
          }
        });
        return (row.data_value_j = this.myFixed(messageSum2 - messageSum1, 2));
      } else {
        this.tableData.t_monthly_bill_details_new.forEach((item, index) => {
          if (row.bjzc_no == item.bjzc_no) {
            row.data_value_j = item.poweruse_j;
          }
        });
        return this.myFixed(row.data_value_j !== null ? Number(row.data_value_j) : null, 2);
      }
    },
    data_value_fSum(row) {
      if (row.dnbmc == "发电量合计") {
        let messageSum = 0;
        this.tableData.t_monthly_electricity_bill_details.forEach((item, index) => {
          if (item.jjlx == "发电并网表") {
            messageSum += item.data_value_f ? Number(item.data_value_f) : 0;
          }
        });
        return (row.data_value_f = this.myFixed(messageSum, 2));
      } else if (row.dnbmc == "自发自用电量") {
        let messageSum1 = 0;
        let messageSum2 = 0;
        this.tableData.t_monthly_electricity_bill_details.forEach((item, index) => {
          if (item.jjlx == "上网关口表（反向）") {
            messageSum1 += item.data_value_f ? Number(item.data_value_f) : 0;
          }
          if (item.dnbmc == "发电量合计") {
            messageSum2 = Number(item.data_value_f);
          }
        });
        return (row.data_value_f = this.myFixed(messageSum2 - messageSum1, 2));
      } else {
        this.tableData.t_monthly_bill_details_new.forEach((item, index) => {
          if (row.bjzc_no == item.bjzc_no) {
            row.data_value_f = item.poweruse_f;
          }
        });
        return this.myFixed(row.data_value_f !== null ? Number(row.data_value_f) : null, 2);
      }
    },
    data_value_pSum(row) {
      if (row.dnbmc == "发电量合计") {
        let messageSum = 0;
        this.tableData.t_monthly_electricity_bill_details.forEach((item, index) => {
          if (item.jjlx == "发电并网表") {
            messageSum += item.data_value_p ? Number(item.data_value_p) : 0;
          }
        });
        return (row.data_value_p = this.myFixed(messageSum, 2));
      } else if (row.dnbmc == "自发自用电量") {
        let messageSum1 = 0;
        let messageSum2 = 0;
        this.tableData.t_monthly_electricity_bill_details.forEach((item, index) => {
          if (item.jjlx == "上网关口表（反向）") {
            messageSum1 += item.data_value_p ? Number(item.data_value_p) : 0;
          }
          if (item.dnbmc == "发电量合计") {
            messageSum2 = Number(item.data_value_p);
          }
        });
        return (row.data_value_p = this.myFixed(messageSum2 - messageSum1, 2));
      } else {
        this.tableData.t_monthly_bill_details_new.forEach((item, index) => {
          if (row.bjzc_no == item.bjzc_no) {
            row.data_value_p = item.poweruse_p;
          }
        });
        return this.myFixed(row.data_value_p !== null ? Number(row.data_value_p) : null, 2);
      }
    },
    data_value_gSum(row) {
      if (row.dnbmc == "发电量合计") {
        let messageSum = 0;
        this.tableData.t_monthly_electricity_bill_details.forEach((item, index) => {
          if (item.jjlx == "发电并网表") {
            messageSum += item.data_value_g ? Number(item.data_value_g) : 0;
          }
        });
        return (row.data_value_g = this.myFixed(messageSum, 2));
      } else if (row.dnbmc == "自发自用电量") {
        let messageSum1 = 0;
        let messageSum2 = 0;
        this.tableData.t_monthly_electricity_bill_details.forEach((item, index) => {
          if (item.jjlx == "上网关口表（反向）") {
            messageSum1 += item.data_value_g ? Number(item.data_value_g) : 0;
          }
          if (item.dnbmc == "发电量合计") {
            messageSum2 = Number(item.data_value_g);
          }
        });
        return (row.data_value_g = this.myFixed(messageSum2 - messageSum1, 2));
      } else {
        this.tableData.t_monthly_bill_details_new.forEach((item, index) => {
          if (row.bjzc_no == item.bjzc_no) {
            row.data_value_g = item.poweruse_g;
          }
        });
        return this.myFixed(row.data_value_g !== null ? Number(row.data_value_g) : null, 2);
      }
    },
    data_value_allSum(row) {
      if (row.dnbmc == "发电量合计") {
        let messageSum = 0;
        this.tableData.t_monthly_electricity_bill_details.forEach((item, index) => {
          if (item.jjlx == "发电并网表") {
            messageSum += item.data_value_all ? Number(item.data_value_all) : 0;
          }
        });
        return (row.data_value_all = this.myFixed(messageSum, 2));
      } else if (row.dnbmc == "自发自用电量") {
        let messageSum1 = 0;
        let messageSum2 = 0;
        this.tableData.t_monthly_electricity_bill_details.forEach((item, index) => {
          if (item.jjlx == "上网关口表（反向）") {
            messageSum1 += item.data_value_all ? Number(item.data_value_all) : 0;
          }
          if (item.dnbmc == "发电量合计") {
            messageSum2 = Number(item.data_value_all);
          }
        });
        return (row.data_value_all = this.myFixed(messageSum2 - messageSum1, 2));
      } else {
        this.tableData.t_monthly_bill_details_new.forEach((item, index) => {
          if (row.bjzc_no == item.bjzc_no) {
            row.data_value_all = item.poweruse_all;
          }
        });
        return this.myFixed(row.data_value_all !== null ? Number(row.data_value_all) : null, 2);
      }
    },
    nownum_j_actSum(row) {
      let message = 0;
      this.tableData.t_monthly_bill_details_new.forEach((item, index) => {
        if (row.bjzc_no == item.bjzc_no) {
          message = item.nownum_j;
        }
      });
      return (row.nownum_j_act = this.myFixed(message, 2));
    },
    nownum_f_actSum(row) {
      let message = 0;
      this.tableData.t_monthly_bill_details_new.forEach((item, index) => {
        if (row.bjzc_no == item.bjzc_no) {
          message = item.nownum_f;
        }
      });
      return (row.nownum_f_act = message);
    },
    nownum_p_actSum(row) {
      let message = 0;
      this.tableData.t_monthly_bill_details_new.forEach((item, index) => {
        if (row.bjzc_no == item.bjzc_no) {
          message = item.nownum_p;
        }
      });
      return (row.nownum_p_act = message);
    },
    nownum_g_actSum(row) {
      let message = 0;
      this.tableData.t_monthly_bill_details_new.forEach((item, index) => {
        if (row.bjzc_no == item.bjzc_no) {
          message = item.nownum_g;
        }
      });
      return (row.nownum_g_act = message);
    },
    nownum_all_actSum(row) {
      let message = 0;
      this.tableData.t_monthly_bill_details_new.forEach((item, index) => {
        if (row.bjzc_no == item.bjzc_no) {
          message = item.nownum_all;
        }
      });
      return (row.nownum_all_act = message);
    },
    nownum_allSum(row) {
      let message = Number(row.nownum_j) + Number(row.nownum_f) + Number(row.nownum_p) + Number(row.nownum_g);
      if (row.nownum_j == null && row.nownum_f == null && row.nownum_p == null && row.nownum_g == null) {
        message = 0;
      }
      return (row.nownum_all = this.myFixed(message, 2));
    },
    formatDate(row) {
      const date = new Date(row);
      const Y = date.getFullYear() + ".";
      const M = date.getMonth() + 1 + ".";
      const D = date.getDate() + " ";
      const h = (date.getHours() + ":").padStart(3, "0");
      const m = (date.getMinutes() + ":").padStart(3, "0");
      const s = (date.getSeconds() + "").padStart(2, "0");
      return Y + M + D;
    },
    formatDateMon(row) {
      const date = new Date(row);
      const Y = date.getFullYear();
      const M = date.getMonth() + 1;
      const D = date.getDate() + " ";
      const h = (date.getHours() + ":").padStart(3, "0");
      const m = (date.getMinutes() + ":").padStart(3, "0");
      const s = (date.getSeconds() + "").padStart(2, "0");
      return Y + "年" + M + "月";
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
    GetQueryString2(name, url) {
      var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
      var r = url.substr(1).match(reg); //获取url中"?"符后的字符串并正则匹配
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
.active {
  background: dodgerblue;
  color: #fff;
}
.headerTab {
  width: 100%;
  height: 40px;
  display: flex;
  margin-left: 20px;
  .tabRight,
  .tabLeft {
    width: 180px;
    height: 100%;
    line-height: 40px;
    text-align: center;
    border: 1px solid dodgerblue;
    cursor: pointer;
  }
  .tabLeft {
    border-right: 0px;
  }
}
.topInfoText {
  display: flex;
  justify-content: space-between;
  span {
    font-weight: 700;
  }
}
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
  .topTable {
    margin-bottom: 20px;
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

    // /* 表格不出现横向滚动条 */
    // /deep/.el-table--scrollable-x .el-table__body-wrapper {
    //   overflow-x: hidden;
    // }

    /deep/.has-gutter {
      td {
        background: #fff;
        color: black;
        text-align: center;
      }
    }
  }
  /deep/.el-descriptions-item__label {
    width: 310px;
  }
  /deep/.el-descriptions-item__label {
    text-align: right;
    background: #fff;
    border: 0px;
    color: #000000;
    font-weight: 700;
    font-size: 16px;
    font-family: "宋体" !important;
  }
  /deep/.el-descriptions-item__cell {
    border: 0px;
    color: #000000 !important;
    font-weight: 700 !important;
    font-size: 16px;
  }
  /deep/.el-descriptions-item__content {
    color: #000000 !important;
    font-weight: 700 !important;
    font-size: 16px;
    font-family: "宋体" !important;
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
.topTable input[type="number"] {
  -moz-appearance: textfield;
  line-height: 18px;
}
.application-add {
  min-height: 100% !important;
}
.el-table {
  overflow-x: auto;
}
.el-table__header-wrapper,
.el-table__body-wrapper,
.el-table__footer-wrapper {
  overflow: visible;
}
.el-table::after {
  position: relative;
}
.el-table--scrollable-x .el-table__body-wrapper {
  overflow: visible;
}
</style>
