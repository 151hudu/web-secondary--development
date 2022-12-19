<template>
   <div>
      <div class="outermost">
         <!-- 应用菜单 -->
         <el-row>
            <!-- 左侧树组件 -->
            <el-col :span="4">
               <div class="box_left">
                  <div class="tree_search">
                     <el-input size="small" placeholder="请输入一级节点名称" v-model="filterText"></el-input>
                  </div>
                  <el-tree
                     :style="`height: ${moduleHeight}px`"
                     :props="{ label: 'name', isLeaf: 'isLeaf', children: 'children' }"
                     :load="loadNode"
                     lazy
                     :highlight-current="true"
                     @node-click="treeNodeChange"
                     @node-expand="treeNodeChange"
                     :filter-node-method="filterNode"
                     ref="tree"
                  >
                  </el-tree>
               </div>
            </el-col>
            <!-- 右侧表格 -->
            <el-col :span="20">
               <div class="box_right">
                  <!-- 批量赋权按钮 -->
                  <div class="button_group">
                     <el-button type="primary" size="small" :disabled="!nowEmpowerDataList.length" @click="openBatchEmpowerDialog">批量赋权</el-button>
                     <div v-if="nowEmpowerDataList.length" class="group_text">当前选中 {{ nowEmpowerDataList.length }} 个 叶节点</div>
                  </div>
                  <!-- 表格 -->
                  <div :style="`width: 100%; height: ${moduleHeight - 110}px; overflow-y: auto; overflow-x: hidden;`">
                     <!-- 用户表格 -->
                     <div>
                        <el-table ref="menuTableShowData" :data="menuTableShowData" @selection-change="tableSelectionRow" :header-cell-style="{ background: '#fafafa', color: '#111' }" border>
                           <el-table-column type="selection" width="55" align="center"></el-table-column>
                           <el-table-column prop="name" label="菜单名称" width="220" align="center"> </el-table-column>
                           <el-table-column label="角色列表" align="center">
                              <template slot-scope="scope">
                                 <!-- 不展示所有 -->
                                 <div class="table_userList">
                                    <template v-if="scope.row.isShowUser != 'open'">
                                       <span v-for="(item, index) in scope.row.roles" :key="index">
                                          <div class="user_tag" v-if="index < 4">{{ intlGetKey(item.name) }}</div>
                                       </span>
                                    </template>
                                    <template v-if="scope.row.isShowUser == 'open'">
                                       <span v-for="item in scope.row.roles" :key="item.id">
                                          <div class="user_tag">{{ intlGetKey(item.name) }}</div>
                                       </span>
                                    </template>
                                    <div class="user_tag">应用管理员</div>
                                    <span class="user_more" v-if="scope.row.isShowUser == 'close'" @click="changeShowMoreUser(scope.row, 'open')">更多</span>
                                    <span class="user_more" v-if="scope.row.isShowUser == 'open'" @click="changeShowMoreUser(scope.row, 'close')">收起</span>
                                 </div>
                              </template>
                           </el-table-column>
                           <el-table-column label="操作" align="center" width="130">
                              <template slot-scope="scope">
                                 <el-button @click="openEmpowerDialog(scope.row)" type="text" size="small">赋权</el-button>
                              </template>
                           </el-table-column>
                        </el-table>
                        <div class="table_pagination">
                           <el-pagination
                              background
                              layout="sizes, prev, pager, next"
                              :current-page="menuPage"
                              :total="menuTableData.length"
                              @current-change="menuPageChange"
                              @size-change="menuSizeChange"
                              :page-sizes="[10, 20, 50, 100]"
                           >
                           </el-pagination>
                        </div>
                     </div>
                     <!-- 按钮表格 -->
                     <div class="button_table">
                        <div class="add_button_group">
                           <el-button type="primary" size="small" @click="openAddButtonDialog">新增按钮</el-button>
                        </div>
                        <el-table :data="buttonTableShowData" :header-cell-style="{ background: '#fafafa', color: '#111' }" border>
                           <el-table-column prop="name" label="菜单名称" width="220" align="center"> </el-table-column>
                           <el-table-column label="权限列表" align="center">
                              <template slot-scope="scope">
                                 <div v-for="(item, index) in scope.row.roles" :key="index">
                                    <span v-for="(e, i) in scope.row.tagItems" :key="i">
                                       <span v-if="item.id == e.role_id">{{ intlGetKey(item.name) }}：</span>
                                       <span v-if="item.id == e.role_id" class="tag_list">{{ `${e.tag_name}(${e.tag_code})` }}</span>
                                    </span>
                                 </div>
                              </template>
                           </el-table-column>
                           <el-table-column label="操作" align="center" width="130">
                              <template slot-scope="scope">
                                 <el-button @click="openButtonEmpowerDialog(scope.row)" type="text" size="small">赋权</el-button>
                              </template>
                           </el-table-column>
                        </el-table>
                        <div class="table_pagination">
                           <el-pagination
                              background
                              layout="sizes, prev, pager, next"
                              :current-page="buttonPage"
                              :total="buttonTableData.length"
                              @current-change="buttonPageChange"
                              @size-change="buttonSizeChange"
                              :page-sizes="[10, 20, 50, 100]"
                           >
                           </el-pagination>
                        </div>
                     </div>
                  </div>
               </div>
            </el-col>
         </el-row>
         <!-- 赋权弹窗 -->
         <el-dialog class="empower_dialog" :visible.sync="empowerDialogVisible" width="69%" :close-on-click-modal="false" :close-on-press-escape="false" :show-close="false">
            <!-- 标签页 -->
            <el-tabs v-model="tabDefaultActive" @tab-click="changeDialogTabs">
               <!-- 应用角色 -->
               <el-tab-pane label="应用角色" name="appUser">
                  <el-card>
                     <el-row class="app_user" :gutter="20">
                        <!-- 角色多选列 -->
                        <el-col class="dialog_left" :span="5">
                           <el-checkbox-group v-model="appUserCheckList" class="user_checklist" @change="changeAppUserCheck">
                              <el-checkbox v-for="(item, index) in appUserCheckDataList" :key="index" :label="item.id" :disabled="item.name == 'SYSR.APP_MANAGER'">{{
                                 intlGetKey(item.name)
                              }}</el-checkbox>
                           </el-checkbox-group>
                        </el-col>
                        <!-- 表格数据 -->
                        <el-col class="dialog_right" :span="19">
                           <el-table :data="appUserTableShowData" :header-cell-style="{ background: '#fafafa', color: '#111' }" border="">
                              <el-table-column label="姓名" align="center">
                                 <template slot-scope="scope">
                                    <div class="user_icon">
                                       <img :src="scope.row.photo" />
                                       <span>{{ scope.row.name }}</span>
                                    </div>
                                 </template>
                              </el-table-column>
                              <el-table-column prop="" label="工号" align="center"></el-table-column>
                              <el-table-column label="部门" align="center">
                                 <template slot-scope="scope">
                                    <div>{{ filterArea(scope.row.directSubCompany) }}</div>
                                 </template>
                              </el-table-column>
                           </el-table>
                           <div class="table_pagination">
                              <el-pagination
                                 background
                                 layout="sizes, prev, pager, next"
                                 :current-page="appPage"
                                 :total="appUserTableData.length"
                                 @current-change="appPageChange"
                                 @size-change="appSizeChange"
                                 :page-sizes="[10, 20, 50, 100]"
                              >
                              </el-pagination>
                           </div>
                        </el-col>
                     </el-row>
                  </el-card>
               </el-tab-pane>
               <!-- 系统角色 -->
               <el-tab-pane label="系统角色" name="systemUser">
                  <el-card>
                     <el-row class="system_user" :gutter="20">
                        <!-- 系统角色折叠面板 -->
                        <el-col class="dialog_left" :span="5">
                           <el-checkbox-group v-model="collapseCheckList" @change="collapseCheckChange">
                              <el-collapse v-model="collapseDefaultActive">
                                 <el-collapse-item v-for="(item, index) in collapseData" :key="index" :title="item.name" :name="item.id">
                                    <el-checkbox v-for="(e, i) in item.roleItemList" :key="i" :label="e.id">{{ e.zhname || e.name }}</el-checkbox>
                                 </el-collapse-item>
                              </el-collapse>
                           </el-checkbox-group>
                        </el-col>
                        <!-- 表格数据 -->
                        <el-col :span="19">
                           <el-table :data="systemUserTableShowData" :header-cell-style="{ background: '#fafafa', color: '#111' }" border="">
                              <el-table-column label="姓名" align="center">
                                 <template slot-scope="scope">
                                    <div class="user_icon">
                                       <img :src="scope.row.photo" />
                                       <span>{{ scope.row.name }}</span>
                                    </div>
                                 </template>
                              </el-table-column>
                              <el-table-column prop="" label="工号" align="center"></el-table-column>
                              <el-table-column label="部门" align="center">
                                 <template slot-scope="scope">
                                    <div>{{ filterArea(scope.row.directSubCompany) }}</div>
                                 </template>
                              </el-table-column>
                           </el-table>
                           <div class="table_pagination">
                              <el-pagination
                                 background
                                 layout="sizes, prev, pager, next"
                                 :current-page="systemPage"
                                 :total="systemUserTableData.length"
                                 @current-change="systemPageChange"
                                 @size-change="systemSizeChange"
                                 :page-sizes="[10, 20, 50, 100]"
                              >
                              </el-pagination>
                           </div>
                        </el-col>
                     </el-row>
                  </el-card>
               </el-tab-pane>
            </el-tabs>
            <!-- 关闭按钮 -->
            <div class="close_button">
               <svg @click="coloseEmpowerDialog" viewBox="64 64 896 896" focusable="false" data-icon="close" width="1em" height="1em" fill="currentColor" aria-hidden="true">
                  <path
                     d="M563.8 512l262.5-312.9c4.4-5.2.7-13.1-6.1-13.1h-79.8c-4.7 0-9.2 2.1-12.3 5.7L511.6 449.8 295.1 191.7c-3-3.6-7.5-5.7-12.3-5.7H203c-6.8 0-10.5 7.9-6.1 13.1L459.4 512 196.9 824.9A7.95 7.95 0 00203 838h79.8c4.7 0 9.2-2.1 12.3-5.7l216.5-258.1 216.5 258.1c3 3.6 7.5 5.7 12.3 5.7h79.8c6.8 0 10.5-7.9 6.1-13.1L563.8 512z"
                  ></path>
               </svg>
            </div>
            <!-- 底部按钮 -->
            <span slot="footer" class="dialog-footer">
               <el-button size="small" @click="coloseEmpowerDialog">取 消</el-button>
               <el-button size="small" type="primary" @click="saveDialog">确 定</el-button>
            </span>
         </el-dialog>
         <!-- 新增按钮弹窗 -->
         <el-dialog title="新增按钮" :visible.sync="addButtonDialogVisible" @close="closeAddButtonDialog" :close-on-click-modal="false" :close-on-press-escape="false">
            <el-form :inline="true" :model="buttonForm">
               <el-form-item label="按钮名称">
                  <el-input size="small" v-model="buttonForm.tagName" placeholder="请输入按钮名称"></el-input>
               </el-form-item>
               <el-form-item label="按钮编码">
                  <el-input size="small" v-model="buttonForm.tagCode" placeholder="请输入按钮编码"></el-input>
               </el-form-item>
               <el-form-item class="button_save">
                  <el-button size="small" type="primary" @click="saveButtonForm">保存</el-button>
               </el-form-item>
            </el-form>
            <el-table :data="addbuttonTableData" :header-cell-style="{ background: '#fafafa', color: '#111' }" border>
               <el-table-column prop="tag_name" label="按钮名称" align="center"> </el-table-column>
               <el-table-column prop="tag_code" label="按钮编码" align="center"></el-table-column>
               <el-table-column label="操作" align="center" width="130">
                  <template slot-scope="scope">
                     <el-button @click="deleteButton(scope.row)" type="text" size="small">删除</el-button>
                  </template>
               </el-table-column>
            </el-table>
         </el-dialog>
         <!-- 按钮赋权弹窗 -->
         <el-dialog title="赋权弹窗" :visible.sync="buttonEmpowerDialogVisible" @close="closeAddButtonEmpowerDialog" :close-on-click-modal="false" :close-on-press-escape="false">
            <el-form :inline="true" :model="buttonEmpowerForm">
               <el-form-item label="角色选择">
                  <el-select size="small" v-model="buttonEmpowerForm.user" placeholder="请选择角色" value-key="item.id" clearable>
                     <el-option v-for="(item, index) in addbuttonEmpowerRow.roles" :key="index" :label="intlGetKey(item.name)" :value="item.id"> </el-option>
                  </el-select>
               </el-form-item>
               <el-form-item label="按钮选择">
                  <el-select size="small" multiple collapse-tags v-model="buttonEmpowerForm.tag_id" placeholder="请选择角色" filterable>
                     <el-option v-for="(item, index) in addbuttonTableData" :key="index" :label="`${item.tag_name}(${item.tag_code})`" :value="item.id"> </el-option>
                  </el-select>
               </el-form-item>
               <el-form-item class="button_save">
                  <el-button size="small" type="primary" @click="saveEmpowerButtonForm">保存</el-button>
               </el-form-item>
            </el-form>

            <el-table ref="addbuttonEmpowerTable" :data="addbuttonEmpowerRow.roles" :header-cell-style="{ background: '#fafafa', color: '#111' }" border>
               <el-table-column prop="name" label="角色" align="center">
                  <template slot-scope="scope"> {{ intlGetKey(scope.row.name) }} </template>
               </el-table-column>
               <el-table-column label="按钮" align="center">
                  <template slot-scope="scope">
                     <div v-for="(item, index) in addbuttonEmpowerRow.tagItems" :key="index">
                        <span v-if="item.role_id == scope.row.id">{{ `${item.tag_name}(${item.tag_code})` }}</span>
                     </div>
                  </template>
               </el-table-column>
               <el-table-column label="操作" align="center" width="130">
                  <template slot-scope="scope">
                     <el-button @click="deleteEmpowerButton(scope.row)" type="text" size="small">删除</el-button>
                  </template>
               </el-table-column>
            </el-table>
         </el-dialog>
      </div>
      <!-- 提交按钮 -->
      <div class="save_button">
         <el-button type="primary" size="small" @click="saveAllData">保 存</el-button>
         <el-button size="small">取 消</el-button>
      </div>
   </div>
