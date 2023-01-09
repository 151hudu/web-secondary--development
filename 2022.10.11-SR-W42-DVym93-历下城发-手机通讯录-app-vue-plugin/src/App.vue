<template>
  <!-- 定义外层容器标识，宽高百分百 不可删除 -->
  <div :id="id" style="width: 100%; height: 100%" :ref="id">
    <div class="top_tabs">
      <div class="top_tabs_Fi" :class="{ select: tabsShowFlag }" @click="tabsChange('所有人员')">所有人员</div>
      <div class="top_tabs_Se" :class="{ select: !tabsShowFlag }" @click="tabsChange('按部门')">按部门</div>
    </div>
    <div class="search_Fi" v-show="tabsShowFlag">
      <el-input v-model="inputFi" @input="inputFiChange" placeholder="搜索人员" clearable> <i slot="prefix" class="el-input__icon el-icon-search"></i></el-input>
    </div>
    <div class="search_Se" v-show="!tabsShowFlag">
      <el-input v-model="inputSe" @input="inputSeChange" placeholder="搜索人员" clearable> <i slot="prefix" class="el-input__icon el-icon-search"></i></el-input>
    </div>
    <el-tree v-show="tabsShowFlag" :data="leaderData" :props="defaultProps" class="otherTree">
      <span class="custom-tree-node" slot-scope="{ data }" @click="callPhone(data)">
        <div style="display: flex">
          <div class="name_Radius" v-if="!data.office_children" style="background: #f9ae18">
            {{ data.office_name.substring(data.office_name.length - 2) }}
          </div>
          <p v-if="data.office_children">{{ data.office_name }}</p>
          <span v-else>{{ data.office_name }}</span>
        </div>
        <svg
          v-if="!data.office_children"
          t="1665556325855"
          class="icon"
          viewBox="0 0 1025 1024"
          version="1.1"
          xmlns="http://www.w3.org/2000/svg"
          p-id="4526"
          width="20"
          height="20"
        >
          <path
            d="M507.918859 650.527512c-49.503789-40.346806-106.623387-94.611243-156.090335-155.822216-34.713235-42.89496-65.404683-87.94306-33.707276-119.633303L95.656089 153.242337C63.221866 193.655661-8.620745 386.103763 299.338585 701.174388c324.458887 332.036833 533.74323 261.005742 569.766359 223.573453L652.205814 708.149578C621.886867 738.400983 582.842793 711.503113 507.918859 650.527512zM947.385483 798.906865l0-0.201601c0 0-169.23738-168.702166-169.343809-168.769707-13.381394-13.347623-34.814547-13.078481-48.127376 0.067541l-61.340939 61.375733 217.469138 217.203066c0 0 61.409504-61.176179 61.342986-61.245767l0.165784-0.132013C961.605005 833.148333 960.162074 811.75202 947.385483 798.906865zM396.298428 297.126091l0-0.168854c14.051691-14.083415 12.74589-35.45005 0-48.196964l0-0.234348c0 0-174.132089-173.597897-174.200654-173.597897-13.452005-13.484753-34.884135-13.148069-48.163193 0l-61.342986 61.441228 222.299375 221.961668C334.888924 358.335017 396.298428 297.225356 396.298428 297.126091z"
            p-id="4527"
            fill="#3295F7"
          ></path>
        </svg>
      </span>
    </el-tree>
    <mt-index-list v-show="tabsShowFlag && search_Fi_List && !inputFi">
      <mt-index-section v-for="(item, index) in nameAllShowdata" :key="index" :index="item.initial">
        <mt-cell v-for="(s, index) in item.data" :key="index">
          <div class="value_Box" @click="callPhone(s)">
            <div class="name_Box">
              <div class="name_Radius" :style="{ background: s.background }">
                {{ s.name.substring(s.name.length - 2) }}
              </div>
              {{ s.name }}
            </div>
            <svg
              style="margin-right: 20px"
              t="1665556325855"
              class="icon"
              viewBox="0 0 1025 1024"
              version="1.1"
              xmlns="http://www.w3.org/2000/svg"
              p-id="4526"
              width="20"
              height="20"
            >
              <path
                d="M507.918859 650.527512c-49.503789-40.346806-106.623387-94.611243-156.090335-155.822216-34.713235-42.89496-65.404683-87.94306-33.707276-119.633303L95.656089 153.242337C63.221866 193.655661-8.620745 386.103763 299.338585 701.174388c324.458887 332.036833 533.74323 261.005742 569.766359 223.573453L652.205814 708.149578C621.886867 738.400983 582.842793 711.503113 507.918859 650.527512zM947.385483 798.906865l0-0.201601c0 0-169.23738-168.702166-169.343809-168.769707-13.381394-13.347623-34.814547-13.078481-48.127376 0.067541l-61.340939 61.375733 217.469138 217.203066c0 0 61.409504-61.176179 61.342986-61.245767l0.165784-0.132013C961.605005 833.148333 960.162074 811.75202 947.385483 798.906865zM396.298428 297.126091l0-0.168854c14.051691-14.083415 12.74589-35.45005 0-48.196964l0-0.234348c0 0-174.132089-173.597897-174.200654-173.597897-13.452005-13.484753-34.884135-13.148069-48.163193 0l-61.342986 61.441228 222.299375 221.961668C334.888924 358.335017 396.298428 297.225356 396.298428 297.126091z"
                p-id="4527"
                fill="#3295F7"
              ></path>
            </svg>
          </div>
        </mt-cell>
      </mt-index-section>
    </mt-index-list>
    <div class="search_Fi_List" v-show="inputFi && tabsShowFlag">
      <div style="text-align: center" v-if="search_Fi_List.length == 0">暂无查询用户数据</div>
      <div v-for="(item, index) in search_Fi_List" :key="index" v-else>
        <div class="value_Box search_Fi_Item" @click="callPhone(item)">
          <div class="name_Box">
            <div class="name_Radius" style="background: #f9ae18">
              {{ item.name.substring(item.name.length - 2) }}
            </div>
            {{ item.name }}
          </div>
          <svg
            style="margin-right: 20px"
            t="1665556325855"
            class="icon"
            viewBox="0 0 1025 1024"
            version="1.1"
            xmlns="http://www.w3.org/2000/svg"
            p-id="4526"
            width="20"
            height="20"
          >
            <path
              d="M507.918859 650.527512c-49.503789-40.346806-106.623387-94.611243-156.090335-155.822216-34.713235-42.89496-65.404683-87.94306-33.707276-119.633303L95.656089 153.242337C63.221866 193.655661-8.620745 386.103763 299.338585 701.174388c324.458887 332.036833 533.74323 261.005742 569.766359 223.573453L652.205814 708.149578C621.886867 738.400983 582.842793 711.503113 507.918859 650.527512zM947.385483 798.906865l0-0.201601c0 0-169.23738-168.702166-169.343809-168.769707-13.381394-13.347623-34.814547-13.078481-48.127376 0.067541l-61.340939 61.375733 217.469138 217.203066c0 0 61.409504-61.176179 61.342986-61.245767l0.165784-0.132013C961.605005 833.148333 960.162074 811.75202 947.385483 798.906865zM396.298428 297.126091l0-0.168854c14.051691-14.083415 12.74589-35.45005 0-48.196964l0-0.234348c0 0-174.132089-173.597897-174.200654-173.597897-13.452005-13.484753-34.884135-13.148069-48.163193 0l-61.342986 61.441228 222.299375 221.961668C334.888924 358.335017 396.298428 297.225356 396.298428 297.126091z"
              p-id="4527"
              fill="#3295F7"
            ></path>
          </svg>
        </div>
      </div>
    </div>
    <div v-show="!tabsShowFlag && search_Se_List && !inputSe">
      <div class="showOpen">
        <span v-show="!openall" v-loading.fullscreen.lock="fullscreenLoading" @click="openallChange">展开</span>
        <span @click="openallChange" v-loading.fullscreen.lock="fullscreenLoading" v-show="openall">收起</span>
      </div>
      <el-tree
        v-loading="loading"
        :default-expand-all="openall"
        :expand-on-click-node="false"
        :data="depAlldata"
        show-checkbox
        :key="treeKey"
        :check-strictly="false"
        node-key="id"
        @check="checkedExpand"
        ref="tree"
        :props="defaultProps"
      >
        <span class="custom-tree-node" slot-scope="{ data }" @click="callPhone(data)">
          <div style="display: flex">
            <div class="name_Radius" v-if="!data.office_children" style="background: #f9ae18">
              {{ data.office_name.substring(data.office_name.length - 2) }}
            </div>
            <p v-if="data.office_children">{{ data.office_name }}</p>
            <span v-else>{{ data.office_name }}</span>
          </div>
          <svg
            v-if="!data.office_children"
            t="1665556325855"
            class="icon"
            viewBox="0 0 1025 1024"
            version="1.1"
            xmlns="http://www.w3.org/2000/svg"
            p-id="4526"
            width="20"
            height="20"
          >
            <path
              d="M507.918859 650.527512c-49.503789-40.346806-106.623387-94.611243-156.090335-155.822216-34.713235-42.89496-65.404683-87.94306-33.707276-119.633303L95.656089 153.242337C63.221866 193.655661-8.620745 386.103763 299.338585 701.174388c324.458887 332.036833 533.74323 261.005742 569.766359 223.573453L652.205814 708.149578C621.886867 738.400983 582.842793 711.503113 507.918859 650.527512zM947.385483 798.906865l0-0.201601c0 0-169.23738-168.702166-169.343809-168.769707-13.381394-13.347623-34.814547-13.078481-48.127376 0.067541l-61.340939 61.375733 217.469138 217.203066c0 0 61.409504-61.176179 61.342986-61.245767l0.165784-0.132013C961.605005 833.148333 960.162074 811.75202 947.385483 798.906865zM396.298428 297.126091l0-0.168854c14.051691-14.083415 12.74589-35.45005 0-48.196964l0-0.234348c0 0-174.132089-173.597897-174.200654-173.597897-13.452005-13.484753-34.884135-13.148069-48.163193 0l-61.342986 61.441228 222.299375 221.961668C334.888924 358.335017 396.298428 297.225356 396.298428 297.126091z"
              p-id="4527"
              fill="#3295F7"
            ></path>
          </svg>
        </span>
      </el-tree>
    </div>
    <div class="search_Se_List" v-show="inputSe && !tabsShowFlag">
      <div style="text-align: center" v-if="search_Se_List.length == 0">暂无查询用户数据</div>
      <div v-for="(item, index) in search_Se_List" :key="index" v-else>
        <div class="value_Box search_Fi_Item" @click="callPhone(item)">
          <div class="name_Box">
            <div class="name_Radius" style="background: #f9ae18">
              {{ item.name.substring(item.name.length - 2) }}
            </div>
            {{ item.name }}
          </div>
          <svg
            style="margin-right: 20px"
            t="1665556325855"
            class="icon"
            viewBox="0 0 1025 1024"
            version="1.1"
            xmlns="http://www.w3.org/2000/svg"
            p-id="4526"
            width="20"
            height="20"
          >
            <path
              d="M507.918859 650.527512c-49.503789-40.346806-106.623387-94.611243-156.090335-155.822216-34.713235-42.89496-65.404683-87.94306-33.707276-119.633303L95.656089 153.242337C63.221866 193.655661-8.620745 386.103763 299.338585 701.174388c324.458887 332.036833 533.74323 261.005742 569.766359 223.573453L652.205814 708.149578C621.886867 738.400983 582.842793 711.503113 507.918859 650.527512zM947.385483 798.906865l0-0.201601c0 0-169.23738-168.702166-169.343809-168.769707-13.381394-13.347623-34.814547-13.078481-48.127376 0.067541l-61.340939 61.375733 217.469138 217.203066c0 0 61.409504-61.176179 61.342986-61.245767l0.165784-0.132013C961.605005 833.148333 960.162074 811.75202 947.385483 798.906865zM396.298428 297.126091l0-0.168854c14.051691-14.083415 12.74589-35.45005 0-48.196964l0-0.234348c0 0-174.132089-173.597897-174.200654-173.597897-13.452005-13.484753-34.884135-13.148069-48.163193 0l-61.342986 61.441228 222.299375 221.961668C334.888924 358.335017 396.298428 297.225356 396.298428 297.126091z"
              p-id="4527"
              fill="#3295F7"
            ></path>
          </svg>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import eventActionDefine from "./components/msgCompConfig";
