<template>
  <!-- 定义外层容器标识，宽高百分百 不可删除 -->
  <div class="messagePage" style="width: 100%;height: 100%">
    <div class="typeClass">
      <span :class="{'spanActive': selectItem == item}" v-for="item in typeList" :key="item" @click="setItem(item)">{{item}}</span>
    </div>
    <div id="messageContent" ref="scrollDiv" class="messageContent">
      <div class="messageCard" v-for="x in dataSource" :key="x.id">
        <span class="messageTime">{{x.last_modify_time}}</span>
        <div class="msgContent">
          <img class="msgImg" src="https://gimg2.baidu.com/image_search/src=http%3A%2F%2Fc-ssl.duitang.com%2Fuploads%2Fblog%2F202107%2F09%2F20210709142454_dc8dc.thumb.1000_0.jpeg&refer=http%3A%2F%2Fc-ssl.duitang.com&app=2002&size=f9999,10000&q=a80&n=0&g=0n&fmt=auto?sec=1669191133&t=3b2296a85fe840effb1f895b300bdbe7" alt="">
          <div class="rightContent">
            <div class="msgTitle">{{x.info_title}}</div>
            <div class="msgInfo">{{x.info_content}}</div>
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
import { querySysInfo } from "./api/asset"
import Vue from "vue"
// import {} from "element-ui";
// Vue.use()

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
    themeInfo: Object
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
      typeList: ['全部','未读','抄送','待办审批'],
      selectItem: "全部",
      dataSource: [],
      pageSize: 10,
      pageNum: 1,
      temp: null,
      scrollHeight: 0,
      count: 0
    }
  },
  mounted() {
    this.getSysInfo()
    // window.addEventListener("scroll", this.handleScroll, true);
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
    setItem(item){
      this.selectItem = item;
    },
    async getSysInfo() {
      this.scrollHeight = this.$refs.scrollDiv ? this.$refs.scrollDiv.scrollHeight : 0
      let parmas = {
        pageSize: this.pageSize,
        pageNum: this.pageNum,
        orderBy: "last_modify_time",
        orderSort: "DESC",
        queryParams: [],
      }
      let { data } = await querySysInfo(parmas)
      this.count = data.totalCount;
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
      let msgList = []
      msgList = data.results.map(x=>{
        x.create_time = moment(x.create_time).format('YYYY-MM-DD HH:mm:ss');
        x.last_modify_time = moment(x.last_modify_time).format('YYYY-MM-DD HH:mm:ss');
        return x;
      }).reverse()
      this.dataSource = msgList.concat(this.dataSource)
      console.log(this.dataSource);
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
    // window.removeEventListener("scroll", this.handleScroll, true);
    clearTimeout(this.temp);
    this.temp = null;
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
  .typeClass {
    width: 100%;
    height: 50px;
    user-select: none;
    color: #393939;
    font-size: 16px;
    font-weight: 600;
    line-height: 50px;
    span {
      padding: 0 10px;
    }
    .spanActive {
      color: #6299c3;
    }
  }
  .messageContent::-webkit-scrollbar {
    display: none;
  }
  .messageContent {
    width: 100%;
    height: calc(100% - 50px);
    background: #f0eff4;
    overflow-y: auto;
    .messageCard {
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
            word-break: break-all;
            white-space: pre-wrap;
            color: #7b7b7b;
            text-indent: 14px;
            line-height: 24px;
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