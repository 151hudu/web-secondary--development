<template>
  <div class="liuChen-page">
    <div class="leftTree">
      <div class="plantAdd">
        <div class="planTitleLeft">
          <img class="planImg" src="../../pluginTemp/images/Category.png" alt="">
          <span class="planTitle">计划列表</span>
        </div>
        <!-- <div v-if="plantList.length == 0" class="addIcon" @click="addPalnt">＋</div> -->
      </div>
      <!-- 菜单 -->
      <div v-if="plantList.length > 0" class="menu_list">
        <!-- 计划 -->
        <div class="menu_item" v-for="planTtem, planIndx in plantList" :key="planTtem.seletKey">
          <div class="menu_item_box planIdent" :class="{ 'menu_item_box_active': menuActive == planTtem.seletKey }" @click="changeForm(planTtem)">
            <img class="menuIcon" src="../../pluginTemp/images/menuIcon.png" alt="" @click="openTheKey(planTtem)">
            <!-- <img class="menuIcon" src="../../pluginTemp/images/menuIcon.png" alt=""> -->
            <el-tooltip class="item" effect="dark" :content="planTtem.plan_name" placement="top-start">
              <span class="menuPlanTitle">{{ planTtem.plan_name }}</span>
            </el-tooltip>
            <el-dropdown class="dropdownBox" trigger="click" placement="bottom-start" @command="handleCommand">
              <span class="el-dropdown-link">
                <i class="el-icon-more"
                  :style="{ 'color': menuActive == planTtem.seletKey ? '#FFFFFF' : '#373A55' }"></i>
              </span>
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item :command="{ mod: 'add', item: planTtem, index: planIndx }">新增</el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
          </div>
          <!-- 任务 -->
          <div class="menu_item" v-for="taskItem, taskIndx in planTtem.tasks" :key="taskItem.seletKey" :style="{'display': planTtem.openKey == true ? 'block' : 'none'}">
          <!-- <div class="menu_item" v-for="taskItem, taskIndx in planTtem.tasks" :key="taskItem.seletKey"> -->
            <div class="menu_item_box taskIdent" :class="{ 'menu_item_box_active': menuActive == taskItem.seletKey }" @click="changeForm(taskItem)">
              <img class="menuIcon" src="../../pluginTemp/images/menuIcon.png" alt="" @click="openTheTaskKey(taskItem.seletKey)">
              <!-- <img class="menuIcon" src="../../pluginTemp/images/menuIcon.png" alt=""> -->
              <el-tooltip class="item" effect="dark" :content="taskItem.project_name" placement="top-start">
                <span class="taskTitle">{{ taskItem.project_name }}</span>
              </el-tooltip>
              <el-dropdown class="dropdownBox" trigger="click"  :hide-on-click='false' placement="bottom-start" @command="handleCommand">
                <span class="el-dropdown-link">
                  <i class="el-icon-more"
                    :style="{ 'color': menuActive == taskItem.seletKey ? '#FFFFFF' : '#373A55' }"></i>
                </span>
                <el-dropdown-menu slot="dropdown">
                  <el-dropdown-item :command="{ mod: 'add', item: taskItem, index: taskIndx }">新增</el-dropdown-item>
             
                  <el-popconfirm  v-if='taskItem.procedures?.length==0 || !taskItem.procedures' title="确定删除这条工程吗？" @confirm="handleCommand({ mod: 'del', item: planTtem, index: taskIndx })">
                      <el-dropdown-item slot="reference" :command="{ mod: null  }"  > 删除</el-dropdown-item>
                  </el-popconfirm>
                  <el-popconfirm  v-else title="不可删除">
                      <el-dropdown-item slot="reference" :command="{ mod: null  }"  > 删除</el-dropdown-item>
                  </el-popconfirm>
                  <!-- <el-dropdown-item slot="reference"  :command="{ mod: 'del', item: planTtem, index: taskIndx }"> 删除</el-dropdown-item> -->
                </el-dropdown-menu>
              </el-dropdown>
            </div>
            <!-- 工序 -->
            <div class="menu_item" v-for="procedure, procedIdx in taskItem.procedures" :key="procedure.seletKey" :style="{'display': taskItem.openKey == true ? 'block' : 'none'}">
            <!-- <div class="menu_item" v-for="procedure, procedIdx in taskItem.procedures" :key="procedure.seletKey"> -->
                </el-tooltip>
                <el-dropdown class="dropdownBox"  :hide-on-click='false' trigger="click" placement="bottom-start" @command="handleCommand">
                  <span class="el-dropdown-link">
                    <i class="el-icon-more"
                      :style="{ 'color': menuActive == procedure.seletKey ? '#FFFFFF' : '#373A55' }"></i>
                  </span>
                  <el-dropdown-menu slot="dropdown">

                    <el-popconfirm   title="确定删除这条工序吗？" @confirm="handleCommand({ mod: 'del', item: taskItem, index: procedIdx })">
                      <el-dropdown-item slot="reference" :command="{ mod: null  }"  > 删除</el-dropdown-item>
                  </el-popconfirm>
                    <!-- <el-dropdown-item :command="{ mod: 'del', item: taskItem, index: procedIdx }">删除</el-dropdown-item> -->
                  </el-dropdown-menu>
                </el-dropdown>
              </div>
            </div>
          </div>
      </div>
      </div>
    <!-- 菜单无数据 -->
    <div v-if="plantList.length == 0" class="emptyBox">
      <img class="emptyIcon" src="../../pluginTemp/images/emptyIcon.png" alt="">
      <span>尚未创建计划</span>
    </div>
    <!-- 右侧 -->
    <div class="rightConcent">
      <!-- <component v-if="plantList.length > 0" :is="componentType" :dataSource="{}" :componentType="changeComponentType"/> -->
      <!-- 空白页 -->
      <div v-if="componentType == 'emptyPage'" class="rightEmptyBox">
        <img class="rightEmptyIcon" src="../../pluginTemp/images/plantTask.png" alt="">
        <span class="rightEmptyText">请创建工程计划</span>
        <el-button style="width: 124px; font-size: 16px;" size="small" type="primary" @click="addPalnt" round plain>＋新增计划</el-button>
      </div>
      <!-- 计划新增 -->
      <div v-if="componentType == 'PlantForm'" class="addplantBox">
        <div class="PlantForm_title">
          <div>
            <span class="drawerTitle">计划信息</span>
            <el-select style="margin-left: 20px" size="small" v-model="remoteValue" filterable remote reserve-keyword
              placeholder="请输入计划编号搜索" :remote-method="remoteMethod" :loading="loading" @change="selectMuBan">
              <el-option v-for="item in remoteFilter" :key="item.data_id" :label="item.plan_number"
                :value="item"></el-option>
            </el-select>
          </div>
          <div class="operation_headr_itme preview-save">
            <el-button v-if="templateNo" style="width: 96px; font-size: 14px;" size="small" type="primary" @click="excelEditVisible = true"
              round>
              <img class="preview-icon" src="../../pluginTemp/images/preview.png" alt="">
              编辑模版
            </el-button>
            <el-button style="width: 96px; font-size: 14px;" size="small" type="primary" @click="previewExcel"
              round>
              <img class="preview-icon" src="../../pluginTemp/images/preview.png" alt="">
              预览
            </el-button>
            <el-button style="width: 96px; font-size: 14px;" size="small" type="primary" @click="saveSub('planForm')"
              round>
              <img class="saveIcon" src="../../pluginTemp/images/saveIcon.png" alt="">
              保存
            </el-button>
          </div>
        </div>
        <div class="PlantForm_content">
          <el-form :model="planForm" :rules="rules" ref="planForm" size="small">
            <el-form-item label="计划名称：" key="plan_name" :label-width="formLabelWidth" prop="plan_name">
              <el-input v-model="planForm.plan_name" :clearable="true" placeholder="请输入名称"></el-input>
            </el-form-item>
            <el-form-item label="申报人：" key="applicant" :label-width="formLabelWidth" prop="applicant">
              <!-- <el-input v-model="planForm.applicant" :readonly="true" :clearable="true" placeholder="请输入"></el-input> -->
              <el-select v-model="planForm.applicant" :disabled="true" placeholder="请选择" :readonly="true">
                <el-option v-if="pageMode == 'add'" :label="currentUserIS.name" :value="currentUserIS.id"></el-option>
                <el-option v-if="pageMode == 'edit'" :label="editUser.loginName" :value="editUser.applicant"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="申报单位：" key="applicant_unit" :label-width="formLabelWidth" prop="applicant_unit">
              <el-select v-model="planForm.applicant_unit" :disabled="true" placeholder="请选择" :readonly="true">
                <el-option v-if="pageMode == 'add'" :label="intlGetKeys(currentUserIS.office_name)" :value="currentUserIS.officeId"></el-option>
                <el-option v-if="pageMode == 'edit'" :label="editUser.office_name" :value="editUser.applicant_unit"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item v-if="this.subunitArr.length > 0" label="申报子单位：" :label-width="formLabelWidth" key="subunit"
              prop="subunit">
              <el-select v-model="planForm.subunit" placeholder="请选择">
                <el-option v-for="(item, i) in subunitArr" :key="i" :label="item.office_name"
                  :value="item.id"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="申报时间：" key="applicant_date" :label-width="formLabelWidth" prop="applicant_date">
              <el-date-picker v-model="planForm.applicant_date" :disabled="true" value-format="yyyy-MM-dd" format="yyyy-MM-dd" type="date" placeholder="请选择日期">
              </el-date-picker>
            </el-form-item>
            <el-form-item label="计划类型：" key="plan_type" :label-width="formLabelWidth" prop="plan_type">
              <el-select v-model="planForm.plan_type" placeholder="请选择">
                <el-option v-for="item in planTypeList" :key="item" :label="item" :value="item"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="质量记录号：" key="quality_record_number" :label-width="formLabelWidth"
              prop="quality_record_number">
              <el-input v-model="planForm.quality_record_number" :disabled="true" autocomplete="off" placeholder="请输入"
                :clearable="true"></el-input>
            </el-form-item>
            <el-form-item label="预估工程费：" key="estimate_amount_project_cost" :label-width="formLabelWidth"
              prop="estimate_amount_project_cost">
              <el-input v-model="planForm.estimate_amount_project_cost" type="number" placeholder="请输入" autocomplete="off">
                <template slot="append">万元</template>
              </el-input>
            </el-form-item>
            <!--  -->
            <el-form-item v-if="component_add" label="是否加签：" :label-width="formLabelWidth" prop="whether_signature">
              <el-select v-model="planForm.whether_signature" placeholder="请选择" :disabled="component_only" key="whether_signature" @change="signatureChange">
                <el-option label="是" value="1"></el-option>
                <el-option label="否" value="0"></el-option>
              </el-select>
            </el-form-item>
            <!--   -->
            <el-form-item v-if="component_add && planForm.whether_signature == '1'" label="加签人员：" key="person_of_signature" :label-width="formLabelWidth"
              prop="person_of_signature">
                <el-select v-model="planForm.person_of_signature" placeholder="请选择" multiple :disabled="component_only">
                  <el-option v-for="(item, i) in users" :key="i" :label="item.loginName" :value="item.id"></el-option>
                </el-select>
            </el-form-item>
          </el-form>
        </div>
      </div>
      <!-- 工序任务新增 -->
      <div class="Task-page-add" v-if="componentType == 'TaskForm'">
        <div class="operation_headr">
          <div class="operation_headr_back"><i v-if="backState.task" class="el-icon-back" @click="backTaskFn()"></i>
            <span class="back_title">工程任务</span> <el-select size="small" v-model="remoteValue" filterable remote
              reserve-keyword placeholder="请输入关键词" :remote-method="remoteMethod" :loading="loading"
              @change="selectMuBan">
              <el-option v-for="item in remoteFilter" :key="item.data_id" :label="item.project_name"
                :value="item"></el-option>
            </el-select>
          </div>
          <div class="operation_headr_itme">
            <el-button type="primary" @click="saveTask()" round>
              <svg style="margin-right:5px" width="14" height="14" viewBox="0 0 14 14" fill="#fff"
                xmlns="http://www.w3.org/2000/svg">
                <path fill-rule="evenodd" clip-rule="evenodd"
                  d="M3 0.5C1.61929 0.5 0.5 1.61929 0.5 3V11C0.5 12.3807 1.61929 13.5 3 13.5H11C12.3807 13.5 13.5 12.3807 13.5 11V3.72727V3.52017L13.3536 3.37372L10.6263 0.646447L10.4798 0.5H10.2727H3ZM1.5 3C1.5 2.17157 2.17157 1.5 3 1.5H3.5V3.5C3.5 4.88071 4.61929 6 6 6H7.5C8.88071 6 10 4.88071 10 3.5V1.5H10.0656L12.5 3.93438V11C12.5 11.8284 11.8284 12.5 11 12.5V10.5C11 9.11929 9.88071 8 8.5 8H5.5C4.11929 8 3 9.11929 3 10.5L3 12.5C2.17157 12.5 1.5 11.8284 1.5 11V3ZM10 10.5V12.5H4V10.5C4 9.67157 4.67157 9 5.5 9H8.5C9.32843 9 10 9.67157 10 10.5ZM9 1.5H4.5V3.5C4.5 4.32843 5.17157 5 6 5H7.5C8.32843 5 9 4.32843 9 3.5V1.5ZM8 3H7V4H8V3Z"
                  fill="white" />
              </svg>
              保存
            </el-button>
          </div>
        </div>
        <div class="operation_main">
          <el-form :model="taskForm" @submit.native.prevent :rules="taskRules" ref="taskForm" size="small">
            <el-form-item label="工程名称：" key="project_name" :label-width="formLabelWidth" :clearable="true"
              :readonly="true" prop="project_name">
              <el-input v-model="taskForm.project_name" autocomplete="off" placeholder="请输入"></el-input>
            </el-form-item>
            <el-form-item label="类型：" key="project_type" :label-width="formLabelWidth" prop="project_type">
              <el-select v-model="taskForm.project_type" placeholder="请选择">
                <el-option label="A" value="A"></el-option>
                <el-option label="B" value="B"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="功能区域："    key="function_area"   :label-width="formLabelWidth" prop="function_area">
              <el-select v-model="taskForm.function_area"   multiple placeholder="请选择">
                <el-option v-for="(item, i) in funAreaArr  " :key="i" :label="item.function_area"
                  :value="item.function_area"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="关联设备："   key="associated_devices" :label-width="formLabelWidth"
              prop="associated_devices">
              <el-select v-model="taskForm.associated_devices"  multiple placeholder="请选择">
                <el-option v-for="(item, i) in devicesArr  " :key="i" :label="item.associated_devices"
                  :value="item.associated_devices"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="施工标准或要求：" :label-width="formLabelWidth" prop="requirement_for_construction">
              <el-input type="textarea" :rows="3" maxlength="100" placeholder="请输入内容" show-word-limit
                v-model="taskForm.requirement_for_construction">
              </el-input>
            </el-form-item>
            <el-form-item label="备注信息：" :label-width="formLabelWidth" prop="remark">
              <el-input type="textarea" :rows="3" maxlength="100" placeholder="请输入内容" show-word-limit
                v-model="taskForm.remark">
              </el-input>
            </el-form-item>
            <el-form-item v-if="keZhang" label="专业：" key="professional" :label-width="formLabelWidth"
              prop="professional">
              <el-select v-model="taskForm.professional" placeholder="请选择">
                <el-option v-for="(item, i) in majorList" :key="i" :label="item" :value="item"></el-option>
                <el-option label="aaa" value="0"></el-option>
              </el-select>
            </el-form-item>
             <!-- v-if="keZhang" -->
            <el-form-item v-if="keZhang" label="施工单位：" key="unit_of_construction " :label-width="formLabelWidth"
              prop="unit_of_construction ">
              <el-select v-model="taskForm.unit_of_construction" placeholder="请选择">
                <el-option v-for="(item, i) in abbreviationLIst" :key="i" :label="item.abbreviation_of_unit"
                  :value="item.abbreviation_of_unit"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="附件信息：" :label-width="formLabelWidth" prop="file">
              <div>
                <!-- <el-upload class="upload-demo" action="api/image/upload" :on-change="handleChange"> -->
                <input type="file" ref="fileBtn" @change="handleFileChange" style="display: none" />
                <button class="Task_add_upload" @click="
                  () => {
                    this.$refs.fileBtn.click();
                  }
                "><span class="iconfont">&#xe63d;</span> 上传附件</button>
                <!-- </el-upload> -->
              </div>
              <div class="file_list"  v-for="(item,i) in taskForm.file_list" :key="i"   >
                  <span  style="margin-right: 15px;"> {{item.file_name}}</span>
                  <span style="cursor: pointer;" @click='deleteClik(i)' ><i class="el-icon-delete"></i></span>
                </div>
            </el-form-item>
            <el-form-item label="" :label-width="formLabelWidth" prop="">
              <input type="text" style="display:none">
            </el-form-item>
          </el-form>
        </div>
      </div>
      <!-- 工序任务详情页 -->
      <div class="Task-page" v-if="componentType == 'Task'">
        <div class="descriptions_task">
          <div class="title_class">
            <div class="title_class_start">
              <img class="imgTile" src="../../pluginTemp/images/layer.png" alt="" srcset="">
              <span class="spanTile"> {{
                  tasksPrievw.project_name
              }}</span>
            </div>
            <div class="title_class_end">
              <el-button circle type="small" @click="taskEdit(tasksPrievw)"> <i class="el-icon-edit"></i> </el-button>
            </div>
          </div>
          <el-descriptions :column="4">

            <el-descriptions-item labelClassName="title_label" contentClassName="title_content" label="工程名称">{{
                tasksPrievw.project_name
            }}</el-descriptions-item>
            <el-descriptions-item labelClassName="title_label" contentClassName="title_content" label="功能区域">
              <div :class="{ title_gongn: tasksPrievw.function_area }"> {{
                  tasksPrievw.function_area
              }}</div>
            </el-descriptions-item>
            <el-descriptions-item labelClassName="title_label" contentClassName="title_content" label="关联设备">
              <div :class="{ title_guanl: tasksPrievw.associated_devices }">
                {{
                    tasksPrievw.associated_devices
                }}
              </div>
            </el-descriptions-item>
            <el-descriptions-item labelClassName="title_label" contentClassName="title_content" label="施工要求">{{
                tasksPrievw.requirement_for_construction
            }}</el-descriptions-item>

          </el-descriptions>
          <el-descriptions>
            <el-descriptions-item labelClassName="title_label" contentClassName="title_content" label="备注信息">{{
                tasksPrievw.remark
            }}</el-descriptions-item>


          </el-descriptions>
          <el-descriptions>
            <el-descriptions-item labelClassName="title_label" contentClassName="title_content" label="附件信息">
              <span style="margin-right:8px" v-for="(item, i) in  tasksPrievw.file_list" :key="i">
                <a :href="item.file" target="_blank" rel="noopener noreferrer"> {{ item.file_name ||
                    tasksPrievw.file
                }}</a>
              </span>
              <!-- <span
                @click="previewMoadlFn" class="title_content_a_file">
                {{ tasksPrievw.file_name || tasksPrievw.file }}
              </span> -->
            </el-descriptions-item>
          </el-descriptions>
        </div>
        <div class="task_operaList">
          <div class="task_opear_title_add">
            <div class="task_opear_title">

              <img src="../../pluginTemp/images/hengLine.png" alt="" srcset="">
              任务工序
            </div>
            <div class="addIcon" @click="handleCommand({ mod: 'add', item: tasksPrievw, index: null })">＋</div>
          </div>

          <div class="task_opear_main">
            <div class="task_operaList_item" v-for="(item, i) in tasksPrievw.procedures" :key="i">
              <div class="task_opera_name text_class">{{ item.process_name }}</div>
              <div class="task_opera_step text_class"><span class="title_label">工序步骤：</span>{{   item.steps?  item.steps.length:0}}
              </div>
              <div class="task_opera_procedure text_class"><span class="title_label">物料清单：</span>{{
                  item.materials?  item.materials.length:0
              }}</div>
              <div class="task_opera_cz" @click="proceduresEdit(item, i, tasksPrievw)"><img
                  style="vertical-align: middle;" src="../../pluginTemp/images/Edit.png" alt="" srcset=""> 编辑</div>
            </div>
          </div>
        </div>
      </div>
      <!-- 工序新增 -->
      <div class="Operation-page" v-if="componentType == 'Procedure'">
        <div class="operation_headr">
          <div class="operation_headr_back"><i v-if="backState.operation" @click="backFn()" class="el-icon-back"></i>
            <span class="back_title">工序名称</span>
            <el-select size="small" v-model="remoteValue" filterable remote reserve-keyword placeholder="请输入关键词"
              :remote-method="remoteMethod" :loading="loading" @change="selectMuBan">
              <el-option v-for="item in remoteFilter" :key="item.data_id" :label="item.process_name"
                :value="item"></el-option>
            </el-select>
          </div>
          <div class="operation_headr_itme preview-save">
            <el-button type="primary" round @click="OperationSave">
              <svg style="margin-right:5px" width="14" height="14" viewBox="0 0 14 14" fill="#fff"
                xmlns="http://www.w3.org/2000/svg">
                <path fill-rule="evenodd" clip-rule="evenodd"
                  d="M3 0.5C1.61929 0.5 0.5 1.61929 0.5 3V11C0.5 12.3807 1.61929 13.5 3 13.5H11C12.3807 13.5 13.5 12.3807 13.5 11V3.72727V3.52017L13.3536 3.37372L10.6263 0.646447L10.4798 0.5H10.2727H3ZM1.5 3C1.5 2.17157 2.17157 1.5 3 1.5H3.5V3.5C3.5 4.88071 4.61929 6 6 6H7.5C8.88071 6 10 4.88071 10 3.5V1.5H10.0656L12.5 3.93438V11C12.5 11.8284 11.8284 12.5 11 12.5V10.5C11 9.11929 9.88071 8 8.5 8H5.5C4.11929 8 3 9.11929 3 10.5L3 12.5C2.17157 12.5 1.5 11.8284 1.5 11V3ZM10 10.5V12.5H4V10.5C4 9.67157 4.67157 9 5.5 9H8.5C9.32843 9 10 9.67157 10 10.5ZM9 1.5H4.5V3.5C4.5 4.32843 5.17157 5 6 5H7.5C8.32843 5 9 4.32843 9 3.5V1.5ZM8 3H7V4H8V3Z"
                  fill="white" />
              </svg>
              保存
            </el-button>
          </div>
        </div>
        <div class="operation_main">
          <el-form v-if="componentType == 'Procedure'" :model="operationForm" @submit.native.prevent :rules="rules"
            ref="operationForm" size="small">
            <el-form-item label="工序名称:" key="process_name" :label-width="formLabelWidth" :clearable="true"
              :readonly="true" prop="process_name">
              <el-input v-model="operationForm.process_name" autocomplete="off" placeholder="请输入"></el-input>
            </el-form-item>
            <el-form-item label="工序步骤:" :label-width="formLabelWidth" prop="">
              <div class="procedures_name_table_detailed">
                <el-table :data="operationForm?.steps" style="width: 100%" border stripe
                  header-cell-class-name='listBan'>
                  <el-table-column type="index" width="50" label="序号">
                  </el-table-column>
                  <el-table-column prop="loadValue" label="工序描述">
                    <template slot-scope="scope">
                      <el-form-item :clearable="true" :prop="`steps.${scope.$index}.process_desc`"
                        :rules="{ required: true, message: '请输入工序描述', trigger: 'blur' }">
                        <el-input v-model="scope.row.process_desc" :controls="false" type="text" size="small" />
                      </el-form-item>
                    </template>
                  </el-table-column>
                  <el-table-column prop="unit_engineering_quantity" label="工程量单位">
                    <template slot-scope="scope">
                      <el-form-item :clearable="true" :prop="`steps.${scope.$index}.unit_engineering_quantity`"
                        :rules="{ required: Boolean(scope.row.quantity_engineering_quantity), message: '请选择工程量', trigger: 'change' }">
                        <el-select v-model="scope.row.unit_engineering_quantity" placeholder="请选择">
                          <el-option v-for="(item, i) in stepsUnit  " :key="i" :label="item.unit_engineering_quantity"
                            :value="item.data_id"></el-option>

                        </el-select>
                      </el-form-item>
                      <!-- :prop="`steps.${scope.$index}.unit_engineering_quantity `" -->
                      <!-- :rules="{ required: true, message: '请选择工程量', trigger: 'change' }" -->
                      <!-- <el-form-item v-if="Boolean(scope.row.quantity_engineering_quantity)"
                        :prop="`steps.${scope.$index}.unit_engineering_quantity `"
                        :rules="{ required: true, message: '请选择工程量', trigger: 'change' }" key="121212">
                        <el-select v-model="scope.row.unit_engineering_quantity" placeholder="请选择">
                          <el-option v-for="(item, i) in stepsUnit  " :key="i" :label="item.unit_engineering_quantity"
                            :value="item.data_id"></el-option>
                        </el-select>
                      </el-form-item>
                      <el-form-item v-else :clearable="true" key="1212123333">
                        <el-select v-model="scope.row.unit_engineering_quantity" placeholder="请选择">
                          <el-option v-for="(item, i) in stepsUnit  " :key="i" :label="item.unit_engineering_quantity"
                            :value="item.data_id"></el-option>

                        </el-select>
                      </el-form-item> -->

                    </template>
                  </el-table-column>
                  <el-table-column prop="sampleThickness" label="工程量数量">
                    <template slot-scope="scope">
                      <el-input-number v-model="scope.row.quantity_engineering_quantity" controls-position="right"
                        size="small" />
                    </template>
                  </el-table-column>


                  <el-table-column label="操作">
                    <template slot-scope="scope">
                      <el-popconfirm  title="确认删除这条记录吗？"  @confirm="detailedDelFn(scope)"   >
                          <el-button slot="reference" type="text"  size="small">删除</el-button>
                        </el-popconfirm>
                    </template>
                  </el-table-column>
                  <div slot="append" class="child_end_fill">
                    <div class="end_span" @click="detailedAddFn">新增</div>
                  </div>
                </el-table>
              </div>

            </el-form-item>
            <el-form-item label="物料清单:" :label-width="formLabelWidth" prop="">
              <div class="procedures_name_table_detailed  procedures_name_table_procedure">
                <el-table :data="operationForm?.materials" style="width: 100%" border stripe
                  header-cell-class-name='listBan'>
                  <el-table-column type="index" width="50" label="序号">
                  </el-table-column>
                  <el-table-column prop="loadValue" label="物料编码">
                    <template slot-scope="scope">
                      <el-input v-model="scope.row.material_code" :controls="false" :disabled="true" type="text"
                        size="small" />
                    </template>
                  </el-table-column>
                  <el-table-column prop="vnotchesWidth" label="物料名称">
                    <template slot-scope="scope">
                      <el-input v-model="scope.row.material_name" :controls="false" :disabled="true" type="text"
                        size="small" />
                    </template>
                  </el-table-column>

                  <el-table-column prop="sampleThickness" label="材料标准">
                    <template slot-scope="scope">
                      <el-input v-model="scope.row.standard_materials" :controls="false" type="text" size="small" />
                    </template>
                  </el-table-column>

                  <el-table-column prop="sampleThickness" label="补充说明">
                    <template slot-scope="scope">
                      <el-input v-model="scope.row.additional_note" :controls="false" type="text" size="small" />
                    </template>
                  </el-table-column>
                  <el-table-column prop="sampleThickness" label="材料需求量">
                    <template slot-scope="scope">
                      <el-form-item :clearable="true" :prop="`materials.${scope.$index}.material_demand`"
                        :rules="{ required: true, message: '请输入材料需求量', trigger: 'blur' }">
                        <el-input :class="{ ITEMRED: scope.row?.demand_state?.demand_state }" v-model="scope.row.material_demand"
                          :controls="false" @change="changeItemState(scope.$index, 'demand_state')" type="text"
                          size="small" />
                      </el-form-item>
                    </template>
                  </el-table-column>
                  <el-table-column prop="sampleThickness" label="材料采购量（主单位）">
                    <template slot-scope="scope">
                      <el-form-item :clearable="true" :prop="`materials.${scope.$index}.material_purchase_main`"
                        :rules="{ required: true, message: '请输入材料采购量（主单位）', trigger: 'blur' }">
                        <el-input :class="{ ITEMRED: scope.row?.demand_state?.purchase_main_state }"
                          v-model="scope.row.material_purchase_main"
                          @change="changeItemState(scope.$index, 'purchase_main_state')"></el-input>

                      </el-form-item>
                    </template>
                  </el-table-column>
                  <el-table-column prop="sampleThickness" label="主单位">
                    <template slot-scope="scope">
                      <el-input v-model="scope.row.main_unit" :controls="false" type="text" :disabled="true"
                        size="small" />
                    </template>
                  </el-table-column>
                  <el-table-column prop="sampleThickness" label="材料采购量（副单位）">
                    <template slot-scope="scope">
                      <el-form-item :clearable="true" :prop="`materials.${scope.$index}.material_purchase_auxiliary`"
                        :rules="{ required: true, message: '请输入材料采购量（副单位）', trigger: 'blur' }">
                        <el-input :class="{ ITEMRED: scope.row?.demand_state?.purchase_auxiliary_state }"
                          @change="changeItemState(scope.$index, 'purchase_auxiliary_state')"
                          v-model="scope.row.material_purchase_auxiliary" :controls="false" type="text" size="small" />
                      </el-form-item>
                    </template>
                  </el-table-column>
                  <el-table-column prop="sampleThickness" label="副单位">
                    <template slot-scope="scope">
                      <el-input v-model="scope.row.auxiliary_unit" :controls="false" type="text" :disabled="true"
                        size="small" />
                    </template>
                  </el-table-column>
                  <el-table-column prop="sampleThickness" label="是否提供车间">
                    <template slot-scope="scope">
                      <el-select v-model="scope.row.whether_workshop_supply" placeholder="请选择">
                        <el-option label="是" value="1"></el-option>
                        <el-option label="否" value="0"></el-option>
                      </el-select>
                    </template>
                  </el-table-column>
                  <el-table-column label="操作">
                    <template slot-scope="scope">
                        <el-button   type="text" @click="calculationClick(scope.row, scope.$index)"
                        size="small">计算</el-button>
                        <el-popconfirm  title="确认删除这条记录吗？"  @confirm="procedureDelFn(scope)"   >
                          <el-button slot="reference" type="text"  size="small">删除</el-button>
                  </el-popconfirm>
                    
                    </template>
                  </el-table-column>
                  <div slot="append" class="child_end_fill">
                    <div class="end_span" @click="procedureAddFn">新增</div>
                  </div>
                </el-table>
              </div>

            </el-form-item>

          </el-form>

        </div>
      </div>
    </div>
    <!-- excel编辑 -->
    <el-dialog class="excel-dialog" title="" :visible.sync="excelEditVisible" width="80%" append-to-body>
      <SpreadJsEdit :plantList="plantList" v-if="excelEditVisible" />
    </el-dialog>
    <!-- excel弹窗 -->
    <el-dialog class="excel-dialog" title="" :visible.sync="excelVisible" width="80%" append-to-body>
      <SpreadJs :plantList="plantList" v-if="excelVisible" />
    </el-dialog>
    <!-- 弹窗 -->
    <el-dialog class="two_dialog" :title="title" :visible.sync="dialogVisible" width="30%">
      <el-form :model="nameForm" :rules="rules" ref="addNameForm" size="small">
        <el-form-item label="名称：" :label-width="formLabelWidth" prop="addName">
          <el-input v-model.trim="nameForm.addName" :clearable="true" placeholder="请输入"></el-input>

        </el-form-item>
        <el-form-item label="" :label-width="formLabelWidth" prop="">
          <el-input style="display: none;" :clearable="true" placeholder="请输入"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="closeDialog('addNameForm')">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 物料清单新增弹窗 -->
    <el-dialog class="two_dialog" title="物料清单表" :visible.sync="materialsVisible" width="80%">
        <div class="select_filed">
            <el-row :gutter="20">
              <el-col  class='select_filed_col' :span="6">物料编号： <el-input width='250px'  placeholder="请输入物料编号" v-model="queryParams.material_code" ></el-input> </el-col>
    <el-col class='select_filed_col' :span="6">物料名称：<el-input placeholder="请输入物料名称"  v-model="queryParams.material_name "></el-input></el-col>
    <el-col class='select_filed_col' :span="6">物料分类：<el-input placeholder="请输入物料分类"  v-model="queryParams.material_type"></el-input></el-col>
    <el-col class='select_filed_col' :span="4"><button class='queyr_button'  @click='procedureAddFn'>查询</button> <button @click='restFn'  class='queyr_button rest_btn'>重置</button> </el-col>
              </el-row>
        </div>

      <el-table :data="materialsTable" row-key="data_id" ref="multipleTable" stripe style="width: 100%"
        tooltip-effect="dark" @selection-change="handleSelectionChange"
        :header-cell-style="{ padding: 0 + 'px', fontSize: '12px', fontWeight: 400 }"
        :header-row-style="{ height: '30px' }">
        <el-table-column type="selection" :selectable="checkSelectable" :reserve-selection="true" width="55"
          fixed="left">
        </el-table-column>
        <el-table-column type="index" label="序列" width="55" fixed="left">
        </el-table-column>
        <el-table-column prop="material_code" label="物料编号">
        </el-table-column>
        <el-table-column prop="material_name" label="物料名称">
        </el-table-column>
        <el-table-column prop="material_type" label="物料分类">
        </el-table-column>
        <el-table-column prop="main_unit" label="主单位">
        </el-table-column>
        <el-table-column prop="auxiliary_unit" label="副单位">
        </el-table-column>
      </el-table>
      <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="currentPage"
        class="two_pagination" :page-sizes="[10, 20, 30, 40]" :page-size="pageSize"
        layout="total, sizes, prev, pager, next, jumper" :total="total">
      </el-pagination>
      <span slot="footer" class="dialog-footer">
        <el-button @click="materialsVisible = false;">取 消</el-button>
        <el-button type="primary" @click="addmaterials()">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 文件预览弹窗 -->
    <el-dialog class="two_dialog" title="" :visible.sync="previewVisible" width="80%">
      <iframe sandbox="allow-scripts allow-top-navigation allow-same-origin allow-popups" :src="iframeSrc" width='100%' height='700' frameborder="0"></iframe>
    </el-dialog>
  </div>
