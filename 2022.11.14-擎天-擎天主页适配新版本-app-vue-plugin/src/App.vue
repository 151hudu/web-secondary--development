<template>
  <!-- 定义外层容器标识，宽高百分百 不可删除 -->
  <div :id="qingtianMain" style="width: 100%; height: 100%; background-color: #fff" :ref="qingtianMain">
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
                <span class="previewTitle" v-if="index < 6" @click="goIframe(item, 'ghxm')">{{ item.project_name }}</span>
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
// import appService from "@njsdata/app-sdk";
import { queryAssetById } from "./api/asset";
import eventActionDefine from "./components/msgCompConfig";
import "./index.css";
export default {
  name: "App",
  props: {
    customConfig: Object,
    info: Object,
  },
  data() {
    return {
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
  computed: {
    title() {
      return this.customConfig?.title || "数据构建";
    },
    desc() {
      return this.customConfig?.desc || "描述";
    },
  },
  mounted() {
    console.log(this.customConfig);
    let message = "58e9f58f-91b6-6098-7ed5-98cd9b11bcd1";
    queryAssetById(message).then((res) => {
      this.shzzfwData = this.translatePlatformDataToJsonArray(res);
    });
    let message2 = "267f0955-53d7-8d6e-7226-c40791ab19d0";
    queryAssetById(message2).then((res) => {
      this.translatePlatformDataToJsonArray(res).forEach((item, index) => {
        if (item.release_status == "已发布") {
          this.ghxmData.push(item);
        }
      });
    });
    let message3 = "fbd3b45f-ba9d-8b0a-c0cc-e835f9d51112";
    queryAssetById(message3).then((res) => {
      this.zgxqData = this.translatePlatformDataToJsonArray(res);
    });
    let message4 = "ad1b8ddb-3a6a-45af-49ea-8efcdb250aa2";
    queryAssetById(message4).then((res) => {
      this.zcfgData = this.translatePlatformDataToJsonArray(res);
      console.log(this.zcfgData);
    });
    let message5 = "873b2a55-c8bc-b65b-ed80-08307309fe46";
    queryAssetById(message5).then((res) => {
      this.gzdtData = this.translatePlatformDataToJsonArray(res);
    });
    let message6 = "db001428-2026-7fc7-4bda-f510c0a38955";
    queryAssetById(message6).then((res) => {
      this.ggtzData = this.translatePlatformDataToJsonArray(res);
    });
    let { componentId } = this.customConfig || {};
    componentId && window.componentCenter?.register(componentId, "comp", this, eventActionDefine);
  },
  methods: {
    tabclick(num) {
      if (num == 1) {
        this.tabshow = true;
      } else {
        this.tabshow = false;
      }
    },
    goIframe(item, type) {
      if (type == "shzzfw") {
        window.location.href = `https://tyzy.jsghfw.com/jss_zgh_gxpt/applicationview/content/view?appid=a8b741b5-772b-8723-e009-3613866f0977&type=view&menuId=6bb9a511-64f4-9ca6-9801-69044bdac3e6%233&goback=1&data_id=${item.data_id}`;
        // this.src =
        //   "https://tyzy.jsghfw.com/jss_zgh_gxpt/applicationview/content/form/detail?goback=1&appid=a8b741b5-772b-8723-e009-3613866f0977&menuId=b6bfa6bb-401d-b781-b7aa-5c356cfb5ad5%233&type=view&breadcrumb=145b91dec3bd5b0adaf017f602dc0562&view_id=37305912e16c4fc2810d9b89992000b4&form_id=3c2f316e0a66454a94a7ed6205a62930&id=" +
        //   item.data_id +
        //   "&related=1";
      } else if (type == "ghxm") {
        window.location.href = `https://tyzy.jsghfw.com/jss_zgh_gxpt/applicationview/content/view?appid=a8b741b5-772b-8723-e009-3613866f0977&type=view&menuId=c7fbc7b9-a2be-a146-54bc-f5987caa6425%233&goback=1&data_id=${item.data_id}&create_time=${item.create_time}&project_name=${item.project_name}`;
        // this.src =
        //   "https://tyzy.jsghfw.com/jss_zgh_gxpt/applicationview/content/view?appid=ba344e81-9094-dba3-c2f5-dc8c82e4a174&type=view&menuId=16e974bb-8fda-d37f-4cc2-5a5011557811%233%C2%A4tOpen=true&data_id=" +
        //   item.data_id;
      } else if (type == "zgxq") {
        window.location.href = `https://tyzy.jsghfw.com/jss_zgh_gxpt/applicationview/content/view?appid=a8b741b5-772b-8723-e009-3613866f0977&type=view&menuId=28296a7e-e9f6-c74e-97c0-9b562192bcd3%233&goback=1&data_id=${item.data_id}`;
        // this.src =
        //   "https://tyzy.jsghfw.com/jss_zgh_gxpt/applicationview/content/form/detail?goback=1&appid=a8b741b5-772b-8723-e009-3613866f0977&menuId=6a6f3627-819f-e5c9-ac36-36a41c5512dc%233&type=view&breadcrumb=fe07ad795a194ebdae7f5991a5f80f3f&view_id=dc7f2e4d94b542918aa122bb171d0464&form_id=6446d0d4fcec44a094eea78ce0b6a137&id=" +
        //   item.data_id;
      } else if (type == "zcfg") {
        window.location.href = `https://tyzy.jsghfw.com/jss_zgh_gxpt/applicationview/content/view?appid=a8b741b5-772b-8723-e009-3613866f0977&type=view&menuId=17efb817-4241-38fb-1c74-3b7417246402%233&goback=1&data_id=${item.data_id}`;
        // this.src =
        //   "https://tyzy.jsghfw.com/jss_zgh_gxpt/applicationview/content/form/detail?goback=1&appid=a8b741b5-772b-8723-e009-3613866f0977&menuId=55389dae-2ef7-cb4d-b88c-afe217a4c2ba%233&type=view&breadcrumb=874e0bee7c23c17670824c15b98fa7b7&view_id=93eaf737ff5948d49fe0670d893d0c7e&form_id=a21abbd92f954689b65dbdd12668ac36&id=" +
        //   item.data_id;
      } else if (type == "gzdt") {
        window.location.href = `https://tyzy.jsghfw.com/jss_zgh_gxpt/applicationview/content/view?appid=a8b741b5-772b-8723-e009-3613866f0977&type=view&menuId=99d5fff6-13f0-7f2b-2219-e54d3f354826%233&goback=1&data_id=${item.data_id}`;
        // this.src =
        //   "https://tyzy.jsghfw.com/jss_zgh_gxpt/applicationview/content/form/detail?goback=1&appid=a8b741b5-772b-8723-e009-3613866f0977&menuId=55389dae-2ef7-cb4d-b88c-afe217a4c2ba%233&type=view&breadcrumb=874e0bee7c23c17670824c15b98fa7b7&view_id=93eaf737ff5948d49fe0670d893d0c7e&form_id=a21abbd92f954689b65dbdd12668ac36&id=" +
        //   item.data_id;
      } else if (type == "ggtz") {
        window.location.href = `https://tyzy.jsghfw.com/jss_zgh_gxpt/applicationview/content/view?appid=a8b741b5-772b-8723-e009-3613866f0977&type=view&menuId=3ab98180-2cf1-54ad-f3a9-ddf8078422fc&goback=1&data_id= ${item.data_id}`;
        // this.src =
        //   "https://tyzy.jsghfw.com/jss_zgh_gxpt/applicationview/content/form/detail?goback=1&appid=a8b741b5-772b-8723-e009-3613866f0977&menuId=55389dae-2ef7-cb4d-b88c-afe217a4c2ba%233&type=view&breadcrumb=874e0bee7c23c17670824c15b98fa7b7&view_id=93eaf737ff5948d49fe0670d893d0c7e&form_id=a21abbd92f954689b65dbdd12668ac36&id=" +
        //   item.data_id;
      }
    },
    goMore(type) {
      if (type == "shzzfw") {
        window.location.href = `https://tyzy.jsghfw.com/jss_zgh_gxpt/applicationview/content/view?appid=a8b741b5-772b-8723-e009-3613866f0977&type=view&menuId=b6bfa6bb-401d-b781-b7aa-5c356cfb5ad5%233`;
        // this.src =
        //   "https://tyzy.jsghfw.com/jss_zgh_gxpt/applicationview/content/view?appid=a8b741b5-772b-8723-e009-3613866f0977&type=view&menuId=b6bfa6bb-401d-b781-b7aa-5c356cfb5ad5%233";
      } else if (type == "ghxm") {
        window.location.href = `https://tyzy.jsghfw.com/jss_zgh_gxpt/applicationview/content/view?appid=a8b741b5-772b-8723-e009-3613866f0977&type=view&menuId=497932c8-60d0-a6ba-404f-781a15a0e441%233`;
        // this.src =
        //   "https://tyzy.jsghfw.com/jss_zgh_gxpt/applicationview/content/view?appid=a8b741b5-772b-8723-e009-3613866f0977&type=view&menuId=497932c8-60d0-a6ba-404f-781a15a0e441%233";
      } else if (type == "zgxq") {
        window.location.href = `https://tyzy.jsghfw.com/jss_zgh_gxpt/applicationview/content/view?appid=a8b741b5-772b-8723-e009-3613866f0977&type=view&menuId=6a6f3627-819f-e5c9-ac36-36a41c5512dc%233`;
        // this.src =
        //   "https://tyzy.jsghfw.com/jss_zgh_gxpt/applicationview/content/view?appid=a8b741b5-772b-8723-e009-3613866f0977&type=view&menuId=6a6f3627-819f-e5c9-ac36-36a41c5512dc%233";
      } else if (type == "zcfg") {
        window.location.href = `https://tyzy.jsghfw.com/jss_zgh_gxpt/applicationview/content/view?appid=a8b741b5-772b-8723-e009-3613866f0977&type=view&menuId=55389dae-2ef7-cb4d-b88c-afe217a4c2ba%233`;
        // this.src =
        //   "https://tyzy.jsghfw.com/jss_zgh_gxpt/applicationview/content/view?appid=a8b741b5-772b-8723-e009-3613866f0977&type=view&menuId=55389dae-2ef7-cb4d-b88c-afe217a4c2ba%233";
      } else if (type == "gzdt") {
        window.location.href = `https://tyzy.jsghfw.com/jss_zgh_gxpt/applicationview/content/view?appid=a8b741b5-772b-8723-e009-3613866f0977&type=view&menuId=2120d80c-ba64-0ff0-34a2-84569de8fcc0%233`;
        // this.src =
        //   "https://tyzy.jsghfw.com/jss_zgh_gxpt/applicationview/content/view?appid=a8b741b5-772b-8723-e009-3613866f0977&type=view&menuId=2120d80c-ba64-0ff0-34a2-84569de8fcc0%233";
      } else if (type == "ggtz") {
        window.location.href = `https://tyzy.jsghfw.com/jss_zgh_gxpt/applicationview/content/view?appid=a8b741b5-772b-8723-e009-3613866f0977&type=view&menuId=d89beef4-6649-ef57-6cb3-b541693968b7%233`;
        // this.src =
        //   "https://tyzy.jsghfw.com/jss_zgh_gxpt/applicationview/content/view?appid=a8b741b5-772b-8723-e009-3613866f0977&type=view&menuId=d89beef4-6649-ef57-6cb3-b541693968b7%233";
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
