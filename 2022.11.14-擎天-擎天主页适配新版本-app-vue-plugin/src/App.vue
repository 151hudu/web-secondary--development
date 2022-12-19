<template>
  <!-- 定义外层容器标识，宽高百分百 不可删除 -->
  <div :id="id" style="width: 100%; height: 100%" :ref="id">
    <!-- -->
    <!-- -->
    <div class="contentBox" v-if="!src">
      <div class="shzzfwBox contentBoxSon">
        <div class="newsTitle">
          <div class="newsTitleText">社会组织服务</div>
          <span @click="goMore('shzzfw')">更多>></span>
        </div>
        <div class="content">
          <div class="triangle"></div>
          <div class="news">
            <div class="preview">
              <template v-for="(item, index) in shzzfwData">
                <span class="previewTitle" v-if="index < 6" @click="goIframe(item, 'shzzfw')">{{ item.title }}</span>
              </template>
            </div>
          </div>
        </div>
      </div>
      <div class="ghxmBox contentBoxSon">
        <div class="newsTitle">
          <div class="newsTitleText">工会项目</div>
          <span @click="goMore('ghxm')">更多>></span>
        </div>
        <div class="content">
          <div class="triangle"></div>
          <div class="news">
            <div class="preview">
              <template v-for="(item, index) in ghxmData">
                <span class="previewTitle" v-if="index < 6" @click="goIframe(item, 'ghxm')">{{ item.title }}</span>
              </template>
            </div>
          </div>
        </div>
      </div>
      <div class="zgxqBox contentBoxSon">
        <div class="newsTitle">
          <div class="newsTitleText">职工需求</div>
          <span @click="goMore('zgxq')">更多>></span>
        </div>
        <div class="content">
          <div class="triangle"></div>
          <div class="news">
            <div class="preview">
              <template v-for="(item, index) in zgxqData">
                <span class="previewTitle" v-if="index < 6" @click="goIframe(item, 'zgxq')">{{ item.title }}</span>
              </template>
            </div>
          </div>
        </div>
      </div>
      <div class="gzdtBox contentBoxSon">
        <div class="newsTitle">
          <div class="newsTitleText">工作动态</div>
          <span @click="goMore('gzdt')">更多>></span>
        </div>
        <div class="content">
          <div class="triangle"></div>
          <div class="news">
            <div class="preview">
              <template v-for="(item, index) in gzdtData">
                <span class="previewTitle" v-if="index < 6" @click="goIframe(item, 'gzdt')">{{ item.title }}</span>
              </template>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="botttomTwoTabs" v-if="!src">
      <div class="tabs">
        <img @click="tabclick(1)" v-show="tabshow" class="img1" src="../pluginTemp/images/title1.png" alt="" />
        <div @click="tabclick(1)" v-show="!tabshow" class="img1"><span>政策法规</span></div>
        <div class="spaceDiv"></div>
        <img @click="tabclick(2)" v-show="!tabshow" class="img2" src="../pluginTemp/images/title2.png" alt="" />
        <div @click="tabclick(2)" v-show="tabshow" class="img2"><span>公告通知</span></div>
      </div>
      <div class="tabsContent">
        <div class="tabsContentMain">
          <div class="tabsContentLeft" v-show="tabshow">
            <ul>
              <template v-for="(item, index) in zcfgData">
                <li :key="index" v-if="index < 4 && item.title">
                  <span @click="goIframe(item, 'zcfg')">{{ item.title }}</span>
                </li>
              </template>
            </ul>
          </div>
          <div class="tabsContentRight" v-show="tabshow">
            <ul>
              <template v-for="(item, index) in zcfgData">
                <li :key="index" v-if="index > 3 && index < 7 && item.title">
                  <span @click="goIframe(item, 'zcfg')">{{ item.title }}</span>
                </li>
              </template>
            </ul>
          </div>
          <div class="tabsContentLeft" v-show="!tabshow">
            <ul>
              <template v-for="(item, index) in ggtzData">
                <li :key="index" v-if="index < 4 && item.title">
                  <span @click="goIframe(item, 'ggtz')">{{ item.title }}</span>
                </li>
              </template>
            </ul>
          </div>
          <div class="tabsContentRight" v-show="!tabshow">
            <ul>
              <template v-for="(item, index) in ggtzData">
                <li :key="index" v-if="index > 3 && index < 7 && item.title">
                  <span @click="goIframe(item, 'ggtz')">{{ item.title }}</span>
                </li>
              </template>
            </ul>
          </div>
        </div>
        <div style="display: flex; margin-top: 10px">
          <img class="lookmore" v-show="tabshow" @click="goMore('zcfg')" src="../pluginTemp/images/lookmore.png" alt="" />
          <img class="lookmore" v-show="!tabshow" @click="goMore('ggtz')" src="../pluginTemp/images/lookmore.png" alt="" />
        </div>
      </div>
    </div>
    <iframe v-if="src" :src="src" width="100%" height="1250px" frameborder="0"></iframe>
    <div class="bottomInfo">
      <div>
        <img src="../pluginTemp/images/bottomInfo.png" alt="" />
      </div>
    </div>
  </div>
