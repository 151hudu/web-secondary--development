<template>
  <!-- 定义外层容器标识，宽高百分百 不可删除 -->
  <div class="messagePage" style="width: 100%">
    <div class="typeClass">
      <div class="typeBtn" v-for="item in typeList" :key="item" @click="setItem(item)">
        <span :class="{'spanActive': activeName == item}">{{item}}</span>
        <div v-show="activeName == item" class="lineBorder"></div>
      </div>
    </div>
    <div v-if="activeName !== '通知公告'" id="messageContent" ref="scrollDiv" class="messageContent">
      <div class="messageCard" v-for="x in dataSource" :key="x.id">
        <div class="msgContent">
          <div class="msgTitle">
            <img class="msgImg" src="../pluginTemp/images/msgTitIcon.png" alt="">
            {{intlGetKey(x.info_title)}}
          </div>
          <div class="msgInfo">{{x.info_content}}</div>
          <span class="msgTime">{{x.create_time}}</span>
        </div>
        <div v-if="x.buttons.length > 0" class="msgBottom">
          <div v-for="it,index in x.buttons" :key="index" class="botmBtn" @click="msgBtnClick(it)">
            {{intlGetKey(it.button_name)}}
            <div v-if="index < x.buttons.length - 1" class="activeBotmBtn"></div>
          </div>
        </div>
      </div>
    </div>
    <div v-else id="messageContent" ref="scrollDiv" class="messageContent">
      <div class="messageCardElse" v-for="x in dataSource" :key="x.id" @click="cardBtnClick(x)">
        <span class="messageTime">{{x.last_modify_time}}</span>
        <div class="msgContent">
          <img class="msgImg" src="../pluginTemp/images/msgTitIcon.png" alt="">
          <div class="rightContent">
            <div class="msgTitle">{{x.inform_title}}</div>
            <div class="msgInfo">{{x.inform_content}}</div>
            <span class="msgTime">({{x.create_time}})</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import moment from "moment";
