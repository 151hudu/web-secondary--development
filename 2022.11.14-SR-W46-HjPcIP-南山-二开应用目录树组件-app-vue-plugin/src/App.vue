<template>
  <!-- 定义外层容器标识，宽高百分百 不可删除 -->
  <div :id="id" style="width: 230px; height: 100%; background-color: #fff" :ref="id">
    <!-- -->
    <el-input placeholder="输入关键字进行过滤" size="small" v-model="filterText" class="searchInput">
      <img class="searchIcon" slot="append" width="26px" height="26px"
        src="../pluginTemp/images/Frame 33668.png" /></el-input>
    <el-checkbox class="checked1" v-model="checked1" @change="cascadeChoose">级联选择</el-checkbox>
    <el-checkbox v-model="checked2" @change="handleCheckAllChange">全选</el-checkbox>
    <el-tree class="filter-tree two_tree" :check-strictly="!checked1" :data="stationTreeData" :props="defaultProps"
      default-expand-all :filter-node-method="filterNode" ref="stationTree" show-checkbox node-key="data_id"
      @check-change="handleCheckChange">
      <span class="span-ellipsis" slot-scope="{ node }">
        <span :title="node.label">{{ node.label }}</span>
      </span>
    </el-tree>
  </div>
</template>
<script>
import eventActionDefine from "./components/msgCompConfig";
import { Input, Tree, Checkbox, Button } from "element-ui";
import Vue from "vue";
import Utils from "./utils";
import { queryData, queryById } from "./api/asset";
import { mockJieKou } from "./components/mockData";
import { json } from "body-parser";
Vue.use(Input);
Vue.use(Tree);
Vue.use(Checkbox);
Vue.use(Button);

