<template>
  <!-- 定义外层容器标识，宽高百分百 不可删除 -->
  <div :id="id" style="width: 100%;height: 100%" :ref="id" class="two_list">

    <!-- -->
    <div class="parent_container_two">


      <div class="listClass_two">
        <div class="listClass_tree_two">
          <el-tree :data="dataTree" :render-content="renderContent" accordion @node-click="handleNodeClick"
            :highlight-current="true" :default-expand-all="true">
          </el-tree>
        </div>

      </div>
      <div class="listNode_two">
        <div class="card_two" v-for=" (item,i) in videoList " :key="i">


          <el-card :body-style="{ padding: '0px' }" shadow="never">
            <div class="border_two"></div>
            <div class="body_two">
              <div class="body_two_img" @click="handelClick(item[cameraChannelId],item[cameraName],item.parent_id)">


                <img src="./utils/previw.png" width="100%" height="100%" alt="">
              </div>
              <div class="title_two">

                <span
                  @click="handelClick(item[cameraChannelId],item[cameraName],item.parent_id)">{{item[cameraName]}}</span>

              </div>
            </div>

          </el-card>
        </div>

      </div>
    </div>


    <el-dialog :fullscreen="true" custom-class="two_dialog" :title="title" :visible.sync="dialogVisible" width="90%"
      @close="closeFn">

      <video ref="videoLive" id="videoLive" poster="" class="centeredVideo" muted controls @click="mpegtsClick"></video>
      <!-- <video class="videoPlay" autoplay controls muted id="videoElement"></video> -->
      <!-- <vue-aliplayer-v2 :source="videoItems.url" ref="VueAliplayerV2" :options="options" /> -->


    </el-dialog>
  </div>
</template>

<script>



import eventActionDefine from "./components/msgCompConfig";
import {
  RadioButton,
  RadioGroup, Tree, Row, Col, Card, Dialog, Button
} from "element-ui";
import Vue from "vue"
import utils from "@/utils";
import axios from "axios";
import { queryStartVideo, queryAssetById, queryVideoList, getVideoPlayBackAddress, execute, queryCatalogList } from "@/api/asset.js";
import $ from "jquery"
import mpegtFlvs from "mpegts.js"
import flvjs from 'flv.js'
import VueAliplayerV2 from "vue-aliplayer-v2";
Vue.use(RadioGroup)
Vue.use(RadioButton)
Vue.use(Tree)
Vue.use(Row)
Vue.use(Col)
Vue.use(Card)
Vue.use(Dialog)
Vue.use(Button)