import eventActionDefine from "./components/msgCompConfig";
import utils from "@/utils";
import { querySysInfo,queryAssetById } from "./api/asset"
// import Vue from "vue"
// import {Tabs,TabPane} from "element-ui";
// Vue.use(Tabs)
// Vue.use(TabPane)

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
    intlGetKey: Function
  },
  computed: {
    theme() {
      let {theme_global_config} = this.themeInfo || {
        theme_global_config: {
          "--theme-public-pinPai-color": "rgba(24,144,255,1)",
          "--theme-public-text-color-1": "rgba(12, 13, 14,1)"
        }
      }
      let themeColor = theme_global_config["--theme-public-pinPai-color"]
      let textColor = theme_global_config["--theme-public-text-color-1"]
      return {
        themeColor,
        textColor
      }
    },
  },
  data() {
    return {
      typeList: ['全部','已读','未读','通知公告'],
      activeName: "全部",
      dataSource: [],
      pageSize: 10,
      pageNum: 1,
      scrollHeight: 0,
      count: 0,
    }
  },
  mounted() {
    // console.log('intlGetKey',this.intlGetKey);
    this.getSysInfo()
    this.$refs.scrollDiv.addEventListener('scroll', this.handleScroll, true)
    //用于注册事件定义，不可删除
    let {componentId} = this.customConfig || {};
    componentId &&
    window.componentCenter?.register(
      componentId,
      "comp",
      this,
      eventActionDefine
    );
   
  },
  methods: {
    handleScroll (e) {
      // console.log(e);
      // 加定时器进行节流
      setTimeout(() => {
        if (e.target.scrollTop === 0 && this.count > this.dataSource.length) {
          // 将scrollTop置为10以便下次滑到顶部
          e.target.scrollTop = 10
          // 加载数据
          this.pageNum += 1
          this.getSysInfo()
        }
      }, 500)
    },
    async getSysInfo() {
      this.scrollHeight = this.$refs.scrollDiv ? this.$refs.scrollDiv.scrollHeight : 0
      if (this.activeName !== "通知公告") {
        let parmas = {
          pageSize: this.pageSize,
          pageNum: this.pageNum,
          orderBy: "last_modify_time",
          orderSort: "DESC",
          queryParams: [
            {
              colName: "service_type",
              type: 2,
              value: "4"
            }
          ],
        }
        switch (this.activeName) {
          case "已读":
            parmas.queryParams.push(
              {
                colName: "info_status",
                type: 2,
                value: "2"
              }
            )
          break;
          case "未读":
            parmas.queryParams.push(
              {
                colName: "info_status",
                type: 2,
                value: "1"
              }
            )
          break;
        }
        let { data } = await querySysInfo(parmas)
        this.count = data.totalCount;
        let msgList = []
        msgList = data.results.map(x=>{
          x.create_time = moment(x.create_time).format('YYYY/MM/DD HH:mm');
          return x;
        }).reverse()
        this.dataSource = msgList.concat(this.dataSource)
        console.log(this.dataSource);
      } else {
        let params = {
          asset_id: this.customConfig.assetId,
          count: 99999,
          pageNum: this.pageNum,
          pageSize: this.pageSize
        };
        let {data} = await queryAssetById(params);
        let keys = data[0];
        let values = data[1];
        this.count = data[2];
        let msgList = [];
        msgList = values.map((x) =>{
          let obj = {};
          keys.forEach((element,index) => {
            obj[element.col_name] = x[index]
          });
          obj.create_time = moment(obj.create_time).format('YYYY/MM/DD HH:mm');
          obj.last_modify_time = moment(obj.last_modify_time).format('YYYY/MM/DD HH:mm');
          return obj;
        }).reverse();
        this.dataSource = msgList.concat(this.dataSource)
        console.log('dataSource', this.dataSource);
      }
      if (this.pageNum === 1) {
        // 首次渲染后获取scrollHeight并滑动到底部。
        setTimeout(() => {
          let currScrollHeight = this.$refs.scrollDiv.scrollHeight
          this.$refs.scrollDiv.scrollTo(0, currScrollHeight)
        }, 20)
      } else {
        // 滚动到加载前的位置
        setTimeout(() => {
          let currScrollHeight = this.$refs.scrollDiv.scrollHeight
          this.$refs.scrollDiv.scrollTo(0, currScrollHeight - this.scrollHeight)
        }, 20)
      }
    },
    msgBtnClick(btn){
      console.log(btn);
      if (btn.response_type === '1') {
        window.location.href = btn.url;
      }
    },
    cardBtnClick(item){
      console.log(item);
      window.location.href = item.url;
    },
    setItem(item){
      this.dataSource = []
      this.pageNum = 1
      this.activeName = item;
      switch (item) {
        case "全部":
          this.getSysInfo()
        break;
        case "已读":
          this.getSysInfo()
        break;
        case "未读":
          this.getSysInfo()
        break;
        case "通知公告":
          this.getSysInfo()
        break;
      }
    },
    handleClick(tab, event) {
      console.log(tab, event);
    },
    /**
     * 触发事件 必需，不可删除
     * @param {String} eventName 事件名
     * @param {Array} payload 事件传参
     *
     */
    triggerEvent(eventName, payload) {
      let {componentId, appId} = this.customConfig || {};
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
    do_EventCenter_setValue(value) {
    },
  },
  beforeDestroy () {
    this.$refs.scrollDiv.removeEventListener('scroll', this.handleScroll)
    this.pageNum = 1;
  },
  destroyed() {
    //必需，不可删除
    window.componentCenter?.removeInstance(this.customConfig?.componentId);
  },
};
</script>

