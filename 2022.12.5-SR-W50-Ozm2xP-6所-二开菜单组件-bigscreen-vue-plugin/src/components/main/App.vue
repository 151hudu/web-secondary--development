<template>
  <div
    class="bigscreen_secondary"
    :style="{
      width: '100%',
      height: '100%',
    }"
    ref="bigscreen_secondary"
    :id="id"
  >
    <div class="mainMenuBac" :style="{ height: this.mainHeight, width: this.mainWidth }">
      <div class="tilteImg">
        <img src="../../../pluginTemp/images/功能导航.png" alt="" />
      </div>
      <ul>
        <template v-for="(item, index) in this.menuData">
          <el-popover v-if="!item.parent_id" :key="index" popper-class="secondLevelMenu" placement="right" width="200" trigger="hover">
            <div class="popoverContent" v-for="(element, indexSon) in item.children" :key="indexSon" @click="menuClick(element)">
              <div class="Ostyle"></div>
              <span> {{ element.name }} </span>
            </div>
            <div class="firstLevelMenu" slot="reference" @click="menuClick(item)">
              <img :src="item.icon || require('../../../pluginTemp/images/菜单.png')" height="20px" width="20px" alt="" />
              <span>{{ item.name }}</span>
              <i class="el-icon-caret-right" v-if="item.children.length > 0"></i>
            </div>
          </el-popover>
        </template>
      </ul>
    </div>
  </div>
</template>

<script>
import { Carousel, CarouselItem, Popover, Icon } from "element-ui";
import Vue from "vue";
import MsgCompConfig from "./msgCompConfig.js";
import Utils from "@/utils/index.js";
import { queryAssetById } from "../../api/asset";
import configJson from "../../../pluginTemp/config.json";
import mockData from "@/components/development/mockData.js";
import "element-ui/lib/theme-chalk/index.css";
Vue.use(Popover);
Vue.use(Icon);
export default {
  name: "Main",
  components: {},
  data() {
    return {
      id: "",
      menuData: [],
      mainHeight: "100%",
      mainWidth: "960px",
    };
  },
  props: {
    pubSub: Object,
    data: Object | Array,
    bigscreen: Object,
    block: Object,
    componentId: String,
    configuration: Object,
    options: Object,
    updateProcess: Function,
  },
  created() {},
  mounted() {
    console.log(this.bigscreen, this.block);
    let message = this.options?.externalVariables?.菜单资产ID;
    queryAssetById(message).then((res) => {
      let info = Utils.translatePlatformDataToJsonArray(res);
      // let info = Utils.translatePlatformDataToJsonArray({
      //   code: 10019001,
      //   data: [
      //     [
      //       {
      //         asset_id: "ca24c329-a433-45fa-bec7-e1ea870439ca",
      //         col_datatype: 0,
      //         col_index: 1,
      //         col_name: "name",
      //         displayed: 1,
      //         id: "b3a05112-dbe0-4210-ad82-2ab6154bb8a9",
      //         import_flag: false,
      //         is_ciphertext: false,
      //         is_private: false,
      //         multipleComponentFlag: false,
      //         queryable: 1,
      //       },
      //       {
      //         asset_id: "ca24c329-a433-45fa-bec7-e1ea870439ca",
      //         col_datatype: 8,
      //         col_index: 2,
      //         col_name: "data_id",
      //         displayed: 1,
      //         id: "72529246-c09a-4f79-8f21-4d16863b1995",
      //         import_flag: false,
      //         is_ciphertext: false,
      //         is_private: false,
      //         multipleComponentFlag: false,
      //       },
      //       {
      //         asset_id: "ca24c329-a433-45fa-bec7-e1ea870439ca",
      //         col_datatype: 8,
      //         col_index: 3,
      //         col_name: "parent_id",
      //         displayed: 1,
      //         id: "d1df0634-cbe4-4c77-aa14-e2eccec94c27",
      //         import_flag: false,
      //         is_ciphertext: false,
      //         is_private: false,
      //         multipleComponentFlag: false,
      //       },
      //       {
      //         asset_id: "ca24c329-a433-45fa-bec7-e1ea870439ca",
      //         col_datatype: 0,
      //         col_index: 4,
      //         col_name: "icon",
      //         displayed: 1,
      //         id: "5ced10a5-5e73-446b-b6db-33377ff72bd7",
      //         import_flag: false,
      //         is_ciphertext: false,
      //         is_private: false,
      //         multipleComponentFlag: false,
      //       },
      //     ],
      //     [
      //       ["专题定制", 1, null, null],
      //       ["态势分析", 2, null, "https://lf3-cdn-tos.bytescm.com/obj/static/xitu_juejin_web/6c61ae65d1c41ae8221a670fa32d05aa.svg"],
      //       ["指挥文电", 3, null, null],
      //       ["态势处理", 4, null, null],
      //       ["作战筹划", 5, null, null],
      //       ["行动监控", 6, null, null],
      //       ["任务列表", 7, null, null],
      //       ["敌我势力对比", 51, 5, null],
      //       ["态势分发", 52, 5, null],
      //       ["分发监控", 53, 5, null],
      //       ["复盘回放", 54, 5, null],
      //       ["船舰活动规律", 55, 5, null],
      //       ["导出轨迹", 56, 5, null],
      //     ],
      //     1,
      //   ],
      //   status: 200,
      // });
      info.forEach((item) => {
        item.children = [];
      });
      info.forEach((item) => {
        if (item.parent_id) {
          info.forEach((element) => {
            if (element.data_id == item.parent_id) {
              element.children.push(item);
            }
          });
        }
      });
      this.menuData = info;
    });

    this.pubSub &&
      this.pubSub.subscribe("updateChart" + this.componentId, (data) => {
        this.menuData = Utils.translatePlatformDataToJsonArray(res);
        console.log(this.menuData);
      });
    window.componentCenter?.register && window.componentCenter.register(this.componentId, "comp", this, MsgCompConfig);
    this.updateProcess && this.updateProcess();
    let id = this.options?.externalVariables?.id || Utils.generateUUID();
    const configJsonRequireNum = configJson["requirement-number"] === "需求编号" ? "" : configJson["requirement-number"];
    this.id = `bigscreen_secondary_${configJsonRequireNum}_${id}`;
  },
  methods: {
    // show() {
    //   this.mainHeight = "0%";
    //   this.mainWidth = "0px";
    // },
    menuClick(item) {
      if (item.children.length == 0) {
        this.triggerEvent(item);
      }
    },
    do_EventCenter_showMenu(value) {
      let visible = this.block.baseConfig.visible;
      this.bigscreen.updateBlockById(this.block.baseConfig.id, { baseConfig: { visible: !visible } });
      // if (value.trueOrFalse) {
      //   if (this.mainHeight == "0%") {
      //     this.mainHeight = "100%";
      //     this.mainWidth = "960px";
      //   } else {
      //     this.mainHeight = "0%";
      //     this.mainWidth = "0px";
      //   }
      // }
      // console.log(value);
    },
    triggerEvent(data) {
      console.log(data);
      window.eventCenter?.triggerEvent &&
        window.eventCenter.triggerEvent(this.componentId, "leftMenuClick", {
          value: data,
        });
    },
    Event_Center_getName() {
      return this.id;
    },
  },
};
</script>