import { RadioButton, RadioGroup } from "element-ui";
import { queryUserByOffice, queryUser, queryStaffByOfficeId, queryUserByOfficeAll } from "./api/asset";
import vPinyin from "./components/vue-py";
import Vue from "vue";
import { Toast } from "mint-ui";
import utils from "@/utils";
import $ from "jquery";
import "./mint.css";
import { pinyin } from "pinyin-pro";
let timers = null;
let timers2 = null;
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
      tabsShowFlag: true,
      select: {},
      inputFi: "",
      inputSe: "",
      search_Fi_List: [],
      search_Se_List: [],
      defaultProps: {
        children: "office_children",
        label: "office_name",
        isLeaf: "isLeaf",
      },
      leaderData: [
        {
          office_name: "",
          id: "",
          office_children: [],
        },
      ],
      depAlldata: [],
      nameAllShowdata: [
        {
          name: 2213123,
        },
      ],
      nameAlldata: [],
      path: [],
      toastInstanse: null,
      openall: false,
      fullscreenLoading: false,
      treeKey: 0,
      loading: true,
    };
  },
  mounted() {
    this.loading = true;
    this.queryUserByOfficeAll();
    queryUser().then((res) => {
      this.nameAlldata =res.data
      for (let k = 0; k < this.nameAlldata.length; k++) {
        if (this.nameAlldata[k].name.indexOf("admin") !== -1) {
          this.nameAlldata.splice(k, 1);
          k--;
        }
      }
      if (this.nameAlldata.length == 0) return;
      if (!String.prototype.localeCompare) return null;
      var letters = "*ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");
      var zh = "阿八嚓哒妸发旮哈讥讥咔垃痳拏噢妑七呥扨它穵穵穵夕丫帀".split("");
      var segs = []; // 存放数据
      var res = {};
      let curr;
      var re = /[^\u4e00-\u9fa5]/; //中文正则
      var pattern = new RegExp("[`\\-~!@#$^&*()=|{}':;',\\[\\].<>《》/?~！@#￥……&*（）——|{}【】‘；：”“'。，、？12345678990]"); //特殊符号

      letters.filter((items, i) => {
        console.log(letters[i]);
        curr = {
          initial: "", //字母
          data: [], //数据
        };
        this.nameAlldata.map((v, index) => {
          // 特殊字符
          if (pattern.test(v.name[0])) {
            if ((!zh[i - 1] || zh[i - 1].localeCompare(v.name) <= 0) && v.name.localeCompare(zh[i]) == -1) {
              curr.data.push(v);
            }
          } else if (re.test(v.name[0])) {
            // 英文
            if (v.name[0].toUpperCase() == items) {
              curr.data.push(v);
            }
          } else if (pinyin(v.name, { pattern: "first", type: "array" })[0] == "l" && items == "L") {
            curr.data.push(v);
          } else {
            // 中文
            if ((!zh[i - 1] || zh[i - 1].localeCompare(v.name) <= 0) && v.name.localeCompare(zh[i]) == -1&&pinyin(v.name, { pattern: "first", type: "array" })[0] == "l") {
              console.log(9999, v.name, letters[i]);
              curr.data.push(v);
            }
          }
        });
        if (curr.data.length) {
          curr.initial = letters[i];
          console.log(letters[i]);
          curr.data.sort((a, b) => {
            return a.name.localeCompare(b.name);
          });
          curr.data.forEach((element, ind) => {
            if (ind == 0 && element) {
              element.background = "dodgerblue";
            } else {
              if (curr.data[ind - 1].background == "dodgerblue") {
                element.background = "#1ABD86";
              } else if (curr.data[ind - 1].background == "#1ABD86") {
                element.background = "#f9ae18";
              } else if (curr.data[ind - 1].background == "#f9ae18") {
                element.background = "dodgerblue";
              }
            }
          });
          segs.push(curr);
        }
      });
      res.segs = Array.from(new Set(segs)); //去重
      this.nameAllShowdata = res.segs;
    });
    //用于注册事件定义，不可删除
    let { componentId } = this.customConfig || {};
    componentId && window.componentCenter?.register(componentId, "comp", this, eventActionDefine);
    let { buttons, id } = this.customConfig;
    let componentName = this.$vnode.tag.split("-").pop().toLowerCase();
    this.id = id ? `secondary_${componentName}_${id}` : `secondary_${componentName}_${utils.generateUUID()}`;
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
    inputFiChange(val) {
      this.search_Fi_List = [];
      clearTimeout(timers);
      timers = setTimeout(() => {
        this.search_Fi_List = this.nameAlldata.filter((item) => {
          let reg = new RegExp(val.toLowerCase());
          return reg.test(item.name) || reg.test(vPinyin.chineseToPinYin(item.name).toLowerCase());
        });
      }, 300);
    },
    inputSeChange(val) {
      this.search_Se_List = [];
      clearTimeout(timers2);
      timers = setTimeout(() => {
        this.search_Se_List = this.nameAlldata.filter((item) => {
          let reg = new RegExp(val.toLowerCase());
          return reg.test(item.name) || reg.test(vPinyin.chineseToPinYin(item.name).toLowerCase());
        });
      }, 300);
    },
    queryUserByOfficeAll() {
      queryUserByOfficeAll().then((res) => {
        res.data.forEach((item, index) => {
          this.defenItem(item);
        });
        this.depAlldata = res.data;
        this.loading = false;
      });
    },
    defenItem(item) {
      if (item.office_name == "集团领导") {
        this.leaderData[0].office_name = "集团领导";
        this.leaderData[0].id = "集团领导";
        this.leaderData[0].office_children = item.users;
      }
      if (item.users) {
        item.users.forEach((user) => {
          user.office_name = user.name;
        });
      }
      if (item.office_children) {
        item.office_children.forEach((ele) => {
          this.defenItem(ele);
        });
      }
      item.office_children = item.office_children.concat(item.users);
    },
    queryUserByOffice(info) {
      queryUserByOffice(info).then(async (res) => {
        for (let k = 0; k < res.data.length; k++) {
          await this.searhAllPeople(res.data[k].office, "in");
        }
      });
    },
    async searhAllPeople(item, type) {
      let message = {
        OfficeId: item.id,
      };
      let message2 = {
        pageNum: 1,
        pageSize: 100000,
      };
      await queryStaffByOfficeId(message, message2).then(async (res) => {
        if (res.status == 200) {
          for (var item2 of item.children) {
            await this.searhAllPeople(item2, "out");
          }
          item.children = item.children.concat(res.data.userItemList);
          if (item.name == "集团领导") {
            if (!this.leaderData[0]) {
              this.leaderData.push(item);
            }
          }
          item.children.map((itemchi, index) => {
            if (itemchi.name == "集团领导") {
              item.children.unshift(item.children.splice(index, 1)[0]);
            }
          });
          if (type == "in") {
            this.depAlldata.push(item);
          }
        }
      });
    },
    cleanChild(item) {
      if (item.children && item.children.length > 0) {
        for (let k = 0; k < item.children.length; k++) {
          this.cleanChild(item.children[k]);
          if (item.children[k].name.indexOf("admin") !== -1) {
            item.children.splice(k, 1);
            k--;
          }
        }
      }
    },
    openallChange() {
      this.openall = !this.openall;
      //定义
      this.treeKey = +new Date();
      // this.fullscreenLoading = true;
      // let message = this.$refs.tree.store._getAllNodes();
      // for (let k = 0; k < message.length; k++) {
      //   if (message[k].data.children && message[k].data.children.length > 0) {
      //     message[k].expanded = this.openall;
      //   }
      // }
      // this.fullscreenLoading = false;
      // for (var i in this.$refs.tree.store.nodesMap) {
      //     this.$refs.tree.store.nodesMap[i].expanded = this.openall ;
      //   }
    },
    checkedExpand(items) {
      let message = this.$refs.tree.store.getNode(items);
      this.openOffNode(message, message.expanded);
    },
    openOffNode(item, tf) {
      if (item.childNodes && item.childNodes.length > 0) {
        item.expanded = !tf;
        item.childNodes.forEach((items, index) => {
          this.openOffNode(items);
        });
      }
    },
    callPhone(item) {
      if (!item.office_children) {
        if (item.mobile) {
          window.location.href = "tel:" + item.mobile;
        } else {
          this.show();
        }
      }
    },
    show() {
      // 每当调用的时候，Toast 有一个返回值，这个返回值 重新赋值给 toastInstanse ,以至于后边手动关闭Toast
      this.toastInstanse = Toast({
        message: "该用户无号码", //弹窗内容
        position: "middle", //弹窗位置
        duration: 1000, //弹窗时间毫秒,如果值为-1，则不会消失
        iconClass: "glyphicon glyphicon-heart", //设置 图标类
        className: "mytoast", //自定义Toast 样式，需要自己提供一个类名
      });
    },
    tabsChange(type) {
      this.tabsShowFlag = !this.tabsShowFlag;
      // if (type == "按部门") {
      //   this.depAlldata = [];
      //   let info = {
      //     OfficeId: 123456789,
      //   };
      //   this.queryUserByOffice(info);
      // }
    },
    handleClick(tab, event) {},
    handleValueChange(value) {
      this.triggerEvent("valueChange", {
        value,
      });
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
    do_message_setValue(value) {
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
.top_tabs {
  width: 100%;
  height: 45px;
  display: flex;
  div {
    width: 50%;
    text-align: center;
    font-size: 20px;
    line-height: 45px;
  }
  .select {
    border-bottom: 2px solid #409eff;
    color: #409eff;
  }
}
.search_Fi,
.search_Se {
  width: 100%;
  height: 55px;
  background: #f7f7f7;
  display: flex;
  justify-content: center;
  .el-input {
    margin-top: 7.5px;
    width: 90%;
    /deep/.el-input__inner {
      border: 0px;
      // text-align: center;
    }
    /deep/.el-input__icon {
      height: 43px;
    }
  }
}
.search_Fi_Item {
  height: 52px;
  padding: 0px 36px 0px 10px;
}
.value_Box {
  width: 100%;
  display: flex;
  justify-content: space-between;
  svg {
    margin-top: 15px;
    margin-right: 20px;
  }
}
.name_Radius {
  height: 44px;
  width: 44px;
  margin-top: 4px;
  margin-right: 20px;
  border-radius: 22px;
  text-align: center;
  line-height: 44px;
  color: #fff;
}
.name_Box {
  display: flex;
  line-height: 48px;
  .name_Radius {
    height: 44px;
    width: 44px;
    margin-top: 4px;
    margin-right: 20px;
    border-radius: 22px;
    text-align: center;
    line-height: 44px;
    color: #fff;
  }
}
.seach_Box {
}
// /deep/.treeitem >.el-tree-node__content{

// }
// /deep/.el-tree-node__children .el-tree-node__content{
//   height:52px;
// }
.showOpen {
  width: 100%;
  text-align: right;
  height: 30px;
  line-height: 30px;
}
.custom-tree-node {
  display: flex;
  justify-content: space-between;
  width: 100%;
  margin-left: 16px;
  span {
    line-height: 52px;
  }
  svg {
    margin-top: 15px;
    margin-right: 20px;
  }
}
/deep/.el-tree-node__content > .el-tree-node__expand-icon {
  padding: 0;
  position: absolute;
  right: 18px;
}
/deep/.el-tree-node__content > label.el-checkbox {
  z-index: 100;
  opacity: 0;
  width: 50px;
  height: 75px;
  margin-right: 15px;
}
/deep/.el-tree-node__content {
  min-height: 52px !important;
  display: flex;
  flex-direction: row-reverse;
  p {
    line-height: 52px;
    margin: 0;
  }
}
.otherTree {
  /deep/.el-tree-node__content {
    flex-direction: row;
    background: #f7f7f7;
  }
  /deep/.el-tree__empty-block {
    background: #f7f7f7;
  }
}

/deep/.collapse-transition {
  transition: none; //权重稍微高一点覆盖掉组件本身的动画效果
}
// /deep/.el-tree-node__expand-icon {
//   position:absolute;
//   top: 0;
//   right: 0;
// }
// /deep/.el-icon-search {
//   margin-top: -5px;
// }
/deep/.el-tree-node__children,
/deep/.el-tree-node__content {
  height: unset;
}
/deep/.el-input__suffix:focus-visible {
  outline: unset;
}
</style>
<style lang="less">
ul {
  padding: 0 !important;
}
li {
  list-style: none;
  margin: 0;
  padding: 0;
}
</style>