<style lang="less" scoped>
.messagePage {
  height: 100vh;
  font-family: 'PingFang SC';
  .typeClass {
    display: flex;
    justify-content: space-around;
    width: 100%;
    height: 44px;
    user-select: none;
    .typeBtn {
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      span  {
        color: #999999;
        font-size: 14px;
        line-height: 16px;
        padding: 0 10px;
      }
      .lineBorder {
        margin-top: 9px;
        width: 32px;
        height: 4px;
        background: linear-gradient(58.84deg, #0454F2 13.51%, #6C69FF 92.04%);
        box-shadow: 0px 5px 5px rgba(4, 84, 242, 0.1);
        border-radius: 2px;
      }
      .spanActive {
        color: #343A43;
        font-size: 16px;
        line-height: 22px;
        font-weight: 500;
      }
    }
  }
  .messageContent::-webkit-scrollbar {
    display: none;
  }
  .messageContent {
    padding-top: 12px;
    width: 100%;
    height: calc(100% - 44px);
    background: #eef0f5;
    overflow-y: scroll;
    .messageCard {
      margin: 0 15px;
      margin-bottom: 30px;
      padding: 16px 16px 12px 16px;
      display: flex;
      flex-direction: column;
      background: #ffffff;
      box-shadow: 0px 2px 6px rgba(4, 84, 242, 0.05), 0px 4px 20px rgba(4, 84, 242, 0.05);
      border-radius: 8px;
      .msgContent {
        width: 100%;
        .msgTitle {
          font-size: 18px;
          display: flex;
          align-items: center;
          color: #343A43;
          font-weight: 600;
          line-height: 26px;
          .msgImg {
            width: 20px;
            height: 20px;
            min-width: 20px;
            min-height: 20px;
            border-radius: 6px;
            margin-right: 8px;
          }
        }
        .msgInfo {
          margin: 12px 0;
          word-break: break-all;
          white-space: pre-wrap;
          color: #373A55;
          font-size: 13px;
          line-height: 16px;
        }
        .msgTime {
          font-size: 12px;
          line-height: 16px;
          color: #959CA6;
        }
      }
      .msgBottom {
        display: flex;
        align-items: center;
        justify-content: space-around;
        margin-top: 16px;
        padding-top: 12px;
        height: 20px;
        border-top: 0.5px solid #E6E9ED;
        .botmBtn {
          position: relative;
          display: flex;
          align-items: center;
          justify-content: center;
          width: 50%;
          font-weight: 400;
          font-size: 14px;
          line-height: 20px;
          color: #0454F2;
          text-shadow: 0px 4px 10px rgba(4, 84, 242, 0.2);
          .activeBotmBtn {
            position: absolute;
            right: 0;
            width: 1px;
            height: 14px;
            border-right: 1px solid #F3F5FA;
          }
        }
      }
    }
    .messageCardElse {
      margin: 0 15px;
      padding-top: 12px;
      margin-bottom: 30px;
      display: flex;
      flex-direction: column;
      .messageTime {
        margin: 0 auto;
        display: inline-block;
        padding: 0 16px;
        height: 30px;
        line-height: 30px;
        font-size: 12px;
        color: #f0f6f6;
        background: #ced7d6;
        border-radius: 30px;
      }
      .msgContent {
        margin-top: 10px;
        display: flex;
        width: 100%;
        .msgImg {
          width: 40px;
          height: 40px;
          min-width: 40px;
          min-height: 40px;
          border-radius: 40px;
          margin-right: 10px;
        }
        .rightContent {
          font-size: 14px;
          padding: 10px;
          width: calc(100% - 20px);
          border-radius: 4px;
          background: #fff;
          .msgTitle {
            color: #393939;
            font-weight: 600;
          }
          .msgInfo {
            margin: 4px 0;
            word-break: break-all;
            white-space: pre-wrap;
            color: #7b7b7b;
            text-indent: 14px;
            line-height: 24px;
            overflow: hidden;
            text-overflow: ellipsis;
            display: -webkit-box;
            -webkit-line-clamp: 3;
            -webkit-box-orient: vertical
          }
          .msgTime {
            color: #7b7b7b;
          }
        }
      }
    }
  }
}
</style>