</template>

<script>
// 引入CSS文件
import "./index.less";
// 引入接口文件
import {
   queryAreaData,
   queryTreeData,
   queryLazyTreeData,
   queryUserTableData,
   queryAppUserCheckData,
   queryAppUserTableData,
   querySystemUserCheckData,
   saveCheckData,
   saveAddButtonData,
   deleteAddButtonData,
   queryAddButtonTableData,
   saveAddButtonEmpowerData,
   deleteUserButtonData,
} from "./api/asset";
// 按需引入
import qs from "querystringify";
export default {
   name: "App",

   props: {
      customConfig: Object,
      sysVariables: Array,
      appVariables: Array,
      intlGetKey: Function,
   },

   data() {
      return {
         // 组件高度
         moduleHeight: 0,
         // 应用ID
         appid: "",
         // 资产ID
         assetId: "",
         // 地区数据
         areaDataList: [],
         // 搜索条件
         filterText: "",
         // 首次加载的节点
         firstNode: null,
         // 树组件当前选中行
         nowCheckTreeRow: {},
         // 树组件当前选中节点
         nowCheckTreeNode: {},
         // 菜单表格数据
         menuTableData: [],
         // 菜单表格展示数据
         menuTableShowData: [],
         // 菜单表格选中数据
         menuTableSelection: [],
         // 菜单表格数据页码
         menuPage: 1,
         // 菜单表格数据页数
         menuPageSize: 10,
         // 按钮表格数据
         buttonTableData: [],
         // 按钮表格展示数据
         buttonTableShowData: [],
         // 按钮表格数据页码
         buttonPage: 1,
         // 按钮表格数据页数
         buttonPageSize: 10,
         // 当前赋权数据
         nowEmpowerData: {},
         // 当前赋权数据列表
         nowEmpowerDataList: [],
         // 弹窗开关
         empowerDialogVisible: false,
         // 弹窗默认Tabs
         tabDefaultActive: "appUser",
         // 弹窗状态
         dialogType: "row",
         // 赋权弹窗选中数据集合
         saveEmpowerDataList: {
            app: [],
            system: [],
         },
         // 按钮弹窗开关
         addButtonDialogVisible: false,
         // 按钮弹窗开关
         buttonEmpowerDialogVisible: false,
         // 按钮弹窗赋权数据
         nowButtonEmpowerData: {},
         // 按钮弹窗Form
         buttonForm: {
            tagName: "",
            tagCode: "",
         },
         // 按钮弹窗赋权Form
         buttonEmpowerForm: {
            user: [],
            tag_id: [],
         },
         // 按钮弹窗表格数据
         addbuttonTableData: [],
         // 按钮弹窗赋权表格数据
         addbuttonEmpowerTableData: [],
         // 按钮弹窗赋权选中行数据
         addbuttonEmpowerRow: {},
         // 应用角色多选数据
         appUserCheckDataList: [],
         // 应用角色多选选中数据
         appUserCheckList: [],
         // 应用角色表格数据
         appUserTableData: [],
         // 应用角色表格展示数据
         appUserTableShowData: [],
         // 应用角色表格数据页码
         appPage: 1,
         // 应用角色表格数据页数
         appPageSize: 10,
         // 系统角色折叠面板数据
         collapseData: [],
         // 系统角色折叠板默认展开
         collapseDefaultActive: [],
         // 系统角色折叠面板多选
         collapseCheckList: [],
         // 系统角色表格数据
         systemUserTableData: [],
         // 系统角色表格展示数据
         systemUserTableShowData: [],
         // 系统角色表格数据页码
         systemPage: 1,
         // 系统角色表格数据页数
         systemPageSize: 10,
      };
   },

   mounted() {
      this.moduleHeight = this.customConfig["组件高度"] || 850;
      this.assetId = this.customConfig["资产ID"] || "095f5522-a41a-f5e5-1bcd-996a0041b919";
      this.appid = qs.parse(window.location.search).appid || "";

      this.getUserTableData();
      this.getAreaData();
   },

   watch: {
      filterText(val) {
         this.$refs.tree.filter(val);
      },
   },

   methods: {
      // intlGetKey(name) {
      //    return name;
      // },

      // 获取地区信息
      getAreaData() {
         queryAreaData().then((res) => {
            let areaList = [];
            res.data.children.forEach((item) => {
               areaList.push({
                  name: item.name,
                  id: item.id,
               });
            });
            this.areaDataList = areaList;
         });
      },
      // 过滤地区信息
      filterArea(id) {
         let name = "";
         this.areaDataList.forEach((item) => {
            if (item.id == id) {
               name = item.name;
            }
         });
         return name;
      },
      // 懒加载树组件叶子节点
      loadNode(node, resolve) {
         this.firstNode = node;
         // 获取一级节点数据
         if (node.level === 0) {
            this.$nextTick(() => {
               queryTreeData(this.assetId)
                  .then((res) => {
                     resolve(res.data);
                     this.appid = node.childNodes[0].data.id;
                     this.getUserTableData(node.childNodes[0]);
                     node.childNodes[0].expanded = true;
                     node.childNodes[0].loadData();
                  })
                  .catch((err) => {
                     resolve([]);
                  });
            });
         } else {
            this.$nextTick(() => {
               if (this.nowCheckTreeRow.id) {
                  // 含有子节点
                  if (this.nowCheckTreeRow?.children) {
                     let childrenData = JSON.parse(JSON.stringify(this.nowCheckTreeRow?.children));
                     childrenData.forEach((item) => {
                        if (!item.children) {
                           item.isLeaf = true;
                        }
                     });
                     return resolve(childrenData);
                  }
                  // 不含children节点
                  let dataForm = {
                     assetId: this.assetId,
                     appId: this.nowCheckTreeRow?.id,
                  };
                  queryLazyTreeData(dataForm)
                     .then((res) => {
                        let resData = JSON.parse(JSON.stringify(res.data));
                        this.buttonTableData = resData;
                        this.dataPaging(this.buttonPage, this.buttonPageSize, this.buttonTableData, "button");
                        resData.forEach((item) => {
                           if (!item.children) {
                              item.isLeaf = true;
                           }
                        });
                        resolve(resData);
                     })
                     .catch((err) => {
                        resolve([]);
                     });
               } else {
                  if (this.firstNode) {
                     let dataForm = {
                        assetId: this.assetId,
                        appId: this.firstNode.data.id,
                     };
                     queryLazyTreeData(dataForm)
                        .then((res) => {
                           let childrenData = JSON.parse(JSON.stringify(res.data));
                           this.buttonTableData = childrenData;
                           // this.buttonTableShowData = childrenData;
                           this.dataPaging(this.buttonPage, this.buttonPageSize, this.buttonTableData, "button");
                           childrenData.forEach((item) => {
                              if (!item.children) {
                                 item.isLeaf = true;
                              }
                           });
                           return resolve(childrenData);
                        })
                        .catch((err) => {
                           resolve([]);
                        });
                  }
               }
            });
         }
      },
      // 点击或切换树节点
      treeNodeChange(row, node) {
         this.nowCheckTreeRow = row;
         this.nowCheckTreeNode = node;
         this.menuPage = 1;
         this.buttonPage = 1;
         if (node.level <= 1) {
            this.appid = row.id;
         }
         this.getUserTableData();
         this.getLazyUserTableData();
      },
      // 获取菜单表格数据
      getUserTableData(firstNode) {
         if (this.nowCheckTreeNode?.id) {
            if (this.nowCheckTreeNode?.level <= 1) {
               let datappId = this.nowCheckTreeRow?.id;
               queryUserTableData(datappId).then((res) => {
                  this.menuTableData = JSON.parse(JSON.stringify(res.data));
                  this.dataPaging(this.menuPage, this.menuPageSize, res.data, "menu");
               });
            } else {
               if (this.nowCheckTreeRow.children) {
                  let datappId = this.nowCheckTreeRow?.datappId;
                  queryUserTableData(datappId).then((res) => {
                     let newRow = this.getChildrenData(res.data, this.nowCheckTreeRow.id);
                     this.menuTableData = JSON.parse(JSON.stringify(newRow.children));
                     this.dataPaging(this.menuPage, this.menuPageSize, newRow.children, "menu");
                  });
                  return;
               }

               let datappId = this.nowCheckTreeRow?.datappId;
               queryUserTableData(datappId).then((res) => {
                  let newRow = this.getChildrenData(res.data, this.nowCheckTreeRow.id);
                  this.menuTableData = [newRow];
                  this.dataPaging(this.menuPage, this.menuPageSize, newRow, "menu");
               });
            }
         } else {
            if (this.firstNode?.data?.id) {
               let datappId = this.firstNode.data.id;
               queryUserTableData(datappId).then((res) => {
                  this.menuTableData = JSON.parse(JSON.stringify(res.data));
                  this.dataPaging(this.menuPage, this.menuPageSize, res.data, "menu");
               });
            } else {
               if (firstNode?.data?.id) {
                  let datappId = firstNode.data.id;
                  queryUserTableData(datappId).then((res) => {
                     this.menuTableData = JSON.parse(JSON.stringify(res.data));
                     this.dataPaging(this.menuPage, this.menuPageSize, res.data, "menu");
                  });
               }
            }
         }
      },

      // 递归遍历获取数据
      getChildrenData(list, id) {
         for (let i = 0; i < list.length; i++) {
            let a = list[i];
            if (a.id === id) {
               return a;
            } else {
               if (a.children && a.children.length > 0) {
                  let res = this.getChildrenData(a.children, id);
                  if (res) {
                     return res;
                  }
               }
            }
         }
      },

      // 树形控件查询
      filterNode(value, data) {
         if (!value) return true;
         return data.name.indexOf(value) !== -1;
      },
      // 获取懒加载菜单表格数据
      getLazyUserTableData() {
         let dataForm = {
            assetId: this.assetId,
            appId: this.appid,
         };
         queryLazyTreeData(dataForm).then((res) => {
            this.buttonTableData = JSON.parse(JSON.stringify(res.data));

            res.data.forEach((item) => {
               if (item.id == this.addbuttonEmpowerRow.id) {
                  this.addbuttonEmpowerRow = item;
               }
            });

            this.dataPaging(this.buttonPage, this.buttonPageSize, this.buttonTableData, "button");
         });
      },
      // 菜单表格选中行数据
      tableSelectionRow(val) {
         this.nowEmpowerDataList = val;
      },
      // 切换是否展示更多数据
      changeShowMoreUser(row, type) {
         this.menuTableShowData.forEach((item) => {
            if (item.id == row.id) {
               item.isShowUser = type;
            }
         });
      },
      // 打开赋权弹窗
      openEmpowerDialog(row) {
         // 重置tab页签
         this.tabDefaultActive = "appUser";
         // 更新弹窗状态
         this.dialogType = "row";
         // 保存行数据
         this.nowEmpowerData = row;
         // 获取应用角色页面数据
         this.getAppUserCheckData();
         // 获取第二tab页参数
         this.changeDialogTabs();
         // 打开弹窗
         this.empowerDialogVisible = true;
      },
      // 打开批量赋权弹窗
      openBatchEmpowerDialog() {
         // 重置tab页签
         this.tabDefaultActive = "appUser";
         // 更新弹窗状态
         this.dialogType = "list";
         // 获取应用角色页面数据
         this.getAppUserCheckData();
         // 打开弹窗
         this.empowerDialogVisible = true;
      },
      // 打开新增按钮弹窗
      openAddButtonDialog(row) {
         this.nowButtonEmpowerData = row;
         this.addButtonDialogVisible = true;
         this.getButtonDialogTableData();
      },
      // 打开按钮赋权弹窗
      openButtonEmpowerDialog(row) {
         this.addbuttonEmpowerRow = JSON.parse(JSON.stringify(row));
         this.getButtonDialogTableData();
         this.buttonEmpowerDialogVisible = true;
      },
      // 关闭赋权弹窗
      coloseEmpowerDialog() {
         this.empowerDialogVisible = false;
         this.appUserCheckList = [];
         this.collapseCheckList = [];
      },
      // 关闭新增按钮弹窗
      closeAddButtonDialog() {
         this.buttonForm.tagName = "";
         this.buttonForm.tagCode = "";
         this.addButtonDialogVisible = false;
      },
      // 关闭新增按钮赋权弹窗
      closeAddButtonEmpowerDialog() {
         this.buttonEmpowerForm.user = [];
         this.buttonEmpowerForm.tag_id = [];
      },
      // 弹窗确认按钮
      saveDialog() {
         let roleList = [];
         // 过滤应用角色赋权
         this.appUserCheckList.forEach((item) => {
            this.appUserCheckDataList.forEach((e) => {
               if (item == e.id) {
                  roleList.push(e);
               }
            });
         });
         // 过滤系统角色赋权
         this.collapseCheckList.forEach((item) => {
            for (let i = 0; i < this.collapseData.length; i++) {
               for (let j = 0; j < this.collapseData[i].roleItemList.length; j++) {
                  if (item == this.collapseData[i].roleItemList[j].id) {
                     roleList.push(this.collapseData[i].roleItemList[j]);
                     continue;
                  }
               }
            }
         });
         // 去除默认角色
         roleList.forEach((item, index) => {
            if (item.name == "SYSR.APP_MANAGER") {
               roleList.splice(index, 1);
            }
         });

         // 更改原数据中的角色列表,方便保存
         this.menuTableData.forEach((item, index) => {
            if (this.dialogType == "row") {
               if (item.id == this.nowEmpowerData.id) {
                  item.roles = roleList;
                  if (roleList.length > 4) {
                     item.isShowUser = "open";
                  } else {
                     item.isShowUser = "";
                  }
               }
            } else {
               this.nowEmpowerDataList.forEach((e) => {
                  if (item.id == e.id) {
                     item.roles = roleList;
                     if (roleList.length > 4) {
                        item.isShowUser = "open";
                     } else {
                        item.isShowUser = "";
                     }
                  }
               });
            }
         });

         // 更新展示数组的值
         this.menuTableShowData = this.menuTableData;

         this.coloseEmpowerDialog();
      },
      // 按钮弹窗保存按钮
      saveButtonForm() {
         let dataForm = {
            assetId: this.assetId,
            tag: {
               tagName: this.buttonForm.tagName,
               tagCode: this.buttonForm.tagCode,
               appId: this.appid,
            },
         };
         saveAddButtonData(dataForm)
            .then(() => {
               this.$message.success("保存成功");
               this.getButtonDialogTableData();
            })
            .catch((err) => {
               this.$message.warning(err.data.message);
            });
      },
      // 按钮弹窗赋权保存按钮
      saveEmpowerButtonForm() {
         let dataForm = {
            assetId: this.assetId,
            dataList: [],
         };
         this.buttonEmpowerForm.tag_id.forEach((item) => {
            dataForm.dataList.push({
               menu_id: this.addbuttonEmpowerRow.id,
               role_id: this.buttonEmpowerForm.user,
               tag_id: item,
            });
         });

         saveAddButtonEmpowerData(dataForm)
            .then(() => {
               this.$message.success("添加成功");
               this.getLazyUserTableData();
            })
            .catch((err) => {
               this.$message.warning(err.data.message);
            });
      },
      // 按钮弹窗删除按钮
      deleteButton(row) {
         let dataForm = {
            assetId: this.assetId,
            tagId: row.id,
         };
         deleteAddButtonData(dataForm).then(() => {
            this.$message.success("删除成功");
            this.getButtonDialogTableData();
         });
      },
      // 按钮弹窗删除赋权数据
      deleteEmpowerButton(row) {
         let dataForm = {
            assetId: this.assetId,
            role_id: row.id,
            menu_id: this.addbuttonEmpowerRow.id,
         };
         deleteUserButtonData(dataForm).then((res) => {
            this.$message.success("删除成功");
            this.getLazyUserTableData();
         });
      },
      // 按钮弹窗表格数据
      getButtonDialogTableData() {
         let dataForm = {
            assetId: this.assetId,
            appId: this.appid,
         };
         queryAddButtonTableData(dataForm).then((res) => {
            this.addbuttonTableData = res.data;
         });
      },
      // 切换弹窗tabs
      changeDialogTabs() {
         this.getSystemUserCheckData();
         if (this.dialogType == "row") {
            if (!this.collapseCheckList.length) {
               if (this.nowEmpowerData.roles) {
                  this.nowEmpowerData.roles.forEach((item) => {
                     this.collapseCheckList.push(item.id);
                  });
               }
            }
         }
      },
      // 获取应用角色多选数据
      getAppUserCheckData() {
         let _checkList = [];
         queryAppUserCheckData(this.appid).then((res) => {
            this.appUserCheckDataList = res.data;
            res.data.forEach((item) => {
               if (item.name == "SYSR.APP_MANAGER") {
                  _checkList.push(item.id);
               }
               if (this.dialogType == "row") {
                  if (this.nowEmpowerData.roles) {
                     this.nowEmpowerData.roles.forEach((e) => {
                        if (item.id == e.id) {
                           _checkList.push(item.id);
                        }
                     });
                  }
               }
            });
            this.appUserCheckList = _checkList;
            this.saveEmpowerDataList.app = _checkList;
            this.getAppUserTableData(this.appUserCheckList, "appUser");
         });
      },
      // 应用角色触发多选
      changeAppUserCheck() {
         this.appPage = 1;
         this.getAppUserTableData(this.appUserCheckList, "appUser");
      },
      // 获取系统角色多选数据
      getSystemUserCheckData() {
         querySystemUserCheckData().then((res) => {
            this.collapseData = res.data;
            res.data.forEach((item) => {
               this.collapseDefaultActive.push(item.id);
            });
         });
      },
      // 系统角色折叠面板选中数据
      collapseCheckChange() {
         this.systemPage = 1;
         this.getAppUserTableData(this.collapseCheckList);
      },
      // 获取弹窗表格数据
      getAppUserTableData(dataList, type) {
         let dataForm = JSON.parse(JSON.stringify([...new Set(dataList)]));
         queryAppUserTableData(dataForm).then((res) => {
            if (type == "appUser") {
               this.appUserTableData = res.data;
               this.dataPaging(this.appPage, this.appPageSize, this.appUserTableData, "app");
            } else {
               this.systemUserTableData = res.data;
               this.dataPaging(this.systemPage, this.systemPageSize, this.systemUserTableData, "system");
            }
         });
      },
      // 菜单表格切换页码
      menuPageChange(page) {
         this.menuPage = page;
         this.dataPaging(page, this.menuPageSize, this.menuTableShowData, "menu");
      },
      // 菜单表格切换页数
      menuSizeChange(size) {
         this.menuPageSize = size;
         this.dataPaging(this.menuPage, size, this.menuTableShowData, "menu");
      },
      // 应用角色切换页码
      appPageChange(page) {
         this.appPage = page;
         this.dataPaging(page, this.appPageSize, this.appUserTableData, "app");
      },
      // 应用角色切换页数
      appSizeChange(size) {
         this.appPageSize = size;
         this.dataPaging(this.appPage, size, this.appUserTableData, "app");
      },
      // 系统角色切换页码
      systemPageChange(page) {
         this.systemPage = page;
         this.dataPaging(page, this.systemPageSize, this.systemUserTableData, "system");
      },
      // 系统角色切换页数
      systemSizeChange(size) {
         this.systemPageSize = size;
         this.dataPaging(this.systemPage, size, this.systemUserTableData, "system");
      },
      // 按钮表格切换页码
      buttonPageChange(page) {
         this.buttonPage = page;
         this.dataPaging(page, this.buttonPageSize, this.buttonTableData, "button");
      },
      // 按钮表格切换页数
      buttonSizeChange(size) {
         this.buttonPageSize = size;
         this.dataPaging(this.buttonPage, size, this.buttonTableData, "button");
      },
      // 分页处理
      dataPaging(page, size, data, type) {
         let pageArray = [];
         if (data.id) {
            if (type == "menu") {
               pageArray.push(data);
               this.menuTableShowData = pageArray;
               return;
            }
         }
         data.forEach((item, index) => {
            if (page == 1) {
               if (index < size) {
                  pageArray.push(item);
               }
            } else {
               if (index > size * (page - 1) && index <= size * page) {
                  pageArray.push(item);
               }
            }
         });
         if (type == "menu") {
            pageArray.forEach((item) => {
               if (item.roles) {
                  if (item.roles.length <= 4) {
                     item.isShowUser = "";
                  }
                  if (item.roles.length > 4) {
                     item.isShowUser = "close";
                  }
               } else {
                  item.roles = [];
               }
            });
            this.menuTableShowData = pageArray;
         } else if (type == "app") {
            this.appUserTableShowData = pageArray;
         } else if (type == "system") {
            this.systemUserTableShowData = pageArray;
         } else if (type == "button") {
            this.buttonTableShowData = pageArray;
         }
      },
      // 保存所有数据
      saveAllData() {
         let _data = JSON.parse(JSON.stringify(this.menuTableData));
         _data.forEach((item) => {
            delete item.isShowUser;
         });
         let dataForm = {
            datappButtonList: [],
            datappMenuList: _data,
         };
         saveCheckData(dataForm).then(() => {
            this.$message.success("保存成功");
            this.getUserTableData();
            this.getLazyUserTableData();
         });
      },
      // 注册组件名
      Event_Center_getName() {
         return "组件名称";
      },
   },
   // 注销页面
   destroyed() {
      window.componentCenter?.removeInstance(this.customConfig?.componentId);
   },
};
</script>
