<template>
  <!-- 定义外层容器标识，宽高百分百 不可删除 -->
  <div :id="qingtianTop" style="width: 100%; height: 100%" :ref="qingtianTop">
    <div class="topOperation">
      <span>{{ uesrName }}，欢迎您！</span>
    </div>
    <img class="banner" src="../pluginTemp/images/banner.png" alt="" />
    <div class="mianView">
      <span @click="goHome">首页</span>
      <div>
        <img @click="goIn" src="../pluginTemp/images/rukou.png" alt="" />
      </div>
    </div>
  </div>
</template>

<script>
// import appService from "@njsdata/app-sdk";
import eventActionDefine from "./components/msgCompConfig";
import "./index.css";
import { user } from "./api/asset";
export default {
  name: "App",
  props: {
    customConfig: Object,
    info: Object,
  },
  data() {
    return {
      uesrName: "",
      homeview: "",
    };
  },
  computed: {
    title() {
      return this.customConfig?.title || "数据构建";
    },
    desc() {
      return this.customConfig?.desc || "描述";
    },
  },
  mounted() {
    this.homeview = window.location.href;
    user().then((res) => {
      if (res.status == 200) {
        this.uesrName = res.data.name;
      }
    });
    let { componentId } = this.customConfig || {};
    componentId && window.componentCenter?.register(componentId, "comp", this, eventActionDefine);
  },
  methods: {
    goIn() {
      window.location.href =
        "https://tyzy.jsghfw.com/jss_zgh_gxpt/applicationview/content/view?appid=ba344e81-9094-dba3-c2f5-dc8c82e4a174&type=view&menuId=00334ed9-3023-7b71-82bc-3da3f9ae5516%233";
    },
    goHome() {
      window.location.href =
        "https://tyzy.jsghfw.com/jss_zgh_gxpt/applicationview/content/view?appid=b83085cc-253f-6f9c-9b01-ff9d17406d45&type=view&menuId=0de69b7f-89fa-a5a7-393b-632b0ba8222e%233";
    },
    triggerEvent() {
      let { componentId, appId } = this.customConfig || {};
      componentId &&
        appId &&
        window.eventCenter?.triggerEventNew({
          objectId: appId,
          componentId: componentId,
          type: "app",
          event: "onImgClick",
          payload: {
            value: "sasdasd",
          },
        });
    },
    do_EventCenter_messageSuccess() {
      alert("动作执行成功！");
    },
    Event_Center_getName() {
      return "应用二开测试";
    },
  },
  destroyed() {
    window.componentCenter?.removeInstance(this.customConfig?.componentId);
  },
};
</script>
<style lang="less" scoped>
.topOperation {
  height: 40px;
  width: 100%;
  background: #073378;
  display: flex;
  justify-content: end;
  span {
    color: #fff;
    font-size: 20px;
    line-height: 40px;
    margin-right: 36px;
  }
  .work {
    margin-right: 360px;
  }
}
.banner {
  width: 100%;
  position: relative;
}
.mianView {
  position: relative;
  height: 70px;
  width: 100%;
  background: #076fd3;
  margin-top: -70px;
  z-index: 100;
  display: flex;
  justify-content: space-between;
  span {
    font-size: 18px;
    color: #fff;
    font-weight: 700;
    line-height: 70px;
    margin-left: 360px;
    cursor: pointer;
  }
  div {
    margin-right: 360px;
    margin-top: 18px;
    cursor: pointer;
  }
}
@media (max-width: 500px) {
  .work {
  }
  .banner {
    height: 150px;
    width: 100%;
  }
  .mianView {
    position: relative;
    height: 70px;
    width: 100%;
    background: #076fd3;
    margin-top: -30px;
    z-index: 100;
    display: flex;
    justify-content: center;
    span {
      font-size: 18px;
      color: #fff;
      font-weight: 700;
      line-height: 70px;
      margin-right: 20px;
      margin-left: 0px;
    }
    div {
      margin-top: 18px;
      margin-right: 0px;
      cursor: pointer;
    }
  }
}
</style>
<style>
.ant-layout-header {
  height: unset !important;
}
.application-block {
  height: 100% !important;
}
.application-route {
  overflow: auto !important;
}
.application-content-route{
  height: unset !important;
  overflow: hidden !important;
}
.application-content-view {
  overflow: auto !important;
  height: unset !important;
  min-height: unset !important;
}
</style>
