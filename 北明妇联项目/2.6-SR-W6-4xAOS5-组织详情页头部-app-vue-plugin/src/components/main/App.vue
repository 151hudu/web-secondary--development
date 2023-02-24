<template>
  <div :id="id" ref="app-secondary" class="app-secondary">
    <div class="organization">
      <div class="organization_head">
        <div class="organization_head_left">
          <div class="organization_portrait">
            <img :src="organizeData.organize_cover_art || require('../../api/image/test1.jpg')" width="100%" height="100%"
              alt="" srcset="">
          </div>
        </div>
        <div class="organization_head_right">
          <div class="organization_title">{{ organizeData.organization_name }}</div>
          <div class="organization_label">
            <div class="organization_label_category">{{ organizeData.organization_type_name || '妇联组织' }}</div>
            <div class="organization_browse"><i class="el-icon-view"></i><span>{{
              handleISOver(organizeData.organize_page_num)
            }}</span> </div>
          </div>
        </div>
      </div>
      <div class="organization_delt">
        <div class="organization_delt_left">
          <div class="organization_quantity" :style="{ width: dynamic.length > 3 ? '25%' : '33%' }"
            v-for="(x, i) in dynamic" :key="i">
            <div class="organization_quantity_num">{{ handleISOver(x.value) }}</div>
            <div class="organization_quantity_type">{{ x.key }}</div>
          </div>
        </div>
        <div class="organization_delt_right">
          <button :class="{ organization_follow: true, isfollow: isFollow }" @click="handleFollow">{{
            isFollow ? '已关注' : '关注'
          }}</button>
          <div class="organization_share" @click="handleShare"><img src="../../api/image/share.png" alt="" srcset="">
            <span>分享</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
// import 'amfe-flexible';
import html2canvas from 'html2canvas'
import qs from 'querystringify';
import { jsSdkConfig, offieDetilN, offieDetil, fllowAdd, userQuery, fllowAddTable, fllowDel, fllowDelTable, browseAdd } from "../../api/asset";
import testPNG from '../../api/image/test1.jpg';
const keys = [{ key: '粉丝', keycode: 'organize_followers_num' },
{ key: '活动', keycode: 'organize_activity_num' },
{ key: '收藏', keycode: 'organize_collection_num' },
{ key: '动态', keycode: 'organize_dynamic_num' },]