</template>

<script>
import Vue from "vue";
import eventActionDefine from "./msgCompConfig";
// import {
//   Menu, MenuItem, Submenu, Drawer, Form, FormItem, Button, MessageBox,
//   Message, Pagination, DatePicker, Dropdown, DropdownMenu, DropdownItem,
//   Dialog, Descriptions, DescriptionsItem, Table, TableColumn, Input, Row,Col,
//   InputNumber, Select, Upload, Tooltip,Popconfirm,Popover
// } from "element-ui";
import { 
  queryUnit, queryDevices, queryOfficeUser, queryFunArea,
  queryMaterials, queryAllMuBan, uploadFile, puginImport, getDictId, 
  queryDict, queryPlanNumber, queryAdmin, querySelsctAdmin, 
  queryConstructionCompany, queryAdminRoles
} from '../api/asset'
import { get_NumberingRules } from '../utils/numberingRules';
import SpreadJs from './spreadjs/index.vue';
import SpreadJsEdit from './spreadjs/SpreadJsEdit.vue'
import qs from "querystringify";
import moment from "moment";

const { templateNo } = qs.parse(
  window.location.search
);

export default {
  name: "AddMultiple",
  props: {
    customConfig: Object,
  },
  components: {
    SpreadJs,
    SpreadJsEdit
  },
  data() {
    let checkAge = (rule, value, callback) => {
      if (!value) {
        return callback(new Error('金额不能为空'));
      } else {
        callback();
      }
    };
    let currentUserIS = window?.currentUser || { name: "admin", id: "1234567890", office_name: "SO.MINE_OFFICE", officeId: "123456789" };
    let intlGetKeys = this.customConfig?.intlGetKey;
    return {
      currentUserIS, // 当前用户
      intlGetKeys, // 国际化
      data: this.customConfig.data,
      propsConfiguration: this.customConfig.configuration || "{}",
      configuration: {},
      component_id: "", // 节点
      component_add: false, // 节点新增字段
      component_only: true, // 节点只读字段
      keZhang: false, // 科长节点字段
      majorList: [], // 专业
      abbreviationLIst: [], // 施工单位
      users: [], // 用户组件
      jieDianXinXi: ['73db0356-d6f4-4ab9-b3ad-b5eb054a4621','2e133bcc-3571-4006-bf54-d9fe62a9c7a6','fa61df90-9915-4b91-8cd5-486256297e17','02b85f11-936e-487c-a747-2ce664ab91f1'],
      pageMode: 'add',
      editUser: {
        applicant: "", // 申报人
        loginName: "", // 名称
        applicant_unit: "", // 申报单位
        office_name: "", // 申报单位名称
        subunit: "", // 子单元
        applicant_date: "", // 申报日期
      },
      componentType: "PlantForm", // 组件类型 emptyPage-空白页 PlantForm-计划新增
      plantList: [], // 大JSON
      menuActive: '',
      title: "",
      formLabelWidth: "80", // 表单label宽
      detailedTable: [],  // 工序步骤数据
      procedureTable: [], //物料数据
      devicesArr: [],//关联设备
      funAreaArr: [],//功能区域
      subunitArr: [],//申报子单位
      stepsUnit: [],//工程量单位
      fileList: [],//上传文件保存
      tasksPrievw: {},//工程任务详情
      operationPrievw: {},//工序详情
      dialogVisible: false,
      excelVisible: false, // excel弹窗状态
      excelEditVisible: false, // excel编辑态
      templateNo: templateNo,
      materialsVisible: false,
      previewVisible: false,
      iframeSrc: '',//弹出框地址
      backState: { operation: "" },//返回状态
      nameForm: {
        addName: ""
      }, materialsTable: [],//物料清单表
      selectionData: [],//选中数据
      loading: false, // 远程搜索
      remoteFilter: [], // 模板数据
      remoteValue: {}, // 选中模板
      clickAddTtem: {}, // 新增项父级数据
      clickAddType: "", // 新增项父级类型
      clickSonAddTtem: {}, // 新增项当前数据
      currentPage: 1,//当前页数
      pageSize: 10,//页数大小
      total: 0,
      title: '',
      queryParams:{
        material_code:'',
        material_type:'',
        material_name:'',
      },//查询物料子表弹框
      dataAll: [],//存放所有数据
      // 计划表单
      planForm: {
        // data_id: "", // 主键
        plan_name: "", // 计划名称
        plan_number: "", // 计划编号
        plan_type: "", // 计划类型
        applicant: "", // 申报人
        applicant_unit: "", // 申报单位
        subunit: "", // 子单元
        applicant_date: new Date(), // 申报日期
        quality_record_number: "NL/QR-PD-06", // 质量记录号
        mode_type: "Plan", // 类型
        estimate_amount_project_cost: null, // 金额
        tasks: []
      },
      //工程任务表单
      taskForm: {
        project_name: '',//工程任务名
        project_type: '', //工程任务类型
        function_area: '',//功能区域 
        associated_devices: '',//关系设备
        requirement_for_construction: '',//规范
        unit_of_construction: "", // 承包商
        professional: "", // 专业
        remark: '',//备注
        file: [{
          name: 'food.jpeg',
          url: 'https://fuss10.elemecdn.com/3/63/4e7f3a15429bfda99bce42a18cdd1jpeg.jpeg?imageMogr2/thumbnail/360x360/format/webp/quality/100'
        }]//附件
      },
      //工序表单  //工序编辑页的数据
      operationForm: {
        name: ''
      },
      planTypeList: [],  // 计划类型
      // 校验
      rules: {
        applicant: [
          { required: true, message: '请输入申报人', trigger: 'blur' }
        ],
        applicant_unit: [
          { required: true, message: '请输入申报单位', trigger: 'change' }
        ],
        subunit: [
          { required: true, message: '请输入申报子单元', trigger: 'change' }
        ],
        applicant_date: [
          { required: true, message: '请选择日期', trigger: 'change' }
        ],
        quality_record_number: [
          { required: true, message: '请输入质量记录号', trigger: 'blur' }
        ],
        plan_type: [
          { required: true, message: '请选择计划类型', trigger: 'change' }
        ],
        plan_name: [
          { required: true, message: '请输入计划名称', trigger: 'blur' }
        ],
        addName: [
          { required: true, message: '请输入计划名称', trigger: 'blur' }
        ],
        estimate_amount_project_cost: [
          { validator: checkAge, trigger: 'blur' }
        ],
        whether_signature: [
          { required: true, message: '请选择是否加签', trigger: 'change' }
        ],
        person_of_signature: [
          { required: true, message: '请选择加签人员', trigger: 'change' }
        ],
        project_name: [
          { required: true, message: '请输入工程名', trigger: 'blur' }
        ],
        project_type: [
          { required: true, message: '请选择类型', trigger: 'change' }
        ],
        function_area: [
          { required: true, message: '请选择功能区域', trigger: 'change' }
        ],
        associated_devices: [
          { required: true, message: '请选择关联设备', trigger: 'change' }
        ],
        work_unit: [
          { required: true, message: '请输入工程量单位', trigger: 'blur' }
        ],
        work_name: [
          { required: true, message: '请输入工序描述', trigger: 'blur' }
        ],
        procedures_name: [
          { required: true, message: '请输入工序名称', trigger: 'blur' }
        ],
        unit_engineering_quantity: [
          { required: true, message: '请选择类型', trigger: 'change' }
        ],
      },
      //task校验
      taskRules: {
        project_name: [
          { required: true, message: '请输入工程名', trigger: 'blur' }
        ],
        project_type: [
          { required: true, message: '请选择类型', trigger: 'change' }
        ],
        function_area: [
          { required: true, message: '请选择功能区域', trigger: 'change' }
        ],
        associated_devices: [
          { required: true, message: '请选择关联设备', trigger: 'change' }
        ],
        professional: [
          { required: true, message: '请选择专业', trigger: 'change' }
        ],
        unit_of_construction: [
          { required: true, message: '请选择施工单位', trigger: 'change' }
        ],
      }
    };
  },
  mounted() {
    console.log('currentUserIS', this.currentUserIS, this.customConfig);
    this.getDictId('plan_apply','plan_type_dictId'); // 计划类型字典
    this.getDictId('plan_apply','quality_record_number_dictId'); // 计划质量编号字典
    this.getDictId('t_contractor_management','professional'); // 计划质量编号字典
    window?.componentCenter?.register(
      this.customConfig.componentId,
      "comp",
      this,
      eventActionDefine
    );
    try {
      this.configuration = JSON.parse(this.propsConfiguration);
      this.plantList = JSON.parse(this.customConfig.data || '[]')
      if (this.plantList.length > 0) {
        this.pageMode = 'edit'
        this.isJieDian(); // 判断节点
        Object.keys(this.editUser).forEach(x=>{
          this.editUser[x] = this.plantList[0][x]
        })
        queryOfficeUser(this.editUser.applicant).then(res => {
          this.subunitArr = res.data?.office_children || []
        }).catch(err => {
          this.subunitArr = []
        })
        this.forKey(this.plantList);
        this.changeForm(this.plantList[0])
        this.queryselestAdmins(this.editUser.applicant);
        this.queryConstruction(); // 查询工程
        this.queryAdmins() // 所有用户
      } else {
        this.pageMode = 'add'
        this.addPalnt()
        queryOfficeUser(this.currentUserIS.officeId).then(res => {
          this.subunitArr = res.data?.office_children || []
        }).catch(err => {
          this.subunitArr = []
        })
      }
      setTimeout(() => {
        console.log('this.plantList', this.plantList)
      }, 500)
    } catch (error) {
      console.error("configuration解析错误", error);
      this.plantList = []
    }
    this.querySelect()
  },
  methods: {
    // 判断当前节点
    isJieDian(){
      this.component_id = this.getQueryString('component_id');
      console.log('this.component_id',this.component_id);
      switch (this.component_id) {
        case "73db0356-d6f4-4ab9-b3ad-b5eb054a4621": // 1. 工程科科长审核时
          this.component_add = true;
          this.component_only = false;
          this.keZhang = true;
          if (this.keZhang = true) {
            this.plantList.forEach(x => {
              if (x.tasks?.length > 0) {
                x.tasks.forEach(y => {
                  y.professional = ""
                  y.unit_of_construction = ""
                })
              }
            })
          }
          break;
        case "2e133bcc-3571-4006-bf54-d9fe62a9c7a6": // 2. 加签人员审批（是否加签为是时）
          this.component_add = true;
          this.component_only = false;
          break;
        case "fa61df90-9915-4b91-8cd5-486256297e17": // 3. 工程科副部长审批：“审批中”节点
          this.component_add = true;
          this.component_only = true;
          break;
        case "02b85f11-936e-487c-a747-2ce664ab91f1": // 4. 工程科部长审批：“待完成”节点
          this.component_add = true;
          this.component_only = true;
          break;
      }
    },
    getQueryString (name) {
      const reg = new RegExp(name + "=([^&]*)(&|$)", "i");
      const r = window.location.search.substr(1).match(reg);
      if (r != null) return r[1];
      return "";
    },
    // 查询数据字典id 
    async getDictId(type, name) {
      let params = {type,name}
      let { data } = await getDictId(params);
      let { value } = data;
      let res = await queryDict(value);
      switch (name) {
        case "plan_type_dictId": // 计划类型
          this.planTypeList = res.data;
          break;
        case "quality_record_number_dictId":  // 质量编号
          this.planForm.quality_record_number = res.data[0];
          break;
        case "professional":  // 专业信息
          this.majorList = Object.keys(res.data).map(x=>{
            return x
          });
          break;
      }
    },
    // 查询承包商信息
    async queryConstruction() {
      let { data } = await queryConstructionCompany();
      this.abbreviationLIst = data;
    },
    // 查询用户组件资产
    async queryAdmins() {
      let { data } = await queryAdminRoles('97dffc6b-28a6-434c-8dd5-2ebee4779f07');
      console.log('用户角色',data);
      this.users = data || [];
    },
    // 查询当前用户
    async queryselestAdmins(params) {
      let { data } = await querySelsctAdmin(params);
      // console.log('editUser',data);
      this.editUser.loginName = data.loginName;
      this.editUser.office_name = data.office_name;
      // console.log('this.editUser',this.editUser);
    },
    // 生成唯一key  tasks key生成规则 00index-00index_true/false  _true/false 拼接当前是否展开
    forKey(list) {
      list.forEach((x, index) => {
        x.seletKey = `00${index}`;
        x.openKey = x.openKey ? x.openKey : true;
        if (x.tasks?.length > 0) {
          x.tasks.forEach((y, yIndex) => {
            y.seletKey = `${x.seletKey}-00${yIndex}`;
            y.openKey = y.openKey ? y.openKey : true;
            if (y.procedures?.length > 0) {
              y.procedures.forEach((els, elsIndex) => {
                els.seletKey = `${y.seletKey}-00${elsIndex}`;
              })
            }
          })
        }
      })
    },
    // 展开菜单栏
    handleOpen(key, keyPath) {
      console.log(key, keyPath);
    },
    // 关闭菜单栏
    handleClose(key, keyPath) {
      console.log(key, keyPath);
    },
    // 计划菜单缩放
    openTheKey(list) {
      let openKey =  !list.openKey;
      this.$set(list,'openKey',openKey)
      // list.openKey = !list.openKey;
      console.log('菜单缩放',list);
    },
    // 工程菜单栏缩放
    openTheTaskKey(key) {
      this.plantList.forEach(x=>{
        x.tasks.forEach(i=>{
          if (i.seletKey == key) {
            let keyList = i.seletKey.split('_');
            i.openKey = !i.openKey
            i.seletKey = keyList[0] + `_${i.openKey}`
            // console.log('菜单缩放',i);
            return
          }
        });
      })
    },
    // 点击菜单
    changeForm(item, type) {
      this.menuActive = item.seletKey;
      console.log('activeitem', item);
      let { mode_type } = item;
      this.clickAddType = mode_type;
      this.clickSonAddTtem = item;
      if (type) {
        this.tasksPrievw = item;
        this.tasksPrievw.status = 2;
        this.taskForm = JSON.parse(JSON.stringify(item))
        this.$set(this.taskForm,'function_area',this.taskForm.function_area?this.taskForm.function_area.split(','):[])
        this.$set(this.taskForm,'associated_devices',this.taskForm.associated_devices?this.taskForm.associated_devices.split(','):[])
        // this.taskForm.function_area=this.taskForm.function_area?this.taskForm.function_area.split(','):''
        // this.taskForm.associated_devices=this.taskForm.associated_devices?this.taskForm.associated_devices.split(','):''
        try {
          this.tasksPrievw.file_list = JSON.parse(item.file || '[]')
          this.taskForm.file = JSON.parse(item.file || '[]')
          this.$set(this.taskForm,'file_list',JSON.parse(item.file || '[]'))
          // this.taskForm.file_list=JSON.parse(item.file || '[]')
        } catch (error) {
          this.taskForm.file = []
          this.taskForm.file_list=[]
          this.tasksPrievw.file ='[]'
          this.tasksPrievw.file_list=[]
        }
        this.componentType = 'TaskForm'
      } else {
        switch (item.mode_type) {
          case "Plan":
            this.componentType = "PlantForm";
            let plan = this.plantList[0];
            this.planForm = {
              // data_id: "", // 主键
              plan_name: plan.plan_name, // 计划名称
              plan_number: "", //计划编号
              plan_type: plan.plan_type, // 计划类型
              applicant: this.pageMode === "add" ? this.currentUserIS.id : plan.applicant, // 申报人
              applicant_unit: this.pageMode === "add" ? this.currentUserIS.officeId : plan.applicant_unit, // 申报单位
              subunit: plan.subunit ? plan.subunit : "", // 子单元
              applicant_date: this.pageMode === "add" ? new Date() : plan.applicant_date, // 申报日期
              quality_record_number: plan.quality_record_number, // 质量记录号
              mode_type: "Plan", // 类型
              estimate_amount_project_cost: plan.estimate_amount_project_cost || null, // 金额
              tasks: plan.tasks ? plan.tasks : [],
              whether_signature: plan.whether_signature || '0',
              person_of_signature: plan.person_of_signature || []
            }
            break;
          case "Task":
            if (item.status == 2) {
              this.componentType = "TaskForm";
              this.taskForm = JSON.parse(JSON.stringify(item))
              this.$set(this.taskForm,'function_area',this.taskForm.function_area?this.taskForm.function_area.split(','):[])
              this.$set(this.taskForm,'associated_devices',this.taskForm.associated_devices?this.taskForm.associated_devices.split(','):[])
              this.tasksPrievw = item;
              if (this.keZhang == true) {
                this.taskForm.professional = ""
                this.taskForm.unit_of_construction = ""
              }
              try {
                this.tasksPrievw.file_list = JSON.parse(item.file || '[]')
                this.taskForm.file = JSON.parse(item.file || '[]')
                this.$set(this.taskForm,'file_list',JSON.parse(item.file || '[]'))
              } catch (error) {
                this.taskForm.file = []
                this.taskForm.file_list=[]
                this.tasksPrievw.file ='[]'
                this.tasksPrievw.file_list=[]
              }
            } else {
              this.componentType = "Task";
              this.tasksPrievw = item;
              if (this.keZhang == true) {
                this.taskForm.professional = ""
                this.taskForm.unit_of_construction = ""
              }
              // this.taskForm.function_area=this.taskForm.function_area?this.taskForm.function_area.split(','):[]
              // this.taskForm.associated_devices=this.taskForm.associated_devices?this.taskForm.associated_devices.split(','):[]
              try {
                this.tasksPrievw.file_list = JSON.parse(item.file || '[]')
                this.taskForm.file = JSON.parse(item.file || '[]')
                
                this.$set(this.taskForm,'file_list',JSON.parse(item.file || '[]'))
              } catch (error) {
                this.taskForm.file = []
                this.taskForm.file_list=[]
                this.tasksPrievw.file ='[]'
                this.tasksPrievw.file_list=[]
              }
              // try {
              //   this.tasksPrievw.file_list = JSON.parse(item.file || '[]')
              //   this.taskForm.file = JSON.parse(item.file || '[]')
              // } catch (error) {
              //   this.taskForm.file = []
              //   this.tasksPrievw.file ='[]'
              //   this.tasksPrievw.file_list=[]
              // }

            }
            break;
          case "Procedure":
            this.componentType = "Procedure";
            this.operationPrievw = item
            this.backState.operation = false
            this.operationForm = JSON.parse(JSON.stringify(item));
            this.queryDemoState( this.operationForm )
            break;
        }
      }
    },
    // 新增计划
    addPalnt() {
      this.clickAddType = 'Plan'
      this.componentType = "PlantForm";
      this.planForm = {
        // data_id: "", // 主键
        plan_name: "", // 计划名称
        plan_number: "", //计划编号
        plan_type: "", // 计划类型
        applicant: this.currentUserIS.id, // 申报人
        applicant_unit: this.currentUserIS.officeId, // 申报单位
        subunit: "", // 子单元
        applicant_date: new Date(), // 申报日期
        quality_record_number: "NL/QR-PD-06", // 质量记录号
        mode_type: "Plan", // 类型
        estimate_amount_project_cost: null // 金额
      }
    },
    // 是否加签
    signatureChange(val){
      if (val === "0") {
        this.planForm.person_of_signature = []
      }
    },
    // 预览
    previewExcel() {
      this.excelVisible = true;
    },
    // 保存提交
    async saveSub(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          let isDate = moment(this.planForm.applicant_date).format("yyyy-MM-DD");
          let year = isDate.split('-')[0];
          let liushuihao = 0;
          if (this.plantList.length == 0) {
            this.plantList.push({ plan_number: "" });
          }
          let { onChange } = this.customConfig;
          if (this.planForm.plan_type == "大修单项") {
            queryPlanNumber(year).then(res => {
              liushuihao = Number(res.data) + 1;
              let codeNum = get_NumberingRules(year, this.planForm.applicant_unit, this.planForm.plan_type, this.planForm?.tasks?.length || 0, liushuihao);
              let money = Number(this.planForm.estimate_amount_project_cost).toFixed(1);
              this.planForm.plan_number = codeNum;
              this.planForm.estimate_amount_project_cost = money;
              Object.keys(this.planForm).forEach(x => {
                this.plantList[0][x] = this.planForm[x];
              })
              onChange(JSON.stringify(this.plantList));
              this.forKey(this.plantList);
              this.remoteValue = {};
              console.log('this.plantList[0]', this.plantList[0]);
            });
          } else {
            let codeNum = get_NumberingRules(year, this.planForm.applicant_unit, this.planForm.plan_type, this.planForm?.tasks?.length || 0, liushuihao);
            let money = Number(this.planForm.estimate_amount_project_cost).toFixed(1);
            this.planForm.plan_number = codeNum;
            this.planForm.estimate_amount_project_cost = money;
            Object.keys(this.planForm).forEach(x => {
              this.plantList[0][x] = this.planForm[x];
            })
            onChange(JSON.stringify(this.plantList));
            this.forKey(this.plantList);
            this.remoteValue = {};
          }
          // this.$message({
          //       message: '保存成功',
          //       type: 'success'
          //     });
        } else {
          console.log('error submit!!');
          return false;
        }
      });
    },
    // 远程搜索
    remoteMethod(query) {
      if (query !== '') {
        this.loading = true;
        let params = {
          mode_type: this.clickAddType,
          name: query
        }
        queryAllMuBan(params).then(res => {
          this.loading = false;
          let { data } = res;
          this.remoteFilter = data;
          console.log('全局搜索res', this.remoteFilter);
        }).catch(err => {
          this.loading = false;
          this.remoteFilter = [];
          console.log('全局搜索err', err);
        })
      } else {
        this.remoteFilter = [];
      }
    },
    // 模板切换
    selectMuBan(item) {
      this.remoteValue = item;
      switch (this.clickAddType) {
        case "Plan":
          this.planForm = {
            data_id: "",
            plan_name: item.plan_name, // 计划名称
            plan_number: "",
            plan_type: item.plan_type, // 计划类型
            applicant: this.pageMode == "add" ? this.currentUserIS.id : this.editUser.applicant,
            applicant_unit: this.pageMode == "add" ? this.currentUserIS.officeId : this.editUser.applicant_unit, // 申报单位
            subunit: this.pageMode == "add" ? "" : this.editUser.subunit, // 子单元
            applicant_date: this.pageMode == "add" ? new Date() : this.editUser.applicant_date, // 申报日期
            quality_record_number: item.quality_record_number, // 质量记录号
            mode_type: "Plan", // 类型
            estimate_amount_project_cost: item.estimate_amount_project_cost, // 金额
            tasks: item.tasks,
            whether_signature: item.whether_signature || '0',
            person_of_signature: item.person_of_signature || []
          }
          console.log('this.planForm', this.planForm);
          this.forKey([this.planForm]);
          break;
        case "Task":
          for (const key in item) {
            this.clickSonAddTtem[key] = item[key]
          }
          this.componentType = "TaskForm";
          this.taskForm = JSON.parse(JSON.stringify(this.clickSonAddTtem))
          console.log('this.clickSonAddTtem', this.clickSonAddTtem, item);
          this.forKey([this.planForm]);
          break;
        case "Procedure":
          for (const key in item) {
            this.clickSonAddTtem[key] = item[key]
          }
          this.operationForm = JSON.parse(JSON.stringify(this.clickSonAddTtem))
          this.componentType = "Procedure";
          this.forKey([this.planForm]);
          break;
      }
    },
    //解析数组
    queryDemoState(arr){
      if(arr?.materials?.length>0){
        arr?.materials.forEach(x=>{
          if( x.demand_state && typeof  x.demand_state!='object' ){
            x.demand_state=JSON.parse(x.demand_state)
          }
         
        })
      }
        console.log(arr,'====');
    },
    // 任务,工序新增与删除
    handleCommand({ mod, item, index }) {
      console.log(mod, item, index);
      if(mod===null) return
      let { mode_type } = item;
      this.clickAddType = mode_type;
      if (mod == 'add') {
        this.clickAddTtem = item;
        this.dialogVisible = true;
        switch (mode_type) {
          case 'Plan':
            this.title = '新建工程任务'
            break;
          case 'Task':
            this.title = '新建工序'
            break;
        }
      } else {
        let keyVal = ''
        if (mode_type == "Plan") {
          keyVal = 'tasks'
        } else {
          keyVal = 'procedures'
        }
        this.$nextTick(() => {
          item[keyVal].splice(index, 1);
          this.forKey(this.plantList);
          this.changeForm(item)
        })
      }
    },
    // 名称
    async closeDialog(formName) {
      await this.$refs[formName].validate((valid) => {
        if (valid) {
          let { addName } = this.nameForm;
          let size = 0;
          let type
          switch (this.clickAddType) {
            case "Plan":
              if (this.clickAddTtem.tasks) {
                this.clickAddTtem.tasks.push({ project_name: addName, mode_type: 'Task' })
                this.forKey(this.plantList);
              } else {
                let tasks = [{ project_name: addName, mode_type: 'Task' }];
                this.clickAddTtem.tasks = tasks;
                this.forKey(this.plantList);
              }
              this.tasksPrievw = { project_name: addName, mode_type: 'Task' }
              this.tasksFrom = { project_name: addName, mode_type: 'Task' }
              this.componentType = "TaskFrom";
              type = 'TaskForm'
              size = this.clickAddTtem.tasks.length;
              this.clickSonAddTtem = this.clickAddTtem.tasks[size - 1];
              break;
            case "Task":
              if (this.clickAddTtem.procedures) {
                console.log('this.clickAddTtem.procedures', this.clickAddTtem.procedures);
                this.clickAddTtem.procedures.push({ process_name: addName, steps: [], materials: [], mode_type: 'Procedure' })
                this.forKey(this.plantList);
              } else {
                let procedures = [{ process_name: addName, steps: [], materials: [], mode_type: 'Procedure' }];
                this.clickAddTtem.procedures = procedures;
                this.forKey(this.plantList);
              }
              size = this.clickAddTtem.procedures.length;
              this.componentType = "Procedure";
              this.clickSonAddTtem = this.clickAddTtem.procedures[size - 1]
              break;
          }
          this.dialogVisible = false;
          this.nameForm.addName = '';
          this.changeForm(this.clickSonAddTtem, type)
        } else {
          console.log('error submit!!');
          return false;
        }
      });
    },
    //选择框查询
    querySelect() {
      queryUnit().then(res => { this.stepsUnit = res.data }).catch(err => { this.stepsUnit = [] }) //工程量单位
      queryDevices().then(res => { this.devicesArr = res.data }).catch(err => { this.devicesArr = [] }) //关联设备
      queryFunArea().then(res => { this.funAreaArr = res.data }).catch(err => { this.funAreaArr = [] })//功能区域
    },
    //工序步骤新增
    detailedAddFn() {
      this.operationForm.steps.push({
        unit_engineering_quantity: '',
        quantity_engineering_quantity: 0,
        process_desc: ''
      })
    },
    //工序步骤删除
    detailedDelFn(row) {
      const i = row.$index
      this.operationForm.steps.splice(i, 1)
    },
    //物料删除
    procedureDelFn(row) {
      const i = row.$index
      this.operationForm?.materials.splice(i, 1)
    },
    //物料新增
    procedureAddFn() {
      this.materialsVisible = true
      queryMaterials(this.queryParams).then(res => {
        this.dataAll = [...res.data]
        this.currentPage=1
        this.materialsTable = this.dataAll.slice(0, this.currentPage * this.pageSize)
        this.total = this.dataAll.length
      }).catch(err => {
        this.materialsTable = []
      })
    },
    //重置按钮
    restFn(){
      this.queryParams={
        material_code:'',
        material_type:'',
        material_name:'',
      }
      this.procedureAddFn()
    },
    //物料弹框确定按钮
    addmaterials() {
      this.operationForm.materials.push(...this.selectionData)
      this.$refs.multipleTable.clearSelection()
      this.materialsVisible = false
    },
    //工序保存
    OperationSave() {
      this.$refs.operationForm.validate((valid) => {
        if (valid) {
          for (const key in this.operationForm) {
            this.operationPrievw[key] = this.operationForm[key]
          }
          let { onChange } = this.customConfig;
          onChange && onChange(JSON.stringify(this.plantList));
          this.remoteValue = {};
          this.forKey(this.plantList);
          // this.$message({
          //       message: '保存成功',
          //       type: 'success'
          //     });
        } else {
          console.log('error submit!!');
          return false;
        }
      });
    },
    //保存的change事件
    handleChange(file, fileList) {
      this.fileList = fileList.slice(-3);
    },
    //工程页的编辑
    proceduresEdit(procedures, index, tasks) {
      this.componentType = "Procedure";
      this.operationPrievw = procedures
      this.operationForm = JSON.parse(JSON.stringify(procedures))
      this.tasks = tasks
      this.backState.operation = true
      this.menuActive = procedures.seletKey;
    },
    //返回按钮
    backFn() {
      this.menuActive = this.tasks.seletKey;
      this.tasksPrievw = this.tasks
      this.backState.operation = false
      this.componentType = 'Task'
    },
    backTaskFn() {
      this.menuActive = this.tasksPrievw.seletKey;
      this.taskForm.back = false
      this.componentType = 'Task'
    },
    //工程编辑 方法
    taskEdit(task) {
      this.taskForm = JSON.parse(JSON.stringify(task))
      this.taskForm.function_area=this.taskForm.function_area?this.taskForm.function_area.split(','):''
        this.taskForm.associated_devices=this.taskForm.associated_devices?this.taskForm.associated_devices.split(','):''
        this.taskForm.status = 2
      if (this.keZhang == true) {
        this.taskForm.professional = ""
        this.taskForm.unit_of_construction = ""
      }
      try {
        this.tasksPrievw.file_list = JSON.parse(task.file || '[]')
        this.taskForm.file = JSON.parse(task.file || '[]')
        this.$set(this.taskForm,'file_list',JSON.parse(task.file || '[]'))
        // this.taskForm.file_list=JSON.parse(task.file || '[]')
      } catch (error) {
        this.taskForm.file = []
        this.taskForm.file_list=[]
        this.tasksPrievw.file ='[]'
        this.tasksPrievw.file_list=[]
      }
      this.taskForm.back = true
      this.componentType = 'TaskForm'
    },
    //工程保存
    async saveTask() {
      //  工程科科长
      let keZhang = true;
      if (this.keZhang == true) {
        this.plantList.forEach(x => {
          if (x.tasks?.length > 0) {
            x.tasks.forEach(y => {
              if (y.professional == "" || y.unit_of_construction == "") {
                this.$message({
                  message: '请检查所有工程任务表单完整性',
                  type: 'error'
                });
                keZhang = false;
                return false;
              }
            })
          }
        })
      }
      if (!keZhang) return;
      this.$refs.taskForm.validate((valid) => {
        if (valid) {
          this.taskForm.file = JSON.stringify(this.taskForm.file_list)
          for (const key in this.taskForm) {
            this.tasksPrievw[key] = this.taskForm[key]
          }
          this.tasksPrievw.status = 1
          this.tasksPrievw.function_area=this.tasksPrievw.function_area.join(',')
          this.tasksPrievw.associated_devices=this.tasksPrievw.associated_devices.join(',')
          // this.tasksPrievw.file = JSON.stringify(this.tasksPrievw.file)
          let { onChange } = this.customConfig;
          onChange && onChange(JSON.stringify(this.plantList));
          console.log('TaskForm:',this.plantList);
          this.forKey(this.plantList);
          this.remoteValue = {};
          // this.$message({
          //       message: '保存成功',
          //       type: 'success'
          //     });
        } else {
          console.log('error submit!!');
          
          return false;
        }
      });
    },
    //表格选择框事件
    handleSelectionChange(selection) {
      this.selectionData = []
      this.selectionData = selection
    },
    //改变页数大小
    handleSizeChange(val) {
      this.pagingHandler(this.currentPage, val)
      this.pageSize = val
    },
    //改变页数
    handleCurrentChange(val) {
      this.pagingHandler(val, this.pageSize)
      this.currentPage = val
    },
    //分页
    pagingHandler(pageNum, pageSize) {
      this.materialsTable = this.dataAll.slice((pageNum - 1) * pageSize, (pageNum - 1) * pageSize + pageSize)
    },
    //材料需求量、采购量主、采购量副更改是否为红色
    changeItemState(i, key) {
       if(!this.operationForm.materials[i].demand_state)this.operationForm.materials[i].demand_state={}
      this.operationForm.materials[i].demand_state[key] = false
    },
    //上传
    handleFileChange(e) {
      const files = e.target.files;
      if (files.length <= 0) {
        return false;
      }
      let formData = new FormData()
      if (files && files[0]) {
        const file = files[0];
        if (file.size > 1024 * 1024 * 3) {
          return false;
        } else {
          let temp = new FormData()
          temp.append('file', file)
          uploadFile(temp)
            .then((data) => {
              // this.taskForm.file.push({ file: data.data[0], file_name: file.name })
              this.$set(this.taskForm.file_list,this.taskForm.file_list.length, {file: data.data[0], file_name: file.name })
              // this.taskForm.file_list.push({ file: data.data[0], file_name: file.name })
              this.$message({
                message: '上传成功',
                type: 'success'
              });
            })
            .catch((err) => {
              if(err.statusText=='OK'){
                this.taskForm.file.push({ file: data.data[0], file_name: file.name })
                this.$message({
                message: '上传成功',
                type: 'success'
              });
              }else{
                this.$message({
                message: '上传失败',
                type: 'error'
              });
              }
             
            });
        }
      }
    },
    //删除文件
    deleteClik(i){
this.taskForm.file_list.splice(i, 1)
    },
    //标记不可选中方法()
    checkSelectable(row, index) {
      // debugger
      /**
       * row：当前每行的行数据
       * index：当前第几位
       */
      let flag = true
      console.log(this.operationForm);
      if( !(this.operationForm.materials) ||  this.operationForm?.materials?.length==0){
        return true
      }else{
        for (let i = 0; i < this.operationForm.materials.length; i++) {
        if (row.material_code == this.operationForm.materials[i].material_code) {
          flag = false
          break
        } else {
          flag = true
        }
      }
      return flag
      }
   
    },
    //预览弹框方法
    previewMoadlFn() {
      this.previewVisible = true
      let tempArr = ['.doc', '.docx', '.xls', '.xlsx']
      let off = false
      tempArr.forEach((x, i) => {
        if (this.tasksPrievw.file.indexOf(x) != -1) off = true
      })
      this.iframeSrc = off ? 'https://docs.google.com/viewer?url=' + window.location.origin + this.tasksPrievw.file : this.tasksPrievw.file
      // this.iframeSrc = this.tasksPrievw.file
    },
    // async inputChange(e) {
    //   this.data = e;
    //   let { formConfig, component, onChange } = this.customConfig;
    //   await window.eventCenter.triggerEventNew({
    //     objectId: formConfig?.id,
    //     componentId: component.id,
    //     type: "report",
    //     event: "change",
    //     payload: {
    //       value: e,
    //     },
    //   });
    //   onChange(e);
    // },
    //逻辑控制 计算
    async calculationClick(e, i) {

      let { formConfig, component, onChange } = this.customConfig;
      this.mateIndex = i
      await window?.eventCenter?.triggerEventNew({
        objectId: formConfig?.id,
        componentId: component.id,
        type: "report",
        event: "calculation",
        payload: {
          value: e,
        },
      });
    },
    //金额计算设值
    do_EventCenter_setValue({ value }) {

      if (this.operationForm.materials) {

        // this.operationForm.materials[value.index].material_demand = value.material_demand
        value.demand_state = {demand_state:true,purchase_main_state:true,purchase_auxiliary_state:true}
        // value.purchase_main_state = true
        // value.purchase_auxiliary_state = true
        // this.operationForm.materials[value.index].material_purchase_main = value.material_purchase_main
        // this.operationForm.materials[value.index].material_purchase_auxiliary = value.material_purchase_auxiliary
        // Object.keys(value).forEach(x => {
        //   this.operationForm.materials[value.index][x] = value[x]
        // })
        // this.operationForm.materials[value.index] = { ...this.operationForm.materials[value.index], ...value }
        let a = { ...this.operationForm.materials[this.mateIndex], ...value }
        this.$set(this.operationForm.materials, this.mateIndex, { ...a })

        console.log(this.operationForm.materials, '=========materials');
      }
    },
    Event_Center_getName() {
      let { formConfig, component } = this.customConfig;
      return `${formConfig?.form_name}-${component.columnStyle.title}`;
    },


    Event_Center_getName() {
      return this.data;
    },
  },
  destroyed() {
    window?.componentCenter?.removeInstance(this.customConfig.componentId);
  },
};
</script>

