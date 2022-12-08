<template>
  <div :style="{ width: '100%', height: '100%' }">
    <!-- <button @click="mockActions">123</button>
    <button @click="mockActions2">123</button> -->
    <video ref="alertAudioEl" :src="bellSrc" autoplay muted @click="bellFillChange" width="0" height="0"></video>
    <el-popover placement="bottom" width="230" trigger="click" popper-class="selectRule">
      <el-table
        ref="multipleTable"
        :data="ruleAssetData"
        @selection-change="handleSelectionChange"
        row-key="data_id"
        :header-cell-style="{ background: 'rgba(91, 141, 165, 0.2)', fontWeight: 400 }"
      >
        <el-table-column align="center" type="selection" width="35" reserve-selection> </el-table-column>
        <el-table-column align="left" show-overflow-tooltip width="160" property="guizemingcheng" label="规则名称"></el-table-column>
      </el-table>
      <div class="bellBackground" slot="reference">
        <img v-show="fillShow" src="../pluginTemp/images/bell-fill.png" width="22px" height="22px" alt="" />
        <img v-show="!fillShow" src="../pluginTemp/images/bell.png" width="22px" height="22px" alt="" />
      </div>
    </el-popover>
  </div>
</template>

<script>
import { queryAssetById, user } from "./api/asset";
import bwm from "../pluginTemp/images/bmw.png";
import Utils from "../utils/index";
import configJson from "../pluginTemp/config.json";
export default {
  name: "place6Bell",
  props: {
    customConfig: Object,
    options: Object,
    componentId: String,
    updateProcess: Function,
  },
  data() {
    return {
      id: "",
      fillShow: false,
      gridData: [],
      externalVariables: {},
      ruleAssetData: [],
      userData: {},
      alarmData: {},
      multipleSelection: [],
      bellSrc: require("../pluginTemp/video/bell.mp3"),
    };
  },
  created() {},
  mounted() {
    this.$forceUpdate();
    const events = [];
    const actions = [
      {
        key: "getWarnningMessage",
        name: "获取报警信息",
        params: [
          {
            key: "info",
            name: "信息",
            dataType: "object",
          },
        ],
        hasReturn: false,
      },
    ];
    window.componentCenter?.register &&
      window.componentCenter.register(this.componentId, "comp", this, {
        events,
        actions,
      });
    this.updateProcess && this.updateProcess();
    // var utterThis = new window.SpeechSynthesisUtterance("21321312312");
    // window.speechSynthesis.cancel();
    // window.speechSynthesis.speak(utterThis);
    user().then((res) => {
      this.userData = res.data;
      this.alarmData[this.userData.id] = {};
      this.alarmData[this.userData.id].userId = this.userData.id;
      this.alarmData[this.userData.id].device = {};
      JSON.parse(window.localStorage.getItem("alarmData")) ? (this.alarmData = JSON.parse(window.localStorage.getItem("alarmData"))) : console.log();
      window.localStorage.setItem("alarmData", JSON.stringify(this.alarmData));
      process.env.NODE_ENV == "development"
        ? (this.bellSrc = this.bellSrc)
        : (this.bellSrc = `${window.location.origin}/storage_area/devops/dataflow/secondary_dev/123456789/${configJson.id}/video/bell.mp3`);
    });
    this.externalVariables = JSON.parse(JSON.stringify(this.options.externalVariables));
    this.externalVariables.固定时间 ? (this.externalVariables.固定时间 = this.externalVariables.固定时间 * 1000) : (this.externalVariables.固定时间 = 3000);
    let message = this.externalVariables.规则AssetID;
    queryAssetById(message).then((res) => {
      this.ruleAssetData = Utils.translatePlatformDataToJsonArray(res);
      let info = (window.localStorage.getItem("alarmData") && JSON.parse(window.localStorage.getItem("alarmData"))[this.userData.id]?.multipleSelection) || [];
      this.multipleSelection = info;
      info.forEach((item, index) => {
        this.ruleAssetData.forEach((itemSon, indexSon) => {
          if (item.data_id == itemSon.data_id) {
            this.$refs.multipleTable.toggleRowSelection(itemSon, true);
          }
        });
      });
    });
  },

  methods: {
    handleSelectionChange(val) {
      let message = {};
      this.multipleSelection = val;
      console.log(this.multipleSelection);
      // this.multipleSelection.forEach((item) => {
      //   message[item.alarm_type] = {
      //     deviceName: item.alarm_type,
      //     deviceTime: +new Date(),
      //     lastTime: "",
      //   };
      // });
      for (let k in this.alarmData[this.userData.id].device) {
        for (let k2 in this.alarmData[this.userData.id].device[k]) {
          console.log(this.multipleSelection);
          this.multipleSelection.forEach((item) => {
            if (item.alarm_type.indexOf(k2) == -1) {
              delete this.alarmData[this.userData.id].device[k][k2];
            }
          });
        }
      }

      this.alarmData[this.userData.id].multipleSelection = this.multipleSelection;
      // this.alarmData[this.userData.id].device = message;
      window.localStorage.setItem("alarmData", JSON.stringify(this.alarmData));
    },
    mockActions(data) {
      let message = {
        name: "逆变器",
        time: 1669895240363,
        type: "一级",
        status: "未处理",
        content: "062B6没越界警告，位置：东经119°23'28.841'，北纬39°54'19.417'",
        title: "没越界警告",
      };
      this.bellFillChange(message);
    },
    mockActions2(data) {
      let message = {
        name: "变压器",
        time: "2022-11-24",
        type: "二级",
        status: "已处理",
        content: "062B6越界告警，位置：东经116°23'28.841'，北纬39°54'19.417'",
        title: "越界警告",
      };
      this.bellFillChange(message);
    },
    bellFillChange(data) {
      if (typeof data.time == "number") {
        data.time = this.formatDate(data.time);
      }
      if (JSON.stringify(this.alarmData[this.userData.id].device[data.name]) == "{}" || !this.alarmData[this.userData.id].device[data.name]) {
        this.alarmData[this.userData.id].device[data.name] = {};
      }
      window.localStorage.setItem("alarmData", JSON.stringify(this.alarmData));
      this.multipleSelection.forEach((item) => {
        if (!this.alarmData[this.userData.id].device[data.name][item.alarm_type]) {
          this.alarmData[this.userData.id].device[data.name][item.alarm_type] = {
            alarm_type: item.alarm_type,
            lastTime: +new Date() - this.externalVariables.固定时间,
          };
        }
      });
      window.localStorage.setItem("alarmData", JSON.stringify(this.alarmData));
      if (
        this.alarmData[this.userData.id].device[data.name][data.type] &&
        this.alarmData[this.userData.id].device[data.name][data.type].lastTime &&
        +new Date() - this.alarmData[this.userData.id].device[data.name][data.type].lastTime >= this.externalVariables.固定时间
      ) {
        let index = 0;
        let timeRun = setInterval(() => {
          if (index < 6) {
            this.fillShow = !this.fillShow;
            index++;
          } else {
            clearInterval(timeRun);
          }
        }, 500);
        this.$nextTick(() => {
          this.$refs.alertAudioEl.muted = false;
          this.$refs.alertAudioEl.play();
        });
        if (data.status == "已处理") {
          this.$notify({
            title: "",
            customClass: "notify6Place",
            showClose: false,
            dangerouslyUseHTMLString: true,
            // duration: 0,
            message: `<div class='notifyTitle'><div class='notifyTitleGreen'></div>
        <img width='17px' height='17px' src='data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAFdSURBVHgBnZPNTcNAEIVndm0OIBB04BIcib9jtgM6CHQQbhwIOIqEuCUlmA7owOaGFCS2A1xCJI6OPczEceIYJ8i8i9fred/OzI4RGuRH/WMF+1cKlCfvBGAzmFtrnpN6LNaNLh6OeXkNzQpTSodVEK7Nd56LbsRLb8NCugOQ+YTUQ8Au7yQMMSUEd5pZ0+5odchpNOgjwriAfHesmcyUfGDzY5O5rg8zmnBDbiR2WSrg8vSvbaZqBqtM4vtIyuEsTpQGx4eWyil/kefiphjfGqD5WguA8pzVLmWdqXmy9eCzeEC7YCqHPJFF9o9MZMAYsPe6SAt1D1rKBccqa4IZEElTuudvD20g4bsJksUcpOD0uZkJEYUXPCx/OSVWkx4u14Uuo8DLMYuoGKiYC+SsMguoP+tmRdrI6RuAEsJ/XQCI20oJD0jfxlL2GvhbAkph7pczIjd1xM2uGkv9ANGshwzMSOB2AAAAAElFTkSuQmCC' />
        <span>${data.title}</span>
        </div>
        <div class='notifyContent'>${data.content}</div>
        <div class='notifyTimeStatus'><span class='notifyTime'>${data.time}┃</span> &nbsp;
          <div class='notifySuccess'>${data.status}</div>
          </div>
        `,
            position: "bottom-right",
          });
        } else {
          this.$notify({
            title: "",
            customClass: "notify6Place",
            showClose: false,
            dangerouslyUseHTMLString: true,
            // duration: 0,
            message: `<div class='notifyTitle'><div class='notifyTitleRed'></div>
        <img width='17px' height='17px' src='data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAEkSURBVHgBnVLLUcMwEH0rJwNH6MAlxB2EDugg0AEcDQecCxxNCU4H6SA0wMQdkBK4+mCJJ68THFsJY96MPrOz7+1K+wQBuG12BTu95TXWgC0RTUpJ0l0/VwZEuczh3B3CKLiWXSH5Jb/FPDaHqgdECVDPeFlwzbk8+WYvIufJTEjSTpHXB0ZyFakSSbJvo1nyEiIPxZ7eedxr7kXexNrqX6dJqfRj5Gz0OdW1Qe1mGI9Vs3NShj38Q4BjVcSTTpCf8lxi2K7DGRgYs1M+xnfipOQUqrVKmQXGIqKAnyX0U+ac8xiRwptJfYCKBvHmkMJ9erP8CeZi6S+nrPwBa1eoUWJqtgHysZV7IhnU98G22e1j+2wMBI6F6A/beqSZVLXuEvf4AXQEbts7EVIaAAAAAElFTkSuQmCC' />
        <span>${data.title}</span>
        </div>
        <div class='notifyContent'>${data.content}</div>
        <div class='notifyTimeStatus'><span class='notifyTime'>${data.time}┃</span> &nbsp;
          <div class='notifyWarnning'>${data.status}</div>
          </div>
        `,
            position: "bottom-right",
          });
        }
        this.alarmData[this.userData.id].device[data.name][data.type].lastTime = +new Date();
      }
    },
    formatDate(row) {
      const date = new Date(row);
      const Y = date.getFullYear() + "/";
      const M = date.getMonth() + 1 + "/";
      const D = date.getDate() + " ";
      const h = (date.getHours() + ":").padStart(3, "0");
      const m = (date.getMinutes() + ":").padStart(3, "0");
      const s = (date.getSeconds() + "").padStart(2, "0");
      return Y + M + D + h + m + s;
    },
    triggerEvent(data) {
      console.log(data);
      window.eventCenter?.triggerEvent &&
        window.eventCenter.triggerEvent(this.componentId, "assetChangeTip", {
          value: data,
        });
    },
    Event_Center_getName: () => {
      return "6所告警铃铛";
    },
    do_EventCenter_getWarnningMessage(value) {
      console.log(value, 188);
      this.bellFillChange(value.info);
    },
  },
};
</script>
<style lang="less" scoped>
.bellBackground {
  width: 32px;
  height: 32px;
  background: rgba(182, 222, 230, 0.4);
  border-radius: 32px;
  display: flex;
  justify-content: center;
  cursor: pointer;
  img {
    margin: auto auto;
  }
}
</style>
<style lang="less">
.notify6Place {
  padding: 0 !important;
  border: 0px !important;
  border-radius: 0px  !important;
  height: 142px  !important;
  width: 371px !important;
  background: transparent  !important;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1)  !important;
  box-shadow: unset  !important;
  .el-notification__group {
    margin-left: 0px  !important;
  }
  .notifyTitle {
    height: 26px  !important;
    width: 100%  !important;
    display: flex  !important;
    background: linear-gradient(90deg, rgba(133, 182, 197, 0.3) 0%, rgba(2, 7, 18, 0) 100%)  !important;
    img {
      margin-top: 4.5px  !important;
      margin-left: 4.5px  !important;
      margin-right: 10.5px  !important;
    }
    span {
      line-height: 26px  !important;
      color: #fff  !important;
    }
    .notifyTitleRed {
      height: 100%  !important;
      width: 5px  !important;
      background: rgba(255, 207, 135, 1)  !important;
    }
    .notifyTitleGreen {
      height: 100%  !important;
      width: 5px  !important;
      background: rgba(53, 192, 125, 1)  !important;
    }
  }
  .notifyContent {
    margin-top: 12px  !important;
    font-size: 16px  !important;
    line-height: 24px !important;
    color: rgba(255, 255, 255, 0.8)  !important;
  }
  .notifyTimeStatus {
    display: flex !important;
    margin-top: 11px !important;
    .notifyWarnning {
      width: 48px !important;
      height: 20px !important;
      background: rgba(255, 207, 135, 0.2) !important;
      font-size: 12px !important;
      line-height: 20px !important;
      border-radius: 2px !important;
      text-align: center !important;
      color: #ffcf87 !important;
    }
    .notifySuccess {
      width: 48px !important;
      height: 20px !important;
      background: #226b48 !important;
      font-size: 12px !important;
      line-height: 20px  !important;
      border-radius: 2px  !important;
      text-align: center  !important;
      color: rgba(255, 255, 255, 0.8)  !important;
    }
  }

  .el-notification__content {
    margin: 0  !important;
  }
}
</style>
<style lang="less">
.selectRule {
  background: rgba(23, 29, 43, 0.8) !important;
  padding: 16px 16px 16px 16px !important;
  border: 0px !important;
  .popper__arrow {
    display: none !important;
  }
  .el-table__header-wrapper {
    &:hover {
      .el-table__cell {
        background: rgba(91, 141, 165, 0.2) !important;
      }
    }
  }
  .el-checkbox__inner::after {
    border: 1px solid #000 !important;
    border-left: 0 !important;
    border-top: 0 !important;
  }
  .el-table tr {
    &:hover {
      .el-table__cell {
        background: #5b8da5 !important;
      }
    }
  }
  tbody .cell {
    color: #fff !important;
  }
  .el-table__cell {
    padding: 12px 0 !important;
  }
  .el-checkbox__input.is-checked .el-checkbox__inner,
  .el-checkbox__input.is-indeterminate .el-checkbox__inner {
    background: #b6dee6 !important;
    border: #b6dee6 !important;
  }
  .el-table,
  .el-table tr {
    background: transparent !important;
  }
  .el-table td.el-table__cell,
  .el-table th.el-table__cell.is-leaf {
    border: 0px !important;
  }
  .el-table::before {
    /* 去除下边框 */
    height: 0 !important;
  }
}
</style>
