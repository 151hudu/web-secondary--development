<template>
  <div class="main">
    <div class="content_Left">
      <div class="news">
        <span class="news_Title" :style="{ color: theme.themeColor }">{{ this.articleData.title }}</span>
        <span class="news_Time">{{ this.articleData.createTime }}</span>
        <span class="news_Source">来源：{{ this.articleData.origin }}</span>
        <br />
        <div style="height: 600px; overflow: scroll; overflow-x: hidden" v-if="articleData.resourceType == 'pdf'">
          <!-- <pdf :src="articleData.resource" v-for="i in numLoadPages" :key="i" :page="i"></pdf> -->
          <iframe width="100%" height="100%" :src="articleData.resource" frameborder="0"></iframe>
        </div>
        <div v-if="articleData.resourceType == 'image'" style="width: 100%">
          <img width="100%" :src="articleData.resource" alt="" />
        </div>
        <div v-if="articleData.resourceType == 'video'">
          <video width="100%" controls="controls" height="100%" :src="articleData.resource"></video>
        </div>
        <span class="news_Content" v-html="this.articleData.content"> </span>
      </div>
      <!-- 编辑评论区 -->
      <div class="comment" v-if="commentShow == 1">
        <span class="comment_Nums"> 共{{ this.commentData.length }}个评论 </span>
        <div class="comment_Input_Area">
          <el-input type="textarea" placeholder="写下你的评论" :autosize="{ maxRows: 4 }" v-model="commentValue" resize="none" class="comment_Input"> </el-input>
          <span class="comment_Button">
            <el-button size="medium">取 消</el-button>
            <el-button size="medium" class="comment_Button_Color" @click="commentArticle" :style="{ background: theme.themeColor }">评 论</el-button>
          </span>
        </div>
        <el-divider></el-divider>
        <!-- 评论区 -->
        <div class="comment_Content" v-if="commentShow == 1">
          <div class="comment_Content_Item" v-for="(item, index) in commentData" :key="index" ref="comment_Content_Item">
            <div class="comment_Content_Item_Top">
              <el-avatar :size="30" :src="circleUrl"></el-avatar>
              <span class="comment_Content_Item_Name">{{ item.name }}</span>
              <span class="comment_Content_Item_Time"> 发布于 {{ item.createTime }} </span>
              <!-- <el-tag type="warning" size="small" class="comment_Content_Item_Tag">已置顶</el-tag> -->
            </div>
            <div class="comment_Content_Text">{{ item.content }}</div>
            <div class="comment_Content_Operation">
              <el-button size="small" class="el-icon-edit" @click="commentSonShow(item)"> 评 论</el-button>
              <span>
                <span>
                  <thumbs-up v-show="item.flag == 0" theme="outline" size="16" fill="#c0c0c0" @click="thumbUp(item)" />
                  <good-two v-show="item.flag == 1" theme="filled" size="16" :fill="theme.themeColor" @click="thumbUp(item)" />
                  <span class="thumbs_Up_Text" @click="thumbUp(item)" :style="{ color: theme.themeColor }">点赞 {{ item.thumbUpsNum }}</span>
                  <span style="vertical-align: -10px; color: #c0c0c0">丨</span>
                  <comment theme="filled" size="16" fill="#c0c0c0" @click="putComment(item)" />
                  <span class="thumbs_Up_Put" @click="putComment(item, index, 'false')" v-show="item.commentShow">收起评论</span>
                  <span class="thumbs_Up_Put" @click="putComment(item, index, 'true')" v-show="!item.commentShow">展开评论</span>
                </span>
              </span>
            </div>
            <div v-show="item.replyShow && commentShow == 1">
              <div class="comment_Input_Area" style="width: 90%">
                <el-input type="textarea" placeholder="写下你的评论" :autosize="{ maxRows: 4 }" v-model="item.replyInput" resize="none" class="comment_Input"> </el-input>
                <span class="comment_Button">
                  <el-button size="medium" @click="offReplyShow(item)">取 消</el-button>
                  <el-button size="medium" class="comment_Button_Color" @click="commentArticleSon(item)">评 论</el-button>
                </span>
              </div>
            </div>
            <div>
              <div class="comment_Content_Item_Other" v-for="(sonItem, sonIndex) in item.children" :key="sonIndex">
                <div v-show="item.commentShow == 1">
                  <el-avatar :size="30" :src="circleUrl"></el-avatar>
                  <span class="comment_Content_Item_Name">{{ sonItem.name }}</span>
                  <span class="comment_Content_Item_Other_Content">回复: {{ sonItem.content }}</span>
                  <br />
                  <span class="comment_Content_Item_Other_Content_Souce">{{ sonItem.createTime }} </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="content_Right">
      <div class="download" v-if="articleData.resourceType !== 'image'" :style="{ background: theme.themeColor }" @click="downLoad">
        <span>
          <download theme="outline" size="16" fill="#ffffff" />
          <span class="clickDown">附件下载</span>
        </span>
      </div>
      <div class="my_Operation" v-if="collectionShow == 1 || shareShow == 1">
        <span :style="{ fontWeight: 700, color: theme.themeColor }">丨</span>
        <span style="font-weight: 700"> 我的操作</span>
        <el-divider></el-divider>
        <div class="my_Operation_Button">
          <div class="my_Operation_Collection" v-if="collectionShow == 1">
            <i class="el-icon-star-on" :style="{ color: theme.themeColor }" @click="collect('delete')" v-show="articleData.collect == 1"></i>
            <i class="el-icon-star-off" :style="{ color: theme.themeColor }" @click="collect('add')" v-show="articleData.collect !== 1"></i>
            <span>收藏</span>
          </div>
          <el-divider v-if="collectionShow == 1 && shareShow == 1" class="operationDivider" direction="vertical"></el-divider>
          <div class="my_Operation_Share" v-if="shareShow == 1">
            <i class="el-icon-share" :style="{ color: theme.themeColor }" @click="sendVisible = true"></i>
            <span>分享</span>
          </div>
          <!-- <el-divider class="operationDivider" direction="vertical"></el-divider>
          <div class="my_Operation_Printer">
            <i class="el-icon-printer"></i>
            <span>打印</span>
          </div> -->
        </div>
      </div>
      <div class="about_News" :style="{ minHeight: this.aboutHeight }">
        <el-tabs v-model="activeName" @tab-click="handleClick">
          <el-tab-pane label="相关推荐" name="first">
            <ul style="padding: 0">
              <li class="about_News_First" v-for="(item, index) in aboutList" :key="index">
                <Flag theme="filled" size="18" :fill="theme.themeColor" />
                <span>{{ item.title }}</span>
              </li>
            </ul>
          </el-tab-pane>
        </el-tabs>
      </div>
      <div class="about_News2" :style="{ minHeight: this.ran2Height }">
        <el-tabs v-model="activeName" @tab-click="handleClick">
          <el-tab-pane label="热点排行" name="first">
            <ul style="padding: 0">
              <li class="about_News_First" v-for="(item, index) in rankList" :key="index">
                <span class="numSpan" :style="{ color: index + 1 < 4 ? theme.themeColor : '' }">{{ index + 1 }}</span
                >&nbsp;&nbsp;&nbsp;
                <span>{{ item.title }}</span>
              </li>
            </ul>
          </el-tab-pane>
        </el-tabs>
        <!-- <span :style="{ fontWeight: 700, color: theme.themeColor }">丨</span>
        <span> 相关视频</span>
        <el-divider></el-divider>
        <el-carousel @change="about_VideoChange" height="150px" arrow="always">
          <el-carousel-item v-for="item in 4" :key="item">
            <img style="width: 100%; height: 100%" :src="imgSrc" alt="" />
            <i @click="showAboutVideo(item)" class="el-icon-video-play"></i>
          </el-carousel-item>
        </el-carousel>
        <span class="about_Video_Title"> 外交部回应美参议员率团窜访台湾 </span> -->
      </div>
    </div>
    <!-- <el-dialog title="练习两年半" :visible.sync="dialogVisible" width="55%" :show-close="true">
      <video style="width: 100%; height: 100%" autoplay controls="controls" :src="src"></video>
    </el-dialog> -->
    <el-dialog title="发送站内信" :visible.sync="sendVisible" width="40%" :show-close="true">
      <el-tree :props="props" :data="organization" show-checkbox @check="handleCheckChange"> </el-tree>
      <div>
        <template v-for="(item, index) in selectData">
          <el-tag @close="closeTag(tag)" v-for="tag in item.users" :key="tag.name" closable :type="tag.type">
            {{ tag.name }}
          </el-tag>
        </template>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="sendVisible = false">取 消</el-button>
        <el-button type="primary" @click="sendMessge">确 定</el-button>
      </span></el-dialog
    >
  </div>