<style lang="less" scoped>
.liuChen-page {
  padding: 15px;
  display: flex;
  width: calc(100% - 30px) !important;
  height: calc(100% - 30px);
  background-color: #e7edef;

  .leftTree {
    padding: 24px 16px 0 16px;
    width: 248px;
    min-width: 248px;
    height: calc(100vh - 255px);
    background-color: #FFFFFF;
    border-radius: 8px;
    box-sizing: border-box;

    .plantAdd {
      display: flex;
      flex-direction: row;
      justify-content: space-between;
      align-items: center;
      width: 100%;
      height: 24px;

      .planTitleLeft {
        display: flex;
        align-items: center;
        font-family: 'PingFang SC';
        font-style: normal;
        font-weight: 500;
        font-size: 16px;
        line-height: 24px;
        height: 24px;
        color: #373A55;

        .planImg {
          margin-right: 5px;
          width: 20px;
          height: 20px;
        }

        .planTitle {
          width: 64px;
        }
      }

      .addIcon {
        cursor: pointer;
        color: #50536a;
        font-size: 20px;
        width: 23px;
        height: 23px;
        border: 1px solid #dfe1e8;
        line-height: 19px;
        text-align: center;
        border-radius: 50%;
      }
    }

    .menu_list {
      width: 100%;
      height: calc(100% - 40px);
      user-select: none;
      margin-top: 10px;
      overflow-y: scroll;
      overflow-x: hidden;

      .menu_item {
        width: 100%;
        box-sizing: border-box;

        .menu_item_box {
          height: 36px;
          line-height: 36px;
          display: flex;
          align-items: center;
          justify-content: flex-start;
          box-sizing: border-box;

          .dropdownBox {
            margin-left: auto;
            margin-right: 10px;
          }

          .menuPlanTitle,
          .taskTitle {
            display: inline-block;
            width: 70%;
            font-weight: 500;
            font-size: 14px;
            color: #373A55;
            //超出一行省略号
            overflow: hidden;
            white-space: nowrap;
            text-overflow: ellipsis;
          }

          .stepTitle {
            display: inline-block;
            width: 70%;
            font-weight: 400;
            font-size: 14px;
            color: #626973;
            //超出一行省略号
            overflow: hidden;
            white-space: nowrap;
            text-overflow: ellipsis;
          }

          .menuIcon {
            margin-right: 5px;
            width: 13px;
            height: 13px;
            z-index: 4;
          }

          .dotIcon {
            display: inline-block;
            margin-right: 10px;
            width: 6px;
            height: 6px;
            border-radius: 50%;
            background-color: #959CA6;
          }
        }

        .menu_item_box_active {
          background: #1A79FF;
          border-radius: 4px;

          .dotIcon {
            background-color: #FFFFFF;
          }

          .menuPlanTitle,
          .taskTitle {
            color: #FFFFFF;
          }

          .stepTitle {
            color: #FFFFFF;
          }
        }
      }

      .planIdent {
        padding-left: 10px;
      }

      .taskIdent {
        padding-left: 20px;
      }

      .stepIdent {
        padding-left: 30px;
      }
    }

    .menu_list::-webkit-scrollbar {
      /*滚动条整体样式*/
      width: 6px;
      /*高宽分别对应横竖滚动条的尺寸*/
      height: 1px;
    }

    .menu_list::-webkit-scrollbar-thumb {
      /*滚动条里面小方块*/
      border-radius: 6px;
      background: #e7edef;
    }

    .menu_list::-webkit-scrollbar-track {
      /*滚动条里面轨道*/
      border-radius: 6px;
      background: #FFFFFF;
    }

    .emptyBox {
      margin-top: 110px;
      width: 100%;
      display: flex;
      flex-direction: column;
      align-items: center;
      font-family: PingFang SC;
      font-size: 14px;
      font-weight: 400;
      line-height: 24px;
      letter-spacing: 0em;
      text-align: center;
      color: #959CA6;

      .emptyIcon {
        margin-bottom: 10px;
        height: 28px;
        width: 26px;
      }
    }
  }

  // 右侧
  .rightConcent {
    margin-left: 15px;
    display: flex;
    flex: 1;
    height: 100%;
    background: #FFFFFF;
    border-radius: 8px;

    // 空白页
    .rightEmptyBox {
      margin-top: 50%;
      transform: translateY(-50%);
      width: 100%;
      height: 100%;
      display: flex;
      flex-direction: column;
      align-items: center;
      text-align: center;
      color: #626973;

      .rightEmptyIcon {
        height: 50px;
        width: 50px;
      }

      .rightEmptyText {
        margin: 28px 0 10px 0;
        font-family: PingFang SC;
        font-size: 16px;
        font-weight: 400;
        line-height: 24px;
      }
    }

    // 计划新增
    .addplantBox {
      padding: 24px;
      width: 100%;
      display: flex;
      flex-direction: column;

      .PlantForm_title {
        display: flex;
        justify-content: space-between;
        align-items: center;

        .preview-save {
          display: flex;
          height: 32px;

          .preview-icon {
            margin-bottom: -1px;
            margin-right: 2px;
            width: 13px;
            height: 13px;
          }
        }

        .drawerTitle {
          font-weight: 500;
          font-size: 16px;
          color: #373A55;
        }

        .saveIcon {
          margin-bottom: -1px;
          margin-right: 2px;
          width: 13px;
          height: 13px;
        }
      }

      .PlantForm_content {
        margin-top: 24px;

        .el-select {
          width: 100% !important;
        }

        .el-date-editor--date {
          width: 100% !important;
        }
      }
    }

    //工程任务新增
    .Task-page-add {
      width: calc(100% - 48px);
      height: calc(100% - 48px);
      background-color: #fff;
      border-radius: 8px;
      padding: 24px;

      .Task_add_upload {
        width: 184px;
        height: 34px;
        color: #626973;
        /* 白色/100% */

        background: #FFFFFF;
        /* 描边/三级描边（输入框） */


        border: 1px dashed #DADDE6;
        border-radius: 4px;
        cursor: pointer;

        &:hover {
          border: 1px dashed #1A79FF;
          color: #1A79FF;
        }
      }

      .operation_headr {
        display: flex;
        justify-content: space-between;
        margin-bottom: 24px;

        /deep/ .el-icon-back {
          font-size: 20px;
          cursor: pointer;
        }

        .operation_headr_back {
          display: flex;
          align-items: center;

          .back_title {
            width: 95px;
          }
        }

        .operation_headr_itme {

          /deep/.el-button.is-round {
            display: flex;
            align-items: center;
            height: 32px;
          }

          /deep/ .el-button--primary {
            span {
              display: flex;
              align-items: center;

            }
          }
        }
      }

      .operation_main {
        /deep/ .listBan {
          background: #f7f7f7;
        }

        /deep/ .child_end_fill {
          text-align: center;
          // line-height: 65px;
          background: #fafafa;
          padding: 16px;

          .eidt_end_span {
            border: 1px #dedfe0 dashed;
            height: 32px;
            line-height: 32px;
          }

          .end_span {
            cursor: pointer;
            border: 1px #dedfe0 dashed;
            height: 32px;
            line-height: 32px;

            &:hover {
              color: #81befe;
              border-color: #81befe
            }
          }
        }
      }

      .el-select {
        width: 100% !important;
      }

      .upload-demo {
        width: 100% !important;

        /deep/.el-upload {
          width: 100% !important;
          text-align: justify;
        }
      }

      .el-date-editor--date {
        width: 100% !important;
      }
    }

    //工程任务详情
    .Task-page {
      width: calc(100% - 48px);
      height: calc(100% - 48px);
      background-color: #fff;
      border-radius: 8px;
      padding: 24px;

      .descriptions_task {
        .title_class {
          display: flex;
          margin-bottom: 18px;
          justify-content: space-between;

          .title_class_start {
            // display: flex;
            font-family: 'PingFang SC';
            font-style: normal;
            font-weight: 600;
            font-size: 16px;
            line-height: 24px;

            .imgTile {
              vertical-align: middle;
              display: inline-block;
            }

            .spanTile {
              vertical-align: middle;
              display: inline;
            }
          }

          .title_class_end {
            /deep/ .el-icon-edit {
              font-size: 16px;
            }
          }
        }

        .title_gongn {
          background: rgba(255, 178, 57, 0.15);
          border-radius: 43px;
          padding: 2px 8px;
          color: #FF8130;
        }

        .title_guanl {
          background: rgba(48, 174, 191, 0.15);
          border-radius: 43px;
          padding: 2px 8px;
          color: #30AEBF;
        }

        /deep/ .title_label {
          height: 22px;
          /* 14px-常规 */
          font-family: 'PingFang SC';
          font-size: 14px;
          line-height: 22px;
          /* identical to box height, or 157% */
          display: flex;
          align-items: center;
          /* 文本色/三级文本 */
          color: #959CA6;
        }

        /deep/ .title-content {
          height: 22px;
          /* 14px-常规 */
          font-family: 'PingFang SC';
          font-size: 14px;
          line-height: 22px;
          /* identical to box height, or 157% */
          display: flex;
          align-items: center;
          /* 文字色/一级文本 */
          color: #373A55;
          mix-blend-mode: normal;
        }
      }

      .task_operaList {
        margin-top: 26px;

        .task_opear_title_add {
          display: flex;
          justify-content: space-between;

          .task_opear_title {
            height: 24px;
            /* 16px-粗 */
            font-family: 'PingFang SC';
            font-style: normal;
            font-weight: 700;
            font-size: 16px;
            line-height: 24px;
            color: #203040;
            display: flex;

            img {
              margin-right: 8px;
            }
          }

          .addIcon {
            cursor: pointer;
            color: #50536a;
            font-size: 20px;
            width: 36px;
            height: 36px;
            border: 1px solid #dfe1e8;
            line-height: 32px;
            text-align: center;
            border-radius: 50%;
          }
        }

        .task_opear_main {
          margin-top: 24px;

          .task_operaList_item {
            display: flex;
            flex-direction: row;
            justify-content: space-between;
            align-items: center;
            padding: 16px 40px;
            gap: 107px;
            width: calc(100% - 80px);
            height: 54px;
            background: #F7F8F9;
            border-radius: 8px;
            margin-bottom: 8px;

            .text_class {
              font-family: 'PingFang SC';
              font-style: normal;
              font-weight: 600;
              font-size: 14px;
              line-height: 22px;
              width: 20%;
              /* identical to box */
            }

            .title_label {
              height: 22px;
              /* 14px-常规 */
              font-family: 'PingFang SC';
              font-size: 14px;
              line-height: 22px;
              /* identical to box height, or 157% */
              // display: flex;
              // align-items: center;
              /* 文本色/三级文本 */
              color: #959CA6;
            }

            .task_opera_cz {
              cursor: pointer;
              font-family: 'PingFang SC';
              font-style: normal;
              font-weight: 400;
              font-size: 14px;
              line-height: 22px;
              color: #1A79FF;
            }
          }
        }

      }
    }

    //工序新增
    .Operation-page {
      // width: 100%;
      width: calc(100% - 48px);
      height: calc(100% - 48px);
      background-color: #fff;
      border-radius: 8px;
      padding: 24px;

      .operation_headr {
        display: flex;
        justify-content: space-between;
        margin-bottom: 24px;

        /deep/ .el-icon-back {
          font-size: 20px;
          cursor: pointer;
        }

        .operation_headr_back {
          display: flex;
          align-items: center;

          .back_title {
            width: 70px;
          }
        }

        .operation_headr_itme {
          /deep/.el-button.is-round {
            display: flex;
            align-items: center;
            height: 32px;
          }

          /deep/ .el-button--primary {
            span {
              display: flex;
              align-items: center;

            }
          }
        }
      }

      .operation_main {
        /deep/ .listBan {
          background: #f7f7f7;
        }

        .procedures_name_table_detailed {
          .el-form-item {
            margin-bottom: 0px;
          }

          .el-select {
            width: 100%;
          }

          /deep/.ITEMRED {
            .el-input__inner {
              color: red;
            }
          }
        }

        /deep/ .el-input-number {
          width: 100%;
        }

        /deep/.el-input--small {}

        /deep/ .child_end_fill {
          text-align: center;
          // line-height: 65px;
          background: #fafafa;
          padding: 16px;

          .eidt_end_span {
            border: 1px #dedfe0 dashed;
            height: 32px;
            line-height: 32px;
          }

          .end_span {
            cursor: pointer;
            border: 1px #dedfe0 dashed;
            height: 32px;
            line-height: 32px;

            &:hover {
              color: #81befe;
              border-color: #81befe
            }
          }
        }
      }

    }
  }
}
.select_filed{
  margin-bottom: 10px;
}
/deep/.select_filed_col{
  display: flex;
align-items: center;
  .el-input{
    width: 80%;
  }
  .el-input__inner{
    width: 80%;
  }
  .queyr_button{
    width: 49%;
    height: 38px;
    color:#FFF;
    cursor: pointer;
    background: #0454f2;
  border:1px solid;
  border-radius:4px ;
  border-color: #0454f2;
  }
  .rest_btn{
    margin-left: 8px;
  }
}

/deep/ .el-button--primary {
  background: #0454f2;
  border-color: #0454f2;
  display: flex;
  justify-content: center;

  &:hover {
    background: #0454f2;
    border-color: #0454f2;
  }
}

/deep/ .dialog-footer {
  /deep/ .el-button--primary {
    background: #0454f2;
    border-color: #0454f2;

    &:hover {
      background: #0454f2;
      border-color: #0454f2;
    }
  }
}

.title_content_a_file {
  cursor: pointer;
  text-decoration-line: underline;


  color: #1A79FF;

}

@font-face {
  font-family: 'iconfont';
  src: url('../utils/fonts/iconfont.ttf?t=1671106323572') format('truetype');
}

.iconfont {
  font-family: "iconfont" !important;
  font-size: 16px;
  font-style: normal;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}
</style>