</template>

<script>
import { queryAssetById } from "./api/asset";
import eventActionDefine from "./components/msgCompConfig";
import "./index.css";
import Vue from "vue";
import Utils from "./utils";

export default {
  //这里写组件英文名称，容器dom的id及事件中心命名均用到这个name，请认真填写
  name: "qingtianMain",
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
      shzzfwData: [],
      ghxmData: [],
      zgxqData: [],
      gzdtData: [],
      zcfgData: [],
      ggtzData: [],
      src: "",
      tabshow: true,
    };
  },
  mounted() {
    console.log(this.customConfig);
    let message = this.customConfig.社会组织服务资产 || "";
    queryAssetById(message).then((res) => {
      this.shzzfwData = this.translatePlatformDataToJsonArray(res).sort(this.compare("create_time"));
    });
    let message2 = this.customConfig.工会项目资产 || "";
    queryAssetById(message2).then((res) => {
      this.translatePlatformDataToJsonArray(res).forEach((item, index) => {
          this.ghxmData.push(item);
      });
      this.ghxmData.sort(this.compare("create_time"));
      console.log(this.ghxmData);
    });
    let message3 = this.customConfig.职工需求资产 || "";
    queryAssetById(message3).then((res) => {
      this.zgxqData = this.translatePlatformDataToJsonArray(res).sort(this.compare("create_time"));
    });
    let message4 = this.customConfig.政策法规资产 || "";
    queryAssetById(message4).then((res) => {
      this.zcfgData = this.translatePlatformDataToJsonArray(res).sort(this.compare("create_time"));
      console.log(this.zcfgData);
    });
    let message5 = this.customConfig.工作动态资产 || "";
    queryAssetById(message5).then((res) => {
      this.gzdtData = this.translatePlatformDataToJsonArray(res).sort(this.compare("create_time"));
    });
    let message6 = this.customConfig.公告通知资产 || "";
    queryAssetById(message6).then((res) => {
      this.ggtzData = this.translatePlatformDataToJsonArray(res).sort(this.compare("create_time"));
    });
    //用于注册事件定义，不可删除
    let { componentId } = this.customConfig || {};
    componentId && window.componentCenter?.register(componentId, "comp", this, eventActionDefine);
    let { buttons, id } = this.customConfig;
    let componentName = this.$vnode.tag.split("-").pop().toLowerCase();
    this.id = id ? `secondary_${componentName}_${id}` : `secondary_${componentName}_${Utils.generateUUID()}`;
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
    compare(key) {
      return function (a, b) {
        //第一个参数是前一个对象，第二个参数是后一个对象,如果从大到小排序，将参数位置调换
        var val1 = a[key];
        var val2 = b[key];
        return val2 - val1; //求差：如果差值大于0，这两个就要对调位置
      };
    },
    tabclick(num) {
      if (num == 1) {
        this.tabshow = true;
      } else {
        this.tabshow = false;
      }
    },
    goIframe(item, type) {
      if (type == "shzzfw") {
        window.location.href = `${this.customConfig.社会组织服务 || ""}&dataId=${item.data_id}`;
      } else if (type == "ghxm") {
        window.location.href = `${this.customConfig.工会项目 || ""}&dataId=${item.data_id}&create_time=${item.create_time}&title=${item.title}`;
      } else if (type == "zgxq") {
        window.location.href = `${this.customConfig.职工需求 || ""}&dataId=${item.data_id}`;
      } else if (type == "zcfg") {
        window.location.href = `${this.customConfig.政策法规 || ""}&dataId=${item.data_id}`;
      } else if (type == "gzdt") {
        window.location.href = `${this.customConfig.工作动态 || ""}&dataId=${item.data_id}`;
      } else if (type == "ggtz") {
        window.location.href = `${this.customConfig.公告通知 || ""}&dataId=${item.data_id}`;
      }
    },
    goMore(type) {
      if (type == "shzzfw") {
        window.location.href = this.customConfig.社会组织服务更多 || "";
      } else if (type == "ghxm") {
        window.location.href = this.customConfig.工会项目更多 || "";
      } else if (type == "zgxq") {
        window.location.href = this.customConfig.职工需求更多 || "";
      } else if (type == "zcfg") {
        window.location.href = this.customConfig.政策法规更多 || "";
      } else if (type == "gzdt") {
        window.location.href = this.customConfig.工作动态更多 || "";
      } else if (type == "ggtz") {
        window.location.href = this.customConfig.公告通知更多 || "";
      }
    },
    translatePlatformDataToJsonArray(originTableData) {
      let originTableHeader = originTableData.data[0];
      let tableHeader = [];
      originTableHeader.forEach((item) => {
        tableHeader.push(item.col_name);
      });
      let tableBody = originTableData.data[1];
      let tableData = [];
      tableBody.forEach((tableItem) => {
        let temp = {};
        tableItem.forEach((item, index) => {
          temp[tableHeader[index]] = item;
        });
        tableData.push(temp);
      });
      return tableData;
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
.contentBox {
  width: 65%;
  margin: auto;
  display: flex;
  justify-content: space-between;
  flex-wrap: wrap;
  .contentBoxSon {
    max-width: 580px;
    width: 49%;
    height: 340px;
    margin-bottom: 20px;
    .newsTitle {
      height: 40px;
      width: 100%;
      background: #f3f6f8;
      display: flex;
      justify-content: space-between;
      line-height: 40px;
      color: #999999;
      box-sizing: border-box;
      border-right: 1px solid #dddddd;
      border-top: 1px solid #dddddd;
      span {
        margin-right: 20px;
        cursor: pointer;
      }
      .newsTitleText {
        background: #076fd3;
        height: 100%;
        width: 145px;
        color: #fff;
        font-weight: 700;
        text-align: center;
        line-height: 40px;
      }
    }
    .content {
      height: calc(100% - 40px);
      width: 100%;
      display: flex;
      .triangle {
        height: 8px;
        width: 8px;
        background: #898989;
        clip-path: polygon(100% 0, 100% 100%, 100% 100%, 0 0);
      }
      .news {
        width: calc(100% - 8px);
        height: 100%;
        border: 1px solid #dddddd;
        border-top-width: 0px;
        .preview {
          height: 100%;
          display: flex;
          flex-direction: column;
          justify-content: flex-start;
          .previewTitle {
            display: block;
            font-size: 16px;
            padding: 0 40px 0 20px;
            line-height: 300%;
            cursor: pointer;
            &:hover {
              color: dodgerblue;
            }
          }
        }
      }
    }
  }
}
.botttomTwoTabs {
  height: 270px;
  width: 100%;
  background: #f3f6f8;
  .tabs {
    height: 45px;
    width: 100%;
    display: flex;
    justify-content: center;
    background: #fff;
    .img1 {
      cursor: pointer;
      text-align: right;
    }
    div {
      cursor: pointer;
      width: 180px;
      span {
        cursor: pointer;
        font-size: 29px;
        font-weight: 700;
        line-height: 45px;
        color: #076fd3;
      }
    }
    .spaceDiv {
      width: 80px;
    }
  }
  .tabsContent {
    height: 185px;
    width: 1200px;
    background: #fff;
    margin: auto;
    margin-top: 20px;
    display: flex;
    flex-direction: column;
    .tabsContentMain {
      display: flex;
      .tabsContentLeft,
      .tabsContentRight {
        width: 50%;
        height: 130px;
        ul {
          height: 100%;
          display: flex;
          flex-direction: column;
          justify-content: flex-start;
          line-height: 200%;
          li {
            margin-left: 10px;
            cursor: pointer;
            &:hover {
              color: dodgerblue;
            }
          }
        }
        ul li::marker {
          color: #d2d8df;
        }
      }
    }
    .lookmore {
      display: block;
      height: 32px;
      width: 120px;
      margin: auto;
      cursor: pointer;
    }
  }
}
.bottomInfo {
  height: 120px;
  width: 100%;
  background: #5e5e5e;
  display: flex;
  justify-content: center;
  div {
    margin-top: 30px;
  }
}
@media (max-width: 500px) {
  .contentBox {
    width: 100%;
    display: flex;
    justify-content: space-between;
    flex-wrap: wrap;
    .contentBoxSon {
      max-width: 580px;
      width: 100%;
      height: 340px;
      margin-bottom: 20px;
      .newsTitle {
        height: 40px;
        width: 100%;
        background: #f3f6f8;
        display: flex;
        justify-content: space-between;
        line-height: 40px;
        color: #999999;
        box-sizing: border-box;
        border-right: 1px solid #dddddd;
        border-top: 1px solid #dddddd;
        span {
          margin-right: 20px;
          cursor: pointer;
        }
        .newsTitleText {
          background: #076fd3;
          height: 100%;
          width: 145px;
          color: #fff;
          font-weight: 700;
          text-align: center;
          line-height: 40px;
        }
      }
      .content {
        height: calc(100% - 40px);
        width: 100%;
        display: flex;
        .triangle {
          height: 8px;
          width: 8px;
          background: #898989;
          clip-path: polygon(100% 0, 100% 100%, 100% 100%, 0 0);
        }
        .news {
          width: calc(100% - 8px);
          height: 100%;
          border: 1px solid #dddddd;
          border-top-width: 0px;
          .preview {
            height: 100%;
            display: flex;
            flex-direction: column;
            justify-content: space-around;
            .previewTitle {
              display: block;
              font-size: 16px;
              padding: 0 40px 0 20px;
              cursor: pointer;
              &:hover {
                color: dodgerblue;
              }
            }
          }
        }
      }
    }
  }
  .botttomTwoTabs {
    height: 270px;
    width: 100%;
    background: #f3f6f8;
    .tabs {
      height: 45px;
      width: 100%;
      display: flex;
      justify-content: center;
      background: #fff;
      img {
        // margin-right: 45px;
      }
    }
    .tabsContent {
      height: 185px;
      width: 100%;
      background: #fff;
      margin-top: 20px;
      display: flex;
      flex-direction: column;
      .tabsContentMain {
        display: flex;
        .tabsContentLeft,
        .tabsContentRight {
          width: 50%;
          height: 130px;
          ul {
            height: 100%;
            display: flex;
            flex-direction: column;
            justify-content: space-around;
            li {
              margin-left: 10px;
              cursor: pointer;
              &:hover {
                color: dodgerblue;
              }
            }
          }
          ul li::marker {
            color: #d2d8df;
          }
        }
      }
      .lookmore {
        display: block;
        height: 32px;
        width: 120px;
        cursor: pointer;
      }
    }
  }
  .bottomInfo {
    height: 100px;
    width: 100%;
    background: #5e5e5e;
    display: flex;
    div {
      width: 100%;
      margin-top: 30px;
      img {
        width: 100%;
        height: 100%;
      }
    }
  }
}
#container {
  overflow: scroll !important;
}
</style>