<style lang="less" scoped>
.mainMenuBac {
  background: url("../../../pluginTemp/images/list.png");
  overflow: hidden;
  transition: 1s;
}
.tilteImg {
  width: 150px;
  height: 37px;
  margin-left: 48px;
  margin-top: 24px;
  margin-bottom: 10px;
}
ul {
  margin-left: 48px;
  padding: 0;
  // border-right: 1px solid rgba(255, 255, 255, 0.11);
}
.firstLevelMenu {
  cursor: pointer;
  box-sizing: border-box;
  height: 70px;
  width: 250px;
  line-height: 70px;
  font-size: 20px;
  display: flex;
  background: transparent;
  color: rgba(255, 255, 255, 0.5);
  border-bottom: 1px solid;
  border-image: linear-gradient(90deg, rgba(182, 222, 230, 0) 0%, rgba(182, 222, 230, 0.31) 48.76%, rgba(182, 222, 230, 0) 100%) 1;
  img {
    margin-top: 25px;
    margin-right: 32px;
  }
  span {
    display: block;
    width: 185px;
    height: 100%;
    font-family: "PingFang SC";
    font-style: normal;
    font-weight: 500;
  }
  .onePx {
    border-right: 1px solid rgba(182, 222, 230, 0.31);
  }
  /deep/.el-icon-caret-right {
    margin-top: 27px;
    margin-left: 5px;
    font-size: 16px;
  }
  &:hover {
    span {
      color: #b6dee6;
    }
    background: linear-gradient(90deg, rgba(182, 222, 230, 0) 0%, rgba(182, 222, 230, 0.11) 48.76%, rgba(182, 222, 230, 0) 100%);
    border-bottom: 2px solid;
    border-image: linear-gradient(90deg, rgba(182, 222, 230, 0) 0%, rgba(182, 222, 230, 0.71) 48.76%, rgba(182, 222, 230, 0) 100%) 1;
    /deep/.el-icon-caret-right {
      color: #fff;
    }
  }
}
</style>
<style lang="less">
.secondLevelMenu {
  margin-left: 64px !important;
  padding: 0;
  // top: 71px !important;
  background: transparent !important;
  border: 0px;
  .popoverContent {
    height: 100%;
    width: 100%;
    display: flex;
    .Ostyle {
      height: 8px;
      width: 8px;
      margin-left: 24px;
      margin-top: 32px;
      margin-right: 18px;
      border: 1px solid rgba(255, 255, 255, 0.5);
      border-radius: 8px;
    }
    span {
      font-family: "PingFang SC";
      font-style: normal;
      font-weight: 500;
      line-height: 72px;
      font-size: 20px;
      color: rgba(255, 255, 255, 0.5);
      cursor: pointer;
    }
    &:hover {
      .Ostyle {
        height: 8px;
        width: 8px;
        margin-left: 24px;
        margin-top: 32px;
        margin-right: 18px;
        border: 1px solid #b6dee6;
        border-radius: 8px;
        background: #b6dee6;
      }
      span {
        font-family: "PingFang SC";
        font-style: normal;
        font-weight: 500;
        line-height: 72px;
        font-size: 20px;
        color: #b6dee6;
        cursor: pointer;
      }
    }
  }
  .popper__arrow {
    display: none !important;
  }
}
</style>
