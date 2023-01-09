<template>
  <div class="lunb_28" :id="identification" :style="{ width: '100%', height: heightF ? heightF : '100%' }"
    :ref="identification">
    <!-- -->
    <div class="lb_right" ref="lunb_28" style="width: 100%;height: 100%">
      <div class="lb_img" :style="{ width: '100%' }">
        <el-carousel class="lbzj" ref="carousel" height="100%" :autoplay="carouselAuto" :interval="speedTime"
          @change="carouselChange" arrow="never">
          <el-carousel-item v-for="(item, inx) in jqReports" :key="inx">

            <img :src="item[imgField]" width="100%" height="100%" :style="{ objectFit: Picture }" />
            <div class="player_button" v-if="item.viode" @click="videoPlayer(item.viode)">
              <i class="el-icon-caret-right"></i>
            </div>
            <div class="title_text" :title="item[titleField]">
              {{ item[titleField] }}

              <div class="title_time">{{ moment(item[timeField]).format('YYYY-MM-DD HH:mm:ss') }}</div>
            </div>
          </el-carousel-item>
        </el-carousel>
      </div>
    </div>
    <el-dialog custom-class="two_dialog" :visible.sync="dialogVisible" @close="handleClose" width="60%">

      <video width="100%" ref="video" height="100%" :src="videoSrc" controls autoplay></video>
    </el-dialog>


  </div>
</template>