export default {
  //这里写组件英文名称，容器dom的id及事件中心命名均用到这个name，请认真填写
  name: "ButtonChange",
  components: {
    VueAliplayerV2
  },
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
      let { theme_global_config } = this.themeInfo || {
        theme_global_config: {
          "--theme-public-pinPai-color": "rgba(24,144,255,1)",
          "--theme-public-text-color-1": "rgba(12, 13, 14,1)"
        }
      }

      let themeColor = theme_global_config["--theme-public-pinPai-color"]
      let textColor = theme_global_config["--theme-public-text-color-1"]
      this.$nextTick(() => {
        let style = `#${this.id} .el-radio-button__inner:hover{
                      color:${this.theme.themeColor};
                      }
                     #${this.id} .el-radio-button.is-active .el-radio-button__inner:hover{
                      color: #FFF;
                      }
                      `
        if (this.$refs[this.id]) {
          this.styleEle = document.createElement("style")
          document.head.appendChild(this.styleEle)
          this.styleEle.innerText = style
        }
      })
      return {
        themeColor,
        textColor
      }
    },
  },
  data() {
    return {
      //必需，不可删除
      id: "",
      dialogVisible: false,
      currentDate: new Date(),
      //业务代码
      selected: "",
      buttons: [],
      defaultValue: "",
      styleEle: null,
      dataTree: [],
      title: '',
      catalogueAssetId: this.customConfig.catalogueAssetId || 'bc674653-bb2a-c8eb-4fdd-dad64d4b860c',
      catalogueName: this.customConfig.catalogueName || 'name',
      catalogueParentId: this.customConfig.catalogueParentId || 'parent_id',
      catalogueId: this.customConfig.catalogueId || 'id',
      cameraAssetId: this.customConfig.cameraAssetId || '49757169-0600-12a4-45d5-25645a90d816',
      cameraId: this.customConfig.cameraId || 'data_id',
      cameraChannelId: this.customConfig.cameraChannelId || 'channelId',
      cameraName: this.customConfig.cameraName || 'channelName',
      parent_id: this.customConfig.parent_id || '123456789',
      videoList: [],
      videoItems: {
        token: '',
        url: ''
      },
      videoLive: {}, // video标签
      mpegtsPlayer: null, // flv对象
      flvPlayer: null,
    }
  },
  mounted() {
    //用于注册事件定义，不可删除
    let { componentId } = this.customConfig || {};
    this.catalogueId = this.customConfig.catalogueId
    componentId &&
      window.componentCenter?.register(
        componentId,
        "comp",
        this,
        eventActionDefine
      );
    let { buttons, id } = this.customConfig
    let componentName = this.$vnode.tag.split("-").pop().toLowerCase()
    this.id = id ? `secondary_${componentName}_${id}` : `secondary_${componentName}_${utils.generateUUID()}`
    let temp = document.querySelector('.two_list')
    this.catalogueId = Boolean(this.catalogueId) ? this.catalogueId : 'id'
    temp.parentNode.style.width = '100%'
    temp.parentNode.style.height = '100%'
    //用于定义接收用户输入
    // this.buttons = JSON.parse(buttons).data;
    // this.defaultValue = JSON.parse(buttons).defaultValue;

    this.queryTree2(this.catalogueAssetId)
    //业务代码
    if (this.defaultValue) {
      this.selected = this.defaultValue
      this.triggerEvent("valueChange",
        {
          value: this.defaultValue
        }
      )
    }
  },
  methods: {
    handleValueChange(value) {
      this.triggerEvent("valueChange",
        {
          value
        }
      )
    },
    //点击最后一级节点
    handleNodeClick(data) {
      // console.log(data);
      if (data.children.length == 0) {
        this.queryViodeListFn(data.id)

      }

      // }
    },

    //查询视频列表接口
    queryViodeListFn(catalogId) {
      // let assetId = '5792802e-3563-1b1c-d379-bd4eabd3479d'
      let assetId = this.cameraAssetId
      queryVideoList(assetId, catalogId).then(res => {
        this.videoList = res.data
      }).catch(err => {

      })
    },
    //查询实时视频
    handelClick(id, title, parent_id) {
      this.dialogVisible = true
      this.title = title
      // this.queryRecording(id)
      queryStartVideo(id).then(res => {

        this.videoItems = res.data
        this.initMpegts()
        // this.createVideo()
      }).catch(err => {
        this.videoItems = {
          token: '',
          url: ''
        }
        this.videoLive = {};
        this.mpegtsPlayer = null;
      })
      execute({ channelId: id, parent_id }).then(res => {
        console.log(res);
      }).catch(err => {
        console.log(err);
      })
    },
    //查询列表数
    queryTree(id) {
      queryAssetById(id).then(res => {

        let temp = utils.translatePlatformDataToJsonArray(res)

        temp.forEach((x, i) => {
          x.label = x[this.catalogueName]
        })
        let a = { id: '123456789', parent_id: '0', name: '' }
        let b = temp.splice(0, 1)
        // temp.push(a)
        // let tree = this.formatTree(temp)
        // this.dataTree = tree
        // this.dataTree[0].id = b[0].id
        // this.dataTree[0].label = b[0].name
        // this.dataTree[0].parent_id = b[0].parent_id

      }).catch(err => {

      })
    },
    queryTree2(id) {
      let parentId = this.parent_id
      queryCatalogList(id, parentId).then(res => {

        let data = res.data
        if (data.length > 0) {
          data.forEach((x, i) => {
            x.label = x[this.catalogueName]
          })

          // let id = window.currentUser?.officeId


          let b = data.splice(0, 1)
          let a = { id: data[0].parent_id, parent_id: '0', name: '' }

          data.push(a)
          this.dataTree = this.formatTree(data)
          this.dataTree[0].id = b[0].id
          this.dataTree[0].label = b[0].label
          this.dataTree[0].parent_id = b[0].parent_id
        }

        console.log(this.dataTree);
      })
    },

    //处理成数显数据
    treeHandler(list) {


      const tree = []

      for (let i = 0, len = list.length; i < len; i++) {
        if (list[i].parent_id) {
          const item = this.queryChildren(list[i], list)

          tree.push(item)
        }
      }

      return tree

    },
    queryChildren(parent, list) {
      const children = []

      for (let i = 0, len = list.length; i < len; i++) {
        if (list[i].parent_id === parent.id) {

          const item = this.queryChildren(list[i], list)

          children.push(item)
        }
      }

      if (children.length) {
        parent.children = children
      }

      return parent
    },
    formatTree(obj) {
      let copyedObj = JSON.parse(JSON.stringify(obj))  //深拷贝源数据
      return copyedObj.filter(parent => {

        let findChildren = copyedObj.filter(child => {

          return parent[this.catalogueId] === child[this.catalogueParentId]
        })
        findChildren.length > 0 ? parent.children = findChildren : parent.children = []
        return parent[this.catalogueParentId] == 0   //返回顶层，依据实际情况判断这里的返回值
      })
    },

    //录播查询
    queryRecording(id) {
      this.dialogVisible = true
      getVideoPlayBackAddress(id).then(res => {

        this.videoItems = res.data
        this.initMpegts()
      }).catch(err => {
        this.videoItems = {
          token: '',
          url: ''
        }
        this.videoLive = {};
        this.mpegtsPlayer = null;
      })
    },


    // 初始化直播窗口
    initMpegts() {

      if (mpegtFlvs.isSupported()) {
        this.videoLive = {};
        this.mpegtsPlayer = null;
        // this.videoLive = this.$refs.videoLive;
        this.videoLive = document.getElementById('videoLive')
        mpegtFlvs.LoggingControl.forceGlobalTag = true;
        this.mpegtsPlayer = mpegtFlvs.createPlayer(
          {
            type: 'flv',
            isLive: true,
            hasAudio: false,
            url: this.videoItems.url
            // url: 'https://rtmp01open.ys7.com:9188/v3/openlive/F97063184_1_1.flv?expire=1666235559&id=503148537140219904&t=f334f828f357e46aed82f5a6b724681cb5feaec419335b248f3d6c149b4513df&ev=100'
          },
          {
            autoCleanupSourceBuffer: true,// 是否自动清理缓存
            // fixAudioTimestampGap: true
          }
        )

        this.mpegtsPlayer.attachMediaElement(this.videoLive)
        this.mpegtsPlayer.load()
        this.mpegtsPlayer.play()

        if (this.videoLive.paused === true) {
          this.mpegtsPlayer.unload()
          this.mpegtsPlayer.detachMediaElement()
        }

        // 监听错误事件
        this.mpegtsPlayer.on(mpegtFlvs.Events.ERROR, (err, errdet) => {
          // 参数 err 是一级异常，errdet 是二级异常
          if (err == mpegtFlvs.ErrorTypes.MEDIA_ERROR) {
            console.log('媒体错误')
            if (this.mpegtsPlayer) this.mpegts_destroy();
            if (errdet == mpegtFlvs.ErrorDetails.MEDIA_FORMAT_UNSUPPORTED) {
              console.log('媒体格式不支持')
              if (this.mpegtsPlayer) this.mpegts_destroy();
            }
          }
          if (err == mpegtFlvs.ErrorTypes.NETWORK_ERROR) {
            console.log('网络错误')
            if (this.mpegtsPlayer) this.mpegts_destroy();
            if (errdet == mpegtFlvs.ErrorDetails.NETWORK_STATUS_CODE_INVALID) {
              console.log('http状态码异常')
              if (this.mpegtsPlayer) this.mpegts_destroy();
            }
          }
          if (err == mpegtFlvs.ErrorTypes.OTHER_ERROR) {
            console.log('其他异常：', errdet)
            if (this.mpegtsPlayer) this.mpegts_destroy();
          }
        })
      }
    },
    // 销毁flv
    mpegts_destroy() {
      if (this.videoLive.paused === false) {
        this.mpegtsPlayer.pause();
        this.mpegtsPlayer.unload();
        this.mpegtsPlayer.detachMediaElement();
      }
      if (this.mpegtsPlayer != null) this.mpegtsPlayer.destroy();
      this.mpegtsPlayer = null;
      this.videoLive = {};
    },
    mpegtsClick() {

      if (this.videoLive.paused === true) {
        // 已断流，重新拉流播放

        this.mpegtsPlayer.attachMediaElement(this.videoLive)
        this.mpegtsPlayer.load()
        this.mpegtsPlayer.play()
      } else {

        this.mpegtsPlayer.unload()
        this.mpegtsPlayer.detachMediaElement()
      }
    },

    createVideo() {
      if (flvjs.isSupported()) {
        this.videoLive = document.getElementById('videoElement')
        this.flvPlayer = flvjs.createPlayer(
          {
            type: 'flv',
            isLive: true,
            hasAudio: false,
            url: this.videoItems.url
          },
          {
            enableWorker: false, // 不启用分离线程
            enableStashBuffer: false, // 关闭IO隐藏缓冲区
            reuseRedirectedURL: true, // 重用301/302重定向url，用于随后的请求，如查找、重新连接等。
            autoCleanupSourceBuffer: true, // 自动清除缓存
            fixAudioTimestampGap: false
          }
        )

        this.flvPlayer.attachMediaElement(videoElement)
        // this.flvPlayer.load();

        if (this.url !== '' && this.url !== null) {
          this.flvPlayer.load()
          this.flvPlayer.play()
        }
      }
      this.flvPlayer.on(flvjs.Events.ERROR, (errType, errDetail) => {
        // alert('网络波动,正在尝试连接中...');
        if (this.flvPlayer) {
          this.reloadVideo(this.flvPlayer)
        }
      })
    },
    reloadVideo(flvPlayer) {
      this.destoryVideo(flvPlayer)
      // this.url为视频播放的路径
      this.createVideo(this.url, 'flv')
    },
    destoryVideo(flvPlayer) {
      flvPlayer.pause()
      flvPlayer.unload()
      flvPlayer.detachMediaElement()
      flvPlayer.destroy()
      flvPlayer = null
    },
    closeFn() {
      this.mpegts_destroy()
    },

    //  事件 必需，不可删除
    //  aram {String} eventName 事件名
    //  aram {Array} payload 事件传参

    triggerEvent(eventName, payload) {
      let { componentId, apparent_id } = this.customConfig || {};
      componentId && apparent_id && window.eventCenter?.triggerEvent(
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
    do_message_setValue(value) {
      this.setValue(value)
    },
    renderContent(h, { node, data, store }) {
      return (
        <div class="edit_tree">
          {node.label}
        </div>
      )
    },
    setValue(value) {
      this.selected = value

    }
  },
  destroyed() {
    //必需，不可删除
    window.componentCenter?.removeInstance(this.customConfig?.componentId);
    //业务代码，不需要记得清除
    document.head.removeChild(this.styleEle)
  },
};
</script>

<style lang="less" scoped>
.parent_container_two {
  display: flex;
  height: 100%;
  justify-content: space-between;

  .listClass_two {
    width: 20%;
    // height: 100%;
    background: white;



    .listClass_tree_two {
      padding: 20px 15px 15px 15px;

      /deep/ .el-tree-node__content {
        margin-right: 10px;
        height: 30px;
        color: #757877;

        .el-tree-node__expand-icon {
          color: #3e403d;
          font-size: 12px;
          margin-left: 10px;
        }

        .el-tree-node__expand-icon.is-leaf {
          color: transparent;
        }

        .edit_tree {
          font-size: 14px;
          font-weight: 500;
          text-indent: 24px;
          height: 28px;
          line-height: 28px;
          margin-left: -22px;
          width: 100%;
        }
      }

      /deep/.el-tree-node.is-current>.el-tree-node__content {
        color: #fff !important;
        background-color: #ffffff;

        .edit_tree {
          background-color: #3354f2 !important;
          border-radius: 4px;
        }
      }
    }
  }

  .listNode_two {
    width: 78%;
    // background: white;
    // display: flex;
    flex-wrap: wrap;
    // justify-content: space-around;

    .el-card__body {
      .border_two {
        border: 1px solid blue;

      }

      .body_two {

        .body_two_img {
          height: 160px;
          padding: 2px 20px 10px 20px;
          cursor: pointer;
        }
      }

      .title_two {
        padding: 2px 20px 10px 15px;

        span {
          color: #3354f2;
          cursor: pointer;
          font-weight: 600;
          display: block;
          width: 100%;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }
      }
    }

    .el-card {
      border-radius: 2px;
    }

    .card_two {
      width: 22%;
      margin-right: 2%;
      margin-bottom: 20px;
      float: left;
    }

    .card_two:nth-child(4n+1) {
      margin-left: 2%;
    }
  }




}

.two_list {

  // /deep/.el-dialog__header {
  //   display: none;
  // }
  .two_dialog {
    height: 100%;
    width: 100%;
  }

  /deep/.el-dialog__body {
    padding: 0px;
    width: 100%;
    height: 94%;
  }
}


.centeredVideo {
  display: block;
  width: 100%;
  height: 100%;
  // height: 93%;
  background: #333;
}

video::-webkit-media-controls-timeline {
  display: none;
}

video::-webkit-media-controls-current-time-display {
  display: none;
}

/* 音量按钮 */
// video::-webkit-media-controls-mute-button {
//   display: none;
// }
/* 音量的控制条 */
// video::-webkit-media-controls-volume-slider {
//   display: none;
// }
/*  播放按钮 */
// video::-webkit-media-controls-play-button {
//   display: none;
// }
</style>