const valueArr = [
  'organize_followers_num',
  'organize_activity_num',
  'organize_collection_num',
  'organize_page_num',
  'organize_dynamic_num',
]
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
  computed: {},
  data() {
    return {
      //必需，不可删除
      id: "",
      dynamic: [{ key: '粉丝', value: '2231' },
      { key: '活动', value: '4812' },
      { key: '收藏', value: '345' },
      { key: '动态', value: '682' },],
      isFollow: false,//是否关注
      wxParams: {},//微信参数
      organizeData: {},//当前参观组织的数据
      user_id: '1234567890',
      offie_id: '' || '031aa564cac940a484dd538314aa93ca'
    };
  },
  async mounted() {
    //此方法封装了事件注册，不可删除
    this.mainInit(this);
    try {
      let res = await userQuery()
      this.user_id = res.data?.id
      this.offie_id = qs.parse(window.location.search)?.officeid
      this.getJSSDK()
      this.handleBrowse()
      this.handleQueryOffie()
    } catch (error) {

    }
    window.onerror = function (err) {
      console.log(err, '=-----错误程序');
    }

    // let body = document.querySelector('body')
    // body.style.fontSize = '12px'
  },
  methods: {
    //关注事件
    handleFollow() {
      if (this.user_id) {
        if (this.isFollow) {
          this.handleFollowDel()
        } else {
          this.handleFollowAdd()
        }
        this.isFollow = !this.isFollow
      } else {
        this.toLogin()

      }
    },
    toLogin() {
      let appId = '9b7b76e8-3099-aa84-305c-7a7a456f287b';
      // wx.miniProgram.redirectTo({ url: `../login/login&appId=${appId}` })
      let { pathname, search } = window.location;
      let pageUrl = encodeURIComponent(pathname + search) + `${search == "" ? '?' : '&'}appId=${appId}`;
      wx.miniProgram.redirectTo({ url: `../login/login?redirect_url=${pageUrl}` })
    },
    //分享事件
    handleShare() {
      if (this.user_id) {

      } else {
        this.toLogin()
      }
      console.log(this.wxParams.appId, '-----d');
    },
    //判断是否过万
    handleISOver(num) {
      return parseInt(num / 10000) > 0 ? Number(num / 10000).toFixed(1) + 'w' : num
    },
    //调用jssdk
    getJSSDK() {
      let message = {
        url: encodeURIComponent(window.location.href.split("#")[0]),
      };
      jsSdkConfig(message).then(res => {
        this.wxParams = res.data

      })


    },
    //当前组织信息
    handleQueryOffie() {
      if (this.user_id) {
        offieDetil({ "user_id": this.user_id, "data_id": this.offie_id }).then(res => {
          // console.log(res, '======ewn');
          this.organizeData = res.data[0]
          this.isFollow = Boolean(Number(this.organizeData.attent_status))
          this.organizeData.organize_cover_art = JSON.parse(this.organizeData.organize_cover_art || '[]')[0]?.url
          this.dynamic = []
          valueArr.forEach(x => {
            this.organizeData[x] = this.handleISOver(this.organizeData[x])
          })

          keys.forEach((x, i) => {
            for (const key in this.organizeData) {
              if (x.keycode == key && this.organizeData[key] != -1) this.dynamic.push({ ...x, value: this.organizeData[key] })
            }
          })

        })
      } else {
        offieDetilN({ "user_id": this.user_id, "data_id": this.offie_id }).then(res => {
          // console.log(res, '======ewn');
          this.organizeData = res.data[0]
          this.isFollow = Boolean(Number(this.organizeData.attent_status))
          this.organizeData.organize_cover_art = JSON.parse(this.organizeData.organize_cover_art || '[]')[0]?.url
          this.dynamic = []
          valueArr.forEach(x => {
            this.organizeData[x] = this.handleISOver(this.organizeData[x])
          })

          keys.forEach((x, i) => {
            for (const key in this.organizeData) {
              if (x.keycode == key && this.organizeData[key] != -1) this.dynamic.push({ ...x, value: this.organizeData[key] })
            }
          })

        })
      }

    },
    //浏览信息加一
    handleBrowse() {
      browseAdd({ "user_id": this.user_id || '1234567890', "data_id": this.offie_id }).then(res => {
        // console.log(res,);
      }).catch(err => {

      })
    },
    //关注处理
    handleFollowAdd() {
      fllowAdd({ "user_id": this.user_id, "data_id": this.offie_id })
      fllowAddTable({ "user_id": this.user_id, "data_id": this.offie_id })
      // this.handleQueryOffie()
      this.dynamic.forEach((x, i) => {
        if (x.keycode == 'organize_followers_num') x.value++
      })
    },
    //取关处理
    handleFollowDel() {
      fllowDel({ "user_id": this.user_id, "data_id": this.offie_id })
      fllowDelTable({ "user_id": this.user_id, "data_id": this.offie_id })
      // this.handleQueryOffie()
      this.dynamic.forEach((x, i) => {
        if (x.keycode == 'organize_followers_num') x.value--
      })
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
.organization {
  background: url('../../api/image/weitu.png') no-repeat 0 0/100% 100%;
  height: 190px;
  box-sizing: border-box;
  padding: 28px 10px 23px 20px;

  .organization_head {
    display: flex;
    align-items: center;
    margin-bottom: 34px;

    .organization_head_right {
      .organization_title {
        height: 28px;
        font-size: 20px;
        font-family: PingFangSC-Medium, PingFang SC;
        font-weight: 500;
        color: #333333;
        line-height: 28px;
        margin-bottom: 7px;
      }

      .organization_label_category {
        color: #FF9000;
        font-size: 12px;
        background: #FFFFFF;
        border-radius: 4px;
        line-height: 17px;
        height: 20px;
        text-align: center;
        box-sizing: border-box;
        padding: 0 2px;
        font-family: PingFangSC-Regular, PingFang SC;
        border: 1px solid #FF9000;
        margin-right: 10px;
      }

      .organization_label {
        display: flex;
        align-items: center;
      }

      .organization_browse {
        height: 17px;
        font-size: 12px;
        font-family: PingFangSC-Regular, PingFang SC;
        font-weight: 400;
        color: #999999;
        line-height: 17px;

        span {
          margin-left: 5px;
        }
      }

    }

    .organization_head_left {
      margin-right: 19px;

      .organization_portrait {
        width: 70px;
        height: 70px;
        border-radius: 50%;
        overflow: hidden;
      }
    }


  }

  .organization_delt {
    display: flex;

    .organization_delt_left {
      flex: 1;
      display: flex;
      color: #666666;
      margin-right: 10px;

      .organization_quantity {
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;

        .organization_quantity_num {
          font-size: 14px;
          line-height: 20px;
        }

        .organization_quantity_type {
          font-size: 11px;
          line-height: 16px;
        }
      }
    }

    .organization_delt_right {
      width: 140px;
      display: flex;
      align-items: center;
      font-size: 14px;
      line-height: 20px;

      .organization_follow {
        width: 72px;
        height: 24px;
        background: #3296FA;
        border: 0;
        border-radius: 13px;
        text-align: center;
        font-size: 14px;
        font-family: PingFangSC-Regular, PingFang SC;
        font-weight: 400;
        color: #FFFFFF;
        line-height: 20px;

      }

      .isfollow {
        background: #e3e5e7;
        color: #9499A0;
      }

      .organization_share {
        margin-left: 16px;
        display: flex;
        align-items: center;

        img {
          margin-right: 5px;
          margin-top: 1px;
          width: 14px;
          height: 14px;
        }
      }
    }
  }
}
</style>