<script>
import { queryAssetById } from '../../api/asset'
export default {
  name: "Main",
  props: {
    customConfig: Object,
    info: Object,
    //应用变量和系统变量 2022.7.26 V8R4C50SPC220需求新加 之前版本取不到appVariables和sysVariables
    appVariables: Array,
    sysVariables: Array,
    //2022.8.11 V8R4C60SPC100需求新加，之前版本取不到themeInfo
    themeInfo: Object,
    //2022.10新加，之前取不到国际化方法
    intlGetKey: Function,
    history: Object,
    mainInit: Function
  },
  computed: {
    assetId() {
      let assetId = this.customConfig?.assetId || 'fe53425-e934-41ce-8396-7d62dcf46f57'
      return assetId
    },
    speedTime() {
      let speedTime = this.customConfig?.speedTime || '1000'
      return Number(speedTime) * 1000
    },

    imgField() {
      let imgField = this.customConfig?.imgField || 'imgUrl'
      return imgField
    },
    titleField() {
      let titleField = this.customConfig?.titleField || 'title'
      return titleField
    },
    videoField() {
      let videoField = this.customConfig?.videoField || 'video'
      return videoField
    },
    timeField() {
      let timeField = this.customConfig?.timeField || 'create_time'
      return timeField
    },
    Picture() {
      let temp = this.customConfig?.pictureTile
      let value
      switch (temp) {
        case '填充':
          value = 'fill'
          break;

        case '原比填充':
          value = 'contain'
          break;
        case '裁剪':
          value = 'cover'
          break;
        default:
          value = 'fill'
      }
      return value
    },
    heightF() {
      let temp = this.customConfig?.height
      return temp
    }
  },
  data() {
    return {
      //必需，不可删除
      id: "",
      temp: null,
      scrollCount: 0,
      scrollDirection: false,
      curIndex: 0,
      jqReports: [
        { imgUrl: 'https://gimg2.baidu.com/image_search/src=http%3A%2F%2Fimg.1ppt.com%2Fuploads%2Fallimg%2F2104%2F1_210414101157_3.JPG&refer=http%3A%2F%2Fimg.1ppt.com&app=2002&size=f9999,10000&q=a80&n=0&g=0n&fmt=auto?sec=1663316034&t=260968e909601298f9e0ce91343ee24a', titleTrans: 'ddd' },
        { imgUrl: 'https://gimg2.baidu.com/image_search/src=http%3A%2F%2Fseopic.699pic.com%2Fphoto%2F50056%2F5125.jpg_wh1200.jpg&refer=http%3A%2F%2Fseopic.699pic.com&app=2002&size=f9999,10000&q=a80&n=0&g=0n&fmt=auto?sec=1663316034&t=a0ccd7bcd1ebb40fca286d61ff191150', titleTrans: '222' },
        { imgUrl: 'https://gimg2.baidu.com/image_search/src=http%3A%2F%2Fpicnew13.photophoto.cn%2F20181121%2Flanseshumakejibeijingsucai-30989032_1.jpg&refer=http%3A%2F%2Fpicnew13.photophoto.cn&app=2002&size=f9999,10000&q=a80&n=0&g=0n&fmt=auto?sec=1663316034&t=7efe1bbd26d46fc40528f2a43d95ed37', titleTrans: '333' },
        { imgUrl: 'https://gimg2.baidu.com/image_search/src=http%3A%2F%2Fpic.vjshi.com%2F2018-11-06%2F4e8b30d282741c3ecc6819ac040601f1%2F00003.jpg%3Fx-oss-process%3Dstyle%2Fwatermark&refer=http%3A%2F%2Fpic.vjshi.com&app=2002&size=f9999,10000&q=a80&n=0&g=0n&fmt=auto?sec=1663316034&t=3879235c8ae02ce8126ba34b069ee44c', titleTrans: 'ddd' },
        { imgUrl: 'https://gimg2.baidu.com/image_search/src=http%3A%2F%2Fpic181.nipic.com%2Ffile%2F20180910%2F26523992_132305292082_2.jpg&refer=http%3A%2F%2Fpic181.nipic.com&app=2002&size=f9999,10000&q=a80&n=0&g=0n&fmt=auto?sec=1663316034&t=9288767c432c2d1ac8ee70100dabfeb4', titleTrans: '444' },
        { imgUrl: 'https://gimg2.baidu.com/image_search/src=http%3A%2F%2Fimg.zcool.cn%2Fcommunity%2F016de95b82c3f5a80120577da70e3a.jpg%403000w_1l_0o_100sh.jpg&refer=http%3A%2F%2Fimg.zcool.cn&app=2002&size=f9999,10000&q=a80&n=0&g=0n&fmt=auto?sec=1663316034&t=069db11f2b65eae370968134656825a3', titleTrans: '55' },
        { imgUrl: 'https://gimg2.baidu.com/image_search/src=http%3A%2F%2Fimg.zcool.cn%2Fcommunity%2F016de95b82c3f5a80120577da70e3a.jpg%403000w_1l_0o_100sh.jpg&refer=http%3A%2F%2Fimg.zcool.cn&app=2002&size=f9999,10000&q=a80&n=0&g=0n&fmt=auto?sec=1663316034&t=069db11f2b65eae370968134656825a3', titleTrans: '55' },
        { imgUrl: 'https://gimg2.baidu.com/image_search/src=http%3A%2F%2Fimg.zcool.cn%2Fcommunity%2F016de95b82c3f5a80120577da70e3a.jpg%403000w_1l_0o_100sh.jpg&refer=http%3A%2F%2Fimg.zcool.cn&app=2002&size=f9999,10000&q=a80&n=0&g=0n&fmt=auto?sec=1663316034&t=069db11f2b65eae370968134656825a3', titleTrans: '55' },
      ],
      //必需，不可删除
      identification: "",
      //业务代码
      selected: "",
      buttons: [],
      defaultValue: "",
      styleEle: null,
      videoSrc: '',
      dialogVisible: false,
      carouselAuto: true,
    };
  },
  mounted() {
    this.$refs.lunb_28.parentNode.parentNode.style.height = "100%";
    this.$refs.lunb_28.parentNode.parentNode.style.width = "100%";
    queryAssetById(this.assetId).then(res => {
      let a = this.Processing(res.data)
      this.jqReports = JSON.parse(JSON.stringify(a))
      this.jqReports.forEach(x => {
        x[this.imgField] = x[this.imgField] && JSON.parse(x[this.imgField])[0]?.url
        x[this.videoField] = x[this.videoField] && JSON.parse(x[this.videoField])[0]?.url
      })
      this.jqReports.sort((a, b) => {
        return new Date(b[this.timeField]) - new Date(a[this.timeField])
      })
      this.jqReports.splice(5, 1)
      // console.log(this.jqReports, '1==============lunb');
    })

    // let a = document.querySelector('.scroll_ul');

    //此方法封装了事件注册，不可删除
    this.mainInit(this);
  },
  methods: {

    carouselChange(e) {

    },
    handleValueChange(value) {
      this.triggerEvent("valueChange",
        {
          value
        }
      )
    },
    videoPlayer(video) {
      this.videoSrc = video
      this.dialogVisible = true
      this.carouselAuto = false
    },

    handleClose() {
      this.carouselAuto = true
      this.$refs.video.pause()
    },
    Processing(arr) {
      let headerData = arr[0]
      let bodyData = arr[1]
      // console.log(headerData);
      let tableData = bodyData.map(x => {
        let ret = {};
        x.forEach((item, index) => {
          ret[headerData[index].col_name] = item;
        });
        return ret
      })
      return tableData


    },
    /**
     * 封装的触发事件方法 必需，不可删除
     * @param {String} eventName 事件名
     * @param {Object} payload 事件传参
     *
     */
    triggerEvent(eventName, payload) {
      let { componentId, appId } = this.customConfig || {};
      componentId && appId && window.eventCenter?.triggerEvent(
        componentId,
        eventName,
        payload
      );
    },
    //必需，不可删除
    Event_Center_getName() {
      return this.id;
    }
  },
  beforeDestroy() {
    window.componentCenter?.removeInstance(this.customConfig?.componentId);
  }
};
</script>