</template>

<script>
// import appService from "@njsdata/app-sdk";
import eventActionDefine from "./components/msgCompConfig";
import "./index.css";
import pdf from "vue-pdf";
import { queryRightSideDetail, queryAssetById, queryComments, addLike, addNewsCollect, addNewsComments, deleteNewsCollect, deleteLike, queryOfficeUser, share } from "./api/asset";
import moment from "moment";
import { ThumbsUp, GoodTwo, Comment, Download, Pennant, Flag } from "@icon-park/vue";
export default {
  name: "App",
  props: {
    customConfig: Object,
    themeInfo: Object,
    pageAnonymous: Number,
  },
  components: {
    ThumbsUp,
    GoodTwo,
    Comment,
    Download,
    Pennant,
    pdf,
    Flag,
  },
  computed: {
    theme() {
      let { theme_global_config } = this.themeInfo || {
        theme_global_config: {
          "--theme-public-pinPai-color": "#106EB2",
          "--theme-public-text-color-1": "rgba(12, 13, 14,1)",
        },
      };

      let themeColor = theme_global_config["--theme-public-pinPai-color"];
      let textColor = theme_global_config["--theme-public-text-color-1"];
      this.$nextTick(() => {
        let style = `#${this.identification} .el-radio-button__inner:hover{
                      color:${this.theme.themeColor};
                      }
                     #${this.identification} .el-radio-button.is-active .el-radio-button__inner:hover{
                      color: #FFF;
                      }
                      `;
        if (this.$refs[this.identification]) {
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
      numLoadPages: 5,
      dialogVisible: false,
      sendVisible: false,
      commentValue: "",
      text: '<h1>富强、民主、文明、和谐</h1><br/><h2><font color="red">自由、平等、公正、法治</font></h2><br/><h3><font color="blue">爱国、敬业、诚信、友善</font></h3>',
      activeName: "first",
      circleUrl: window.location.origin + "storage_area/files/datasouce/123.jpg",
      src: "",
      showOrHidden: "showOrHidden",
      articleData: "",
      commentData: [],
      selectData: [],
      organization: [],
      // articleTitle: "",
      // articleTime: "",
      // articleSouce: "",
      // articleContent: "",
      // articleVideoSrc: "",
      // articlePdfSrc: "",
      // articleImgSrc: "",
      // articleShareSrc: "",
      commentShow: 1,
      collectionShow: 1,
      shareShow: 1,
      props: {
        label: "office_name",
        children: "office_children",
        isLeaf: "leaf",
      },
      imgSrc: window.location.origin + "/storage_area/files/datasouce/123.jpg",
      aboutHeight: "290px",
      aboutNum: 5,
      rankHeight: "290px",
      rankNum: 5,
      aboutID: "",
      rankID: "",
      aboutList: [],
      rankList: [],
    };
  },
  mounted() {
    console.log(this.GetQueryString("dataId"));
    this.aboutHeight = this.customConfig.相关推荐高度 ? this.customConfig.相关推荐高度 + "px" : "432px";
    this.aboutNum = this.customConfig.相关推荐条数 ? this.customConfig.相关推荐条数 : 5;
    this.rankHeight = this.customConfig.热点排行高度 ? this.customConfig.热点排行高度 + "px" : "432px";
    this.rankNum = this.customConfig.热点排行条数 ? this.customConfig.热点排行条数 : 5;
    this.aboutID = this.customConfig.查询相关推荐资产ID ? this.customConfig.查询相关推荐资产ID : "";
    this.rankID = this.customConfig.查询热点排行资产ID ? this.customConfig.查询热点排行资产ID : "";
    let message = {
      newsAssetId: this.aboutID,
      rankingAssetId: this.rankID,
      recommandNum: this.aboutNum,
      hotspotNum: this.rankNum,
      currentNewsId: this.GetQueryString("dataId"),
    };
    queryRightSideDetail(message).then((res) => {
      this.aboutList = res.data.recommandNews;
      this.rankList = res.data.rankNews;
    });
    let { componentId } = this.customConfig || {};
    componentId && window.componentCenter?.register(componentId, "comp", this, eventActionDefine);
    queryAssetById(this.GetQueryString("dataId")).then((res) => {
      res.data.createTime = moment(new Date(res.data.createTime)).format("YYYY年MM月DD日 HH:mm:ss");
      this.articleData = res.data;
      this.commentShow = res.data.comment;
      this.collectionShow = res.data.collection;
      this.shareShow = res.data.share;
      this.articleData.collect ? (this.articleData.collect = this.articleData.collect) : (this.articleData.collect = 0);
      this.loadPdf();
    });
    this.queryComments();
    this.queryOfficeUser();
  },
  methods: {
    queryOfficeUser() {
      let message = {};
      queryOfficeUser(message).then((res) => {
        this.organization[0] = res.data;
        console.log(this.organization);
      });
    },
    handleCheckChange(nodeObj, SelectedObj) {
      console.log(SelectedObj.checkedNodes);
      this.selectData = SelectedObj.checkedNodes;
    },
    sendMessge() {
      let message = {
        userIdList: [],
        url: window.location.href,
        infoUrlTitle: this.customConfig.分享名称 ? this.customConfig.分享名称 : this.articleData.title,
      };
      console.log(this.selectData);
      this.selectData.forEach((item, index) => {
        console.log(item.users);
        item.users?.forEach((userItem, userIndex) => {
          message.userIdList.push(userItem.id);
        });
      });
      share(message).then((res) => {
        if (res.status == 200) {
          this.$message({
            message: "发送站内信成功",
            type: "success",
          });
          this.sendVisible = false;
        }
      });
    },
    // 处理资产数据
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
    handle(property) {
      return function (a, b) {
        const val1 = a[property];
        const val2 = b[property];
        return val2 - val1;
      };
    },
    closeTag(tag) {
      this.selectData.splice(this.selectData.indexOf(tag), 1);
    },
    downLoad() {
      if (this.articleData.resourceType == "pdf") {
        let url = window.URL.createObjectURL(new Blob([this.articleData.resource]));
        let link = document.createElement("a");
        link.style.display = "none";
        link.href = url;
        link.setAttribute("download", this.fn_sku + "_" + this.id_label + ".pdf");
        // +'.pdf' 通过不同的后缀名下载不同的文件
        //这里下载的是pdf格式的文件，拿到接口里的res也必须是pdf的文件流
        document.body.appendChild(link);
        link.click();
      } else {
        window.open(this.articleData.resource);
      }
    },
    queryComments() {
      queryComments(this.GetQueryString("dataId")).then((res) => {
        res.data.sort(this.handle("createTime"));
        res.data.forEach((item, index) => {
          item.commentShow = false;
          item.replyShow = false;
          item.replyInput = "";
          item.createTime = moment(new Date(item.createTime)).format("YYYY年MM月DD日 HH:mm:ss");
          if (item.children && item.children.length > 0) {
            item.children.sort(this.handle("createTime"));
            item.children.forEach((sonItem, sonIndex) => {
              sonItem.createTime = moment(new Date(sonItem.createTime)).format("YYYY年MM月DD日 HH:mm:ss");
            });
          }
        });
        this.commentData = res.data;
        console.log(this.commentData);
      });
    },
    GetQueryString(name) {
      var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
      var r = window.location.search.substr(1).match(reg); //获取url中"?"符后的字符串并正则匹配
      var context = "";
      if (r != null) context = r[2];
      reg = null;
      r = null;
      return context == null || context == "" || context == "undefined" ? "" : context;
    },
    collect(type) {
      if (type == "delete") {
        deleteNewsCollect({ objcetId: this.articleData.dataId }).then((res) => {
          if (res.status == 401 && this.pageAnonymous == 1) {
            return (window.location.href = window.location.origin + "/home");
          }
          if (res.status == 200) {
            this.articleData.collect = 0;
            this.$forceUpdate();
          }
        });
      } else {
        addNewsCollect({ objcetId: this.articleData.dataId })
          .then((res) => {
            if (res.status == 401 && this.pageAnonymous == 1) {
              return (window.location.href = window.location.origin + "/home");
            }
            if (res.status == 200) {
              this.articleData.collect = 1;
              this.$forceUpdate();
            }
          })
      }
    },
    commentArticle() {
      console.log(888);
      let message = {
        objcetId: this.articleData.dataId,
        content: this.commentValue,
      };
      addNewsComments(message).then((res) => {
        if (res.status == 401 && this.pageAnonymous == 1) {
          return (window.location.href = window.location.origin + "/home");
        }
        this.queryComments();
      });
    },
    commentSonShow(item) {
      item.replyShow = true;
    },
    offReplyShow(item) {
      item.replyShow = false;
    },
    thumbUp(item) {
      let messgae = {
        userId: item.userId,
        objcetId: item.dataId,
      };
      if (item.flag == 1) {
        deleteLike(messgae).then((res) => {
          if (res.status == 401 && this.pageAnonymous == 1) {
            return (window.location.href = window.location.origin + "/home");
          }
          this.queryComments();
        });
      } else {
        addLike(messgae).then((res) => {
          if (res.status == 401 && this.pageAnonymous == 1) {
            return (window.location.href = window.location.origin + "/home");
          }
          this.queryComments();
        });
      }
    },
    handleClick(tab, event) {
      console.log(tab, event);
    },
    showAboutVideo(item) {
      // this.dialogVisible = true;
    },
    commentArticleSon(item) {
      console.log(999);
      let message = {
        objcetId: this.articleData.dataId,
        content: item.replyInput,
        parentId: item.dataId,
      };
      addNewsComments(message).then((res) => {
        if (res.status == 401 && this.pageAnonymous == 1) {
          return (window.location.href = window.location.origin + "/home");
        }
        this.queryComments();
      });
    },
    about_VideoChange() {},
    putComment(item, index, status) {
      this.showOrHidden = this.showOrHidden ? "" : "showOrHidden";
      status == "true" ? (item.commentShow = true) : (item.commentShow = false);
      console.log(this.commentData);
    },
    loadPdf() {
      pdf.createLoadingTask(this.articlePdfSrc).promise.then((pdf) => {
        console.log(pdf);
        url: this.articleData.resource, (this.numLoadPages = pdf.numPages);
      });
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
.main {
  background: #f5f6fa;
  width: 100%;
  display: flex;
  justify-content: space-between;
}
// 左侧
.content_Left {
  width: 75%;
  display: flex;
  flex-direction: column;
  // 新闻内容
  .news {
    min-height: 100px;
    padding: 24px;
    background: #ffffff;
    .news_Title {
      color: dodgerblue;
      font-weight: 700;
      font-size: 20px;
      font-family: "微软雅黑" !important;
    }
    .news_Time,
    .news_Source {
      color: #c0c0c0;
      display: block;
      font-size: 14px;
      margin-top: 10px;
    }
    .news_Content {
      display: block;
      margin-top: 40px;
      font-family: "FZXiaoBiaoSong-B05S" !important;
    }
  }
  // 评论
  .comment {
    padding: 25px;
    margin-top: 50px;
    background: #ffffff;
    .comment_Input_Area {
      background: #f1f2f7;
      padding: 10px 20px 20px;
      height: 170px;
      border-radius: 5px;
      margin-top: 20px;
      margin-bottom: 20px;
      .comment_Input {
        margin-top: 10px;
        margin-bottom: 10px;
      }
      .comment_Button {
        float: right;
        .comment_Button_Color {
          background: #2dbed1;
          color: #ffffff;
        }
      }
      /deep/.el-textarea__inner {
        height: 90px !important;
      }
    }
  }
  .el-divider {
    height: 2px;
    margin-top: 35px;
  }
  // 用户评论
  .comment_Content_Item {
    margin-bottom: 20px;
    // 评论顶部信息
    .comment_Content_Item_Top {
      display: flex;
      .el-avatar {
        margin-right: 10px;
      }
      .comment_Content_Item_Name {
        line-height: 30px;
        display: block;
        font-size: 14px;
        font-weight: 700;
        margin-right: 10px;
      }
      .comment_Content_Item_Time {
        color: #c0c0c0;
        font-size: 12px;
        line-height: 30px;
        display: block;
        margin-right: 10px;
      }
      .comment_Content_Item_Tag {
        line-height: 25px;
        height: 25px;
        margin-right: 10px;
        margin-top: 2.5px;
      }
    }
    // 评论文字信息
    .comment_Content_Text {
      margin-top: 20px;
      margin-bottom: 20px;
    }
    // 评论底部操作
    .comment_Content_Operation {
      display: flex;
      justify-content: space-between;
      .i-icon-thumbs-up,
      .i-icon-good-two,
      .i-icon-comment {
        vertical-align: -12.5px;
        margin-left: 10px;
        cursor: pointer;
      }
      .thumbs_Up_Text {
        margin-left: 5px;
        margin-right: 10px;
        color: #2dbed1;
        font-size: 14px;
        vertical-align: -10px;
        cursor: pointer;
      }
      .thumbs_Up_Put {
        margin-left: 5px;
        margin-right: 10px;
        color: #c0c0c0;
        font-size: 14px;
        vertical-align: -10px;
        cursor: pointer;
      }
    }
    .comment_Content_Item_Other {
      margin-top: 20px;
      width: calc(100% - 40px);
      padding: 0px 20px 0px 20px;
      .el-avatar {
        margin-right: 10px;
        vertical-align: bottom;
      }
      .comment_Content_Item_Name {
        line-height: 30px;
        font-size: 14px;
        font-weight: 700;
        margin-right: 10px;
        height: 30px;
      }
      .comment_Content_Item_Other_Content {
        line-height: 30px;
        vertical-align: bottom;
        font-size: 14px;
      }
      .comment_Content_Item_Other_Content_Souce {
        font-size: 12px;
        color: #c0c0c0;
      }
    }
  }
}
// 右侧
.content_Right {
  min-width: 200px;
  width: 25%;
  display: flex;
  flex-direction: column;
  margin-left: 20px;
  .download {
    height: 56px;
    min-width: 330px;
    width: 100%;
    border-radius: 4px;
    background: #106eb2;
    display: flex;
    margin-bottom: 30px;
    justify-content: center;
    align-items: center;
    cursor: pointer;
    .clickDown {
      margin-left: 10px;
      vertical-align: 0px;
      font-size: 16px;
      margin-top: 5px;
      color: #ffffff;
    }
  }
  .my_Operation {
    height: 180px;
    width: 100%;
    background: #ffffff;
    padding: 20px;
    border-radius: 4px;
    margin-bottom: 16px;
    .my_Operation_Button {
      display: flex;
      .my_Operation_Collection,
      .my_Operation_Share,
      .my_Operation_Printer {
        width: 49%;
        display: flex;
        flex-direction: column;
        align-items: center;
        cursor: pointer;
      }
      .el-icon-star-on,
      .el-icon-printer {
        font-size: 32px;
        color: #f8b633;
        margin-bottom: 10px;
        cursor: pointer;
      }
      .el-icon-star-off {
        font-size: 32px;
        color: #f8b633;
        margin-bottom: 10px;
        cursor: pointer;
      }
      .el-icon-share {
        font-size: 32px;
        color: #4980ed;
        margin-bottom: 10px;
        cursor: pointer;
      }
      .operationDivider {
        height: 40px;
        width: 1px;
        margin-top: 10px;
      }
    }
  }
  .about_News2 {
    margin-bottom: 20px;
  }
  .about_News,
  .about_News2 {
    width: 100%;
    border-radius: 4px;
    overflow: hidden;
    background: #ffffff;
    margin-bottom: 16px;
    padding: 20px;
    height: 42vh;
    /deep/.el-tab-pane,
    /deep/.el-tabs {
      height: 100%;
    }
    /deep/.el-tabs__content {
      height: calc(100% - 60px);
    }
    ul {
      height: 100%;
      display: flex;
      flex-direction: column;
      justify-content: start;
      margin: 0 0 0 15px;
      overflow: hidden;
    }
    .about_News_First {
      list-style: none;
      height: 42px;
      line-height: 42px;
      cursor: pointer;
      width: 100%;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
      .numSpan {
        font-family: DIN-BlackItalic !important;
      }
      &:hover {
        color: #106eb2;
        background: #106eb219;
        border-radius: 4px;
      }
      .i-icon-flag {
        margin-right: 10px;
      }
    }
    /deep/.el-tabs__active-bar {
      width: 120px !important;
      background-color: rgba(24, 144, 255, 1);
    }
    /deep/.is-active {
      color: #000000;
      font-size: 18px;
      font-weight: 700;
    }
    /deep/.el-tabs__item:hover {
      color: #000000;
    }
  }
  .about_Video {
    height: 310px;
    width: 100%;
    background: #ffffff;
    margin-top: 30px;
    padding: 20px;
    .about_Video_First {
      list-style: none;
      margin-bottom: 20px;
      cursor: pointer;
      &:hover {
        color: #4980ed;
      }
      .i-icon-pennant {
        margin-right: 10px;
      }
    }
    /deep/.el-tabs__active-bar {
      background-color: rgba(24, 144, 255, 1);
    }
    /deep/.is-active {
      color: #000000;
      font-size: 16px;
      font-weight: 700;
    }
    /deep/.el-tabs__item:hover {
      color: #000000;
    }
  }
}
/deep/.el-dialog__body {
  padding: 10px 10px 10px;
}
/deep/.el-dialog__header {
  padding: 15px 20px 0px;
}
/deep/.el-dialog__headerbtn {
  top: 15px;
}
.el-tag {
  margin-right: 5px;
  margin-top: 5px;
}
.showOrHidden {
  display: none;
}
.news_Content {
  text-indent: 2em;
}
</style>