export default {
  //这里写组件英文名称，容器dom的id及事件中心命名均用到这个name，请认真填写
  name: "nanShanTree",
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
  watch: {
    filterText(val) {
      this.$nextTick(() => {
        this.$refs.stationTree.filter(val);
      });
    },
  },
  data() {
    return {
      //必需，不可删除
      id: "",
      //业务代码
      filterText: "",
      defaultProps: {
        children: "children",
        label: "name",
        id: 'data_id'
      },
      count: 1,
      stationTreeData: [],
      treeResults: [],
      levelData: [],
      hasChooseData: [],
      checked1: false,
      checked2: false,
      ListIInfo: {},
      filterNode(value, data) {
        if (!value) return true;
        return data.name.indexOf(value) !== -1;
      },
      huixianData: [],
      appVariablesSearch: {},
    };
  },
  mounted() {
    console.log(this.appVariables);
    this.appVariables.forEach((item, index) => {
      if (item.name == this.customConfig?.appVariablesName) {
        this.appVariablesSearch.id = item.id;
        this.appVariablesSearch.variable_name = item.name;
        this.appVariablesSearch.variable_value = item.default_value;
      }
    });
    this.checked1 = JSON.parse(window.localStorage.getItem("relation")) == null ? false : JSON.parse(window.localStorage.getItem("relation"));
    let infoById = {
      params: {
        modelId: this.customConfig.modelId || "",
      },
    };
    queryById(infoById).then((response) => {
      this.ListIInfo = response.data;
      let message = {
        params: {
          modelId: this.customConfig.modelId || "",
        },
        data: {
          pageSize: 99999,
          pageNum: 1,
          variables: [this.appVariablesSearch],
          orderBy: "",
          orderSort: "",
        },
      };
      queryData(message).then((res) => {
        // res = mockJieKou;
        console.time("global");
        res.data.results.forEach((item, index) => {
          let message = {
            children: [],
          };
          this.ListIInfo.formListModelComponentList.forEach((itemList, indexList) => {
            if (itemList.componentAlias == "belonging_park") {
              item.componentResultList.forEach((compItem, compIndex) => {
                if (compItem.componentId == itemList.componentId) {
                  message.belonging_park = compItem.result.label;
                }
              });
            }
            if (itemList.componentAlias == "belonging_company") {
              item.componentResultList.forEach((compItem, compIndex) => {
                if (compItem.componentId == itemList.componentId) {
                  message.belonging_company = compItem.result.label;
                }
              });
            }
            if (itemList.componentAlias == "data_id") {
              item.componentResultList.forEach((compItem, compIndex) => {
                if (compItem.componentId == itemList.componentId) {
                  message.data_id = compItem.result.label;
                }
              });
            }
            if (itemList.componentAlias == "parent_id") {
              item.componentResultList.forEach((compItem, compIndex) => {
                if (compItem.componentId == itemList.componentId) {
                  message.parent_id = compItem.result.label;
                }
              });
            }
            if (itemList.componentAlias == "belonging_regional") {
              item.componentResultList.forEach((compItem, compIndex) => {
                if (compItem.componentId == itemList.componentId) {
                  message.belonging_regional = compItem.result.label;
                }
              });
            }
            if (itemList.componentAlias == "name") {
              item.componentResultList.forEach((compItem, compIndex) => {
                if (compItem.componentId == itemList.componentId) {
                  message.name = compItem.result.label;
                }
              });
            }
          });
          this.treeResults.push(message);
        });
        this.stationTreeData = this.listToTree(this.treeResults);
        this.$nextTick(() => {
          if (window.localStorage.getItem("hasChecked")) {
            this.$refs.stationTree.setCheckedNodes(JSON.parse(window.localStorage.getItem("hasChecked")));
          } else {
            this.firstIn(this.stationTreeData);
          }
        });
        console.log(JSON.parse(window.localStorage.getItem("hasChecked")));
        console.timeEnd("global");
        this.getLevelData();
      });
    });

    //用于注册事件定义，不可删除
    let { componentId } = this.customConfig || {};
    componentId && window.componentCenter?.register(componentId, "comp", this, eventActionDefine);
    let { buttons, id } = this.customConfig;
    let componentName = this.$vnode.tag.split("-").pop().toLowerCase();
    this.id = id ? `secondary_${componentName}_${id}` : `secondary_${componentName}_${Utils.generateUUID()}`;
    //用于定义接收用户输入

    //业务代码
  },
  created() { },
  methods: {
    /**
     * 触发事件 必需，不可删除
     * @param {String} eventName 事件名
     * @param {Array} payload 事件传参
     *
     *
     */
    listToTree(list) {
      return list.filter((e) => {
        let pid = e.parent_id;
        let newArr = list.filter((ele) => {
          if (ele.data_id == pid) {
            if (!ele.children) {
              ele.children = [];
            }
            ele.children.push(e);
            return true;
          }
        });
        return newArr.length === 0;
      });
    },
    getLevelData() {
      let cloneData = JSON.parse(JSON.stringify(this.stationTreeData));
      this.levelData = this.recursion(cloneData);
    },
    handleCheckAllChange(val) {
      this.hasChooseData = [];
      this.$nextTick(() => {
        if (this.checked2) {
          this.$refs.stationTree.setCheckedNodes(this.levelData);
        } else {
          this.$refs.stationTree.setCheckedKeys([]);
        }
      });
    },
    // 递归调用
    recursion(arr) {
      return [].concat(
        ...arr.map((item) => {
          if (item.children) {
            let arr = [].concat(item, ...this.recursion(item.children));
            delete item.children;
            return arr;
          }
          return [].concat(item);
        })
      );
    },
    firstIn(arr) {
      let message = [];
      arr.forEach((item, index) => {
        if (item.children.length > 0) {
          item.children.forEach((itemson, indexson) => {
            delete itemson.children;
            message.push(itemson);
          });
        }
        delete item.children;
        message.push(item);
      });
      this.$refs.stationTree.setCheckedNodes(message);
    },
    cascadeChoose() {
      window.localStorage.setItem("relation", this.checked1);
    },
    handleCheckChange(data, checked, indeterminate) {
      this.hasChooseData.push(data);
      if (JSON.parse(JSON.stringify(this.huixianData)) !== this.$refs.stationTree.getCheckedKeys().concat(this.$refs.stationTree.getHalfCheckedKeys()).join()) {
        window.localStorage.setItem("hasChecked", JSON.stringify(this.$refs.stationTree.getCheckedNodes()));
        if (this.checked1 && this.$refs.stationTree.getCheckedKeys().concat(this.$refs.stationTree.getHalfCheckedKeys()).length != this.levelData.length) {
          this.huixianData = [...this.$refs.stationTree.getCheckedKeys()]
          this.$refs.stationTree.getCheckedKeys().forEach((x, i) => {
            let a = this.findNode(this.stationTreeData, (node) => {
              if (node.data_id == x) {
                if (this.huixianData.indexOf(node.parent_id) == -1) {
                  this.huixianData.splice(this.huixianData.indexOf(x), 0, node.parent_id)
                }
                return node.name === x
              }
            })
          })
          this.huixianData = this.huixianData.join();
        } else {
          this.huixianData = this.$refs.stationTree.getCheckedKeys().concat(this.$refs.stationTree.getHalfCheckedKeys()).join();
        }
        console.log(this.huixianData);
        if (this.$refs.stationTree.getCheckedKeys().concat(this.$refs.stationTree.getHalfCheckedKeys()).length == this.levelData.length) {
          this.checked2 = true;
        } else {
          this.checked2 = false;
        }
        this.$forceUpdate();
        this.triggerEvent(this.huixianData);
      }
    },
    //递归方法
    findNode(tree, func) {
      for (const node of tree) {
        if (func(node)) return node
        if (node.children) {
          const res = this.findNode(node.children, func)
          if (res) return res
        }
      }
      return null
    },
    //找到节点插入数据
    handleNodeClick(data) {
      console.log(data);
    },
    loadNode(node, resolve) {
      if (node.level === 0) {
        return resolve([{ name: "region1" }, { name: "region2" }]);
      }
      if (node.level > 3) return resolve([]);

      var hasChild;
      if (node.data.name === "region1") {
        hasChild = true;
      } else if (node.data.name === "region2") {
        hasChild = false;
      } else {
        hasChild = Math.random() > 0.5;
      }

      setTimeout(() => {
        var data;
        if (hasChild) {
          data = [
            {
              name: "zone" + this.count++,
            },
            {
              name: "zone" + this.count++,
            },
          ];
        } else {
          data = [];
        }
        resolve(data);
      }, 500);
    },
    triggerEvent(data) {
      window.eventCenter?.triggerEvent &&
        window.eventCenter.triggerEvent(this.customConfig.componentId, "treeChoose", {
          value: data,
        });
    },
    //必需，不可删除
    Event_Center_getName() {
      return this.id;
    },
    //与msgCompConfig.js文件actions相对应，组件动作，依据定义加上do_message前缀
    do_EventCenter_setValue(value) {
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
  },
};
</script>
<style lang="less" scoped>
.span-ellipsis {
  width: 100%;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  font-size: 14px;
}

.searchInput {
  margin-bottom: 14px;

  /deep/.el-input__inner {
    transition: none;
  }
}

.filter-tree {
  margin-top: 20px;
  padding: 0 10px 0 0;
}

.checked1 {
  margin-left: 16px;
}

.searchIcon {
  position: relative;
  top: 1px;
}

.searchInput /deep/.el-input__inner:hover+.el-input-group__append {
  border-color: #c0c4cc;
}

.searchInput /deep/.el-input__inner:focus+.el-input-group__append {
  border-color: #409eff;
}

/deep/.el-input-group--append .el-input__inner,
.el-input-group__prepend {
  border-right: 0px;
}

/deep/.el-input-group__append {
  background: transparent;
}

/deep/.el-checkbox__input.is-checked .el-checkbox__inner,
.el-checkbox__input.is-indeterminate .el-checkbox__inner {
  background: #0454f2;
  border-color: #0454f2;
}

/deep/.el-input-group__append,
.el-input-group__prepend {
  padding: 0 3px;
}
</style>
<style lang="less">
.filter-tree {

  .el-checkbox__input.is-checked .el-checkbox__inner,
  .el-checkbox__input.is-indeterminate .el-checkbox__inner {
    background: #0454f2 !important;
    border-color: #0454f2 !important;
  }
}

.two_tree {
  .el-tree-node {
    .el-tree-node__content {
      background: rgba(26, 121, 255, 0.1);
      margin-bottom: 6px;
    }

    .el-tree-node__children {
      .el-tree-node__content {
        background: rgba(21, 144, 85, 0.06);
        margin-bottom: 0px;
      }

      .el-tree-node {
        .el-tree-node__children {
          .el-tree-node__content {
            background: rgba(102, 102, 204, 0.05);
            margin-bottom: 0px;
          }

          .el-tree-node__content:first-of-type {
            margin-top: 6px;
          }
        }
      }
    }

  }
}

.two_tree {
  .el-tree-node__children {
    .el-tree-node:last-of-type {
      margin-bottom: 6px;
    }
  }
}
</style>