<style lang="less" scoped>
.lunb_28 {

  display: flex;
  flex-direction: column;
  caret-color: rgba(0, 0, 0, 0);

  .lbzj {
    border-radius: 10px;

    /deep/ .el-carousel__arrow {
      background-color: rgba(31, 45, 61, .7);
      font-size: 18px;
      line-height: 36px;
    }
  }

  .lb_right {
    display: flex;

    .lb_img {

      // width: 76%;
      // height: 100%;
      box-sizing: border-box;
      padding-bottom: 0.5%;
      position: relative;
      border-radius: 10px;

      .lbzj {
        width: 100%;
        height: 100%;


      }

      .player_button {
        width: 100px;
        height: 100px;
        border-radius: 50%;
        border: 6px solid rgba(255, 255, 255, );
        position: absolute;
        background-color: rgba(77, 76, 76, );
        bottom: 0;
        top: 0;
        left: 0;
        right: 0;
        margin: auto;
        cursor: pointer;
        display: flex;
        justify-content: center;
        align-items: center;
        font-size: 96px;
        color: rgba(255, 255, 255, );
        opacity: 0.5;
      }

      .title_text {
        width: 100%;
        height: 35%;
        font-weight: 700;
        font-size: 20px;
        line-height: 100px;
        color: #ffffff;
        // background: rgba(0, 0, 0, 0.4);
        padding-left: 20px;
        // padding-left: 25%;
        position: absolute;
        bottom: 0;
        box-sizing: border-box;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;

        .title_time {
          position: absolute;
          bottom: 30px;
          line-height: initial;
          font-size: 14px;
          font-weight: 500;
          color: rgba(255, 255, 255, .7)
        }
      }
    }

    .lb_list {
      width: 24%;
      height: 100%;
      padding: 0 0 0 3.2%;
      box-sizing: border-box;
      position: relative;

      .icon_top {
        width: 40px;
        height: 40px;
        text-align: center;
        border-radius: 40px;
        line-height: 40px;
        background: rgba(77, 76, 76, .7);
        position: absolute;
        left: 50%;
        bottom: 0;
        z-index: 999;
        color: #fff;
        cursor: pointer;

      }

      .icon_bottom {
        bottom: none;
        top: 0;
      }

      .list_body {
        width: 100%;
        // height: calc(100% - 15px);
        height: 100%;

        ul {
          margin: 0;
          height: 100%;
          padding: 0px 12px 0px 0;
          overflow-y: scroll;

          &::-webkit-scrollbar {
            display: none;
          }

          scroll-behavior: smooth;
        }

        li {

          // padding-left: 24px;
          height: 20%;
          font-weight: 400;
          font-size: 18px;
          line-height: 25px;
          color: #00effe;
          list-style: none;

          padding: 1%;
          padding-bottom: 3%;
          border-radius: 10px;
          // overflow: hidden;
          box-sizing: border-box;
          text-overflow: ellipsis;
          white-space: nowrap;
          cursor: pointer;


          // position: relative;

          .temp {
            width: 100%;
            height: 100%;
            border-radius: 10px;
            position: relative;
          }

          img {
            width: 100%;
            height: 100%;
            position: relative;
            z-index: 1;
            border-radius: 10px;
          }

          .bof {
            width: 30%;
            height: 100%;
            background: rgba(26, 128, 102, .8);
            border-radius: 10px 0 0 10px;
            // float: left;


            position: absolute;
            top: 0;
            z-index: 9;
            display: none;

            .el-icon-caret-left {
              color: #fff;
              font-size: 30px
            }

            // .sanj {
            //   width: 0;
            //   height: 0;


            //   border: 10px solid;
            //   border-color: transparent transparent transparent #fff
            // }

            // left: 1%;
          }

          .exhibitr {
            display: flex;
            justify-content: center;
            align-items: center;
            // width: 30%;
            // transition: all 1s;
            // border-radius: 10px 0 0 10px;
            animation-name: bounce_left;
            animation-duration: 1000ms;
            animation-fill-mode: forwards;
          }

          @keyframes bounce_left {
            0% {
              width: 0;
              animation-timing-function: ease-in;
              opacity: 1;
            }


            100% {
              width: 30%;
              // transform: translateX(0px);
              animation-timing-function: ease-out;
              opacity: 1;
            }
          }
        }

        // .brak {

        //   text-shadow: 0px 0px 14px rgba(182, 224, 255, 0.3);
        //   position: relative;

        //   &:before {
        //     content: "";
        //     display: block;
        //     position: absolute;
        //     width: 3px;
        //     height: 25px;

        //     border-radius: 1px;
        //     left: 5px;
        //   }
        // }
      }
    }
  }

  .lb_bottom {
    width: 100%;
    height: 20%;
    // padding: 0 0 0 3.2%;
    box-sizing: border-box;
    position: relative;

    .icon_left {
      width: 25px;
      height: 25px;
      text-align: center;
      border-radius: 25px;
      line-height: 25px;
      background: rgba(77, 76, 76, .7);
      position: absolute;
      right: 0;
      bottom: 40%;
      z-index: 999;
      color: #fff;
      cursor: pointer;

    }

    .icon_bottom {
      right: none;
      left: 0;
    }

    .list_body {
      width: 100%;
      // height: calc(100% - 15px);
      height: 100%;

      ul {
        margin: 0;
        height: 100%;
        padding: 0px 12px 0px 0;
        overflow-x: scroll;
        display: flex;

        &::-webkit-scrollbar {
          display: none;
        }

        scroll-behavior: smooth;
      }

      li {

        // padding-left: 24px;
        width: 25%;
        margin-right: 3px;
        height: 100%;
        font-weight: 400;
        font-size: 18px;
        line-height: 25px;
        color: #00effe;
        list-style: none;
        flex: none;
        // float: left;
        padding: 0.2%;
        // padding-bottom: 3%;
        border-radius: 10px;
        // overflow: hidden;
        box-sizing: border-box;
        text-overflow: ellipsis;
        white-space: nowrap;
        cursor: pointer;


        // position: relative;

        .temp {
          width: 100%;
          height: 100%;
          border-radius: 10px;
          position: relative;
        }

        img {
          width: 100%;
          height: 100%;
          position: relative;
          z-index: 1;
          border-radius: 10px;
        }

        .bof {
          width: 100%;
          height: 40%;
          background: rgba(26, 128, 102, .8);
          border-radius: 10px 10px 0 0;
          // float: left;


          position: absolute;
          top: 0;
          z-index: 9;
          display: none;

          .el-icon-caret-bottom {
            color: #fff;
            font-size: 30px
          }

          // .sanj {
          //   width: 0;
          //   height: 0;


          //   border: 10px solid;
          //   border-color: transparent transparent transparent #fff
          // }

          // left: 1%;
        }

        .exhibit {
          display: flex;
          justify-content: center;
          align-items: center;
          // width: 30%;
          // transition: all 1s;
          // border-radius: 10px 0 0 10px;
          animation-name: bounce_botom;
          animation-duration: 1000ms;
          animation-fill-mode: forwards;
        }

        @keyframes bounce_botom {
          0% {
            height: 0;
            animation-timing-function: ease-in;
            opacity: 1;
          }


          100% {
            height: 40%;
            // transform: translateX(0px);
            animation-timing-function: ease-out;
            opacity: 1;
          }
        }
      }

      // .brak {

      //   text-shadow: 0px 0px 14px rgba(182, 224, 255, 0.3);
      //   position: relative;

      //   &:before {
      //     content: "";
      //     display: block;
      //     position: absolute;
      //     width: 3px;
      //     height: 25px;

      //     border-radius: 1px;
      //     left: 5px;
      //   }
      // }
    }
  }


}

/deep/ .two_dialog {
  .el-dialog__header {
    padding: 0px;
  }

  .el-dialog__headerbtn {
    font-size: 28px;
    top: 4px;
    z-index: 6;
  }

  .el-dialog__body {
    padding: 0px;

    video {
      display: block;
    }
  }
}
</style>