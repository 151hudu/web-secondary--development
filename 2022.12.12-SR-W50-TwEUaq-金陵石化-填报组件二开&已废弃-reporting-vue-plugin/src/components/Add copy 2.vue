<template>
  <div class="liuChen-page">
    <div class="leftTree">
      <div class="plantAdd">
        <div class="planTitleLeft">
          <img class="planImg" src="../../pluginTemp/images/Category.png" alt="">
          <span class="planTitle">计划列表</span>
        </div>
        <div v-if="plantList.length == 0" class="addIcon" @click="addPalnt">＋</div>
      </div>
      <!-- 菜单 -->
      <div v-if="plantList.length > 0" class="menu_list">
        <!-- 计划 -->
        <div class="menu_item" v-for="planTtem, planIndx in plantList" :key="planTtem.seletKey">
          <div class="menu_item_box planIdent" :class="{ 'menu_item_box_active': menuActive == planTtem.seletKey }"
            @click="changeForm(planTtem)">
            <img class="menuIcon" src="../../pluginTemp/images/menuIcon.png" alt="">
            <span class="menuPlanTitle">{{ planTtem.plan_name }}</span>
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
          <div class="menu_item" v-for="taskItem, taskIndx in planTtem.tasks" :key="taskItem.seletKey">
            <div class="menu_item_box taskIdent" :class="{ 'menu_item_box_active': menuActive == taskItem.seletKey }"
              @click="changeForm(taskItem)">
              <img class="menuIcon" src="../../pluginTemp/images/menuIcon.png" alt="">
              <span class="taskTitle">{{ taskItem.project_name }}</span>
              <el-dropdown class="dropdownBox" trigger="click" placement="bottom-start" @command="handleCommand">
                <span class="el-dropdown-link">
                  <i class="el-icon-more"
                    :style="{ 'color': menuActive == taskItem.seletKey ? '#FFFFFF' : '#373A55' }"></i>
                </span>
                <el-dropdown-menu slot="dropdown">
                  <el-dropdown-item :command="{ mod: 'add', item: taskItem, index: taskIndx }">新增</el-dropdown-item>
                  <el-dropdown-item :command="{ mod: 'del', item: planTtem, index: taskIndx }">删除</el-dropdown-item>
                </el-dropdown-menu>
              </el-dropdown>
            </div>
            <!-- 工序 -->
            <div class="menu_item" v-for="procedure, procedIdx in taskItem.procedures" :key="procedure.seletKey">
              <div class="menu_item_box stepIdent" :class="{ 'menu_item_box_active': menuActive == procedure.seletKey }"
                @click="changeForm(procedure)">
                <div class="dotIcon"></div>
                <span class="stepTitle">{{ procedure.process_name }}</span>
                <el-dropdown class="dropdownBox" trigger="click" placement="bottom-start" @command="handleCommand">
                  <span class="el-dropdown-link">
                    <i class="el-icon-more"
                      :style="{ 'color': menuActive == procedure.seletKey ? '#FFFFFF' : '#373A55' }"></i>
                  </span>
                  <el-dropdown-menu slot="dropdown">
                    <el-dropdown-item :command="{ mod: 'del', item: taskItem, index: procedIdx }">删除</el-dropdown-item>
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
    </div>
    <!-- 右侧 -->
    <div class="rightConcent">
      <!-- <component v-if="plantList.length > 0" :is="componentType" :dataSource="{}" :componentType="changeComponentType"/> -->
      <!-- 空白页 -->
      <div v-if="componentType == 'emptyPage'" class="rightEmptyBox">
        <img class="rightEmptyIcon" src="../../pluginTemp/images/plantTask.png" alt="">
        <span class="rightEmptyText">请创建工程计划</span>
        <el-button style="width: 124px; font-size: 16px;" size="small" type="primary" @click="addPalnt()" round
          plain>＋新增计划</el-button>
      </div>
      <!-- 计划新增 -->
      <div v-if="componentType == 'PlantForm'" class="addplantBox">
        <div class="PlantForm_title">
          <div>
            <span class="drawerTitle">计划信息</span>
            <el-select style="margin-left: 20px" size="small" v-model="remoteValue" filterable remote reserve-keyword
              placeholder="请输入关键词" :remote-method="remoteMethod" :loading="loading" @change="selectMuBan">
              <el-option v-for="item in remoteFilter" :key="item.data_id" :label="item.plan_number"
                :value="item"></el-option>
            </el-select>
          </div>
          <el-button style="width: 96px; font-size: 14px;" size="small" type="primary" @click="saveSub('planForm')"
            round>
            <img class="saveIcon" src="../../pluginTemp/images/saveIcon.png" alt="">
            保存
          </el-button>
        </div>
        <div class="PlantForm_content">
          <el-form :model="planForm" v-if="componentType == 'PlantForm'" :rules="rules" ref="planForm" size="small">
            <el-form-item label="计划名称：" key="addName" :label-width="formLabelWidth" prop="addName">
              <el-input v-model="planForm.plan_name" :clearable="true" placeholder="请输入名称"></el-input>
            </el-form-item>
            <el-form-item label="申报人：" key="applicant" :label-width="formLabelWidth" prop="applicant">
              <el-input v-model="planForm.applicant" :readonly="true" :clearable="true" placeholder="请输入"></el-input>
            </el-form-item>
            <el-form-item label="申报单位：" key="applicant_unit" :label-width="formLabelWidth" prop="applicant_unit">
              <el-select v-model="planForm.applicant_unit" placeholder="请选择" :readonly="true">
                <el-option label="区域一" value="shanghai"></el-option>
                <el-option label="区域二" value="beijing"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="申报子单位：" key="subunit" :label-width="formLabelWidth" prop="subunit">
              <el-select v-model="planForm.subunit" placeholder="请选择">
                <el-option label="区域一" value="shanghai"></el-option>
                <el-option label="区域二" value="beijing"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="申报时间：" key="applicant_date" :label-width="formLabelWidth" prop="applicant_date">
              <el-date-picker v-model="planForm.applicant_date" format="yyyy-MM-DD" type="date" placeholder="请选择日期">
              </el-date-picker>
            </el-form-item>
            <el-form-item label="计划类型：" key="plan_type" :label-width="formLabelWidth" prop="plan_type">
              <el-select v-model="planForm.plan_type" placeholder="请选择">
                <el-option v-for="item in planTypeList" :key="item" :label="item" :value="item"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="质量记录号：" key="quality_record_number" :label-width="formLabelWidth"
              prop="quality_record_number">
              <el-input v-model="planForm.quality_record_number" autocomplete="off" placeholder="请输入"
                :clearable="true"></el-input>
            </el-form-item>
            <!-- <el-form-item label="预估工程费：" :label-width="formLabelWidth" prop="quality_record_number"> 
              <el-input v-model="planForm.quality_record_number" autocomplete="off" placeholder="请输入" :clearable="true"></el-input>
            </el-form-item> -->
          </el-form>
        </div>
      </div>
      <!-- 工序任务新增 -->
      <div class="Task-page-add" v-if="componentType == 'TaskForm'">
        <div class="operation_headr">
          <div class="operation_headr_back"><i v-if="taskForm.back" class="el-icon-back" @click="backTaskFn()"></i>
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
          <el-form v-if="componentType == 'TaskForm'" :model="taskForm" @submit.native.prevent ref="taskForm"
            size="small">
            <el-form-item label="工程名称：" key="project_name" :label-width="formLabelWidth" :clearable="true"
              :readonly="true" prop="project_name" :rules="{ required: true, message: '请输入工程名', trigger: 'blur' }">
              <el-input v-model="taskForm.project_name" autocomplete="off" placeholder="请输入"></el-input>
            </el-form-item>
            <el-form-item label="类型：" key="project_type" :label-width="formLabelWidth" prop="project_type"
              :rules="{ required: true, message: '请选择类型', trigger: 'change' }">
              <el-select v-model="taskForm.project_type" placeholder="请选择">
                <el-option label="A" value="A"></el-option>
                <el-option label="B" value="B"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="功能区域：" key="function_area" :label-width="formLabelWidth" prop="function_area"
              :rules="{ required: true, message: '请选择功能区域范围', trigger: 'change' }">
              <el-select v-model="taskForm.function_area" placeholder="请选择">
                <el-option v-for="(item, i) in funAreaArr  " :key="i" :label="item.function_area"
                  :value="item.function_area"></el-option>

              </el-select>
            </el-form-item>
            <el-form-item label="关联设备：" key="associated_devices" :label-width="formLabelWidth" prop="associated_devices"
              :rules="{ required: true, message: '请选择设备', trigger: 'change' }">
              <el-select v-model="taskForm.associated_devices" placeholder="请选择">
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
              <a :href="tasksPrievw.file" rel="noopener noreferrer">{{ tasksPrievw.file }}</a></el-descriptions-item>


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
              <div class="task_opera_step text_class"><span class="title_label">工序步骤：</span>{{ item.steps.length }}
              </div>
              <div class="task_opera_procedure text_class"><span class="title_label">物料清单：</span>{{
                  item.materials.length
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
          <div class="operation_headr_itme">
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
                  <el-table-column prop="vnotchesWidth" label="工程量单位">
                    <template slot-scope="scope">
                      <el-form-item :clearable="true"
                        :prop="scope.row.quantity_engineering_quantity ? `steps.${scope.$index}.unit_engineering_quantity` : undefined"
                        :rules="{ required: Boolean(scope.row.quantity_engineering_quantity), message: '请选择工程量', trigger: 'change' }">
                        <el-select v-model="scope.row.unit_engineering_quantity" placeholder="请选择">
                          <el-option v-for="(item, i) in stepsUnit  " :key="i" :label="item.unit_engineering_quantity"
                            :value="item.data_id"></el-option>

                        </el-select>
                      </el-form-item>

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
                      <el-button type="text" @click="detailedDelFn(scope)" size="small">删除</el-button>
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

                  <el-table-column prop="sampleThickness" label="主单位">
                    <template slot-scope="scope">
                      <el-input v-model="scope.row.main_unit" :controls="false" type="text" :disabled="true"
                        size="small" />
                    </template>
                  </el-table-column>

                  <el-table-column prop="sampleThickness" label="副单位">
                    <template slot-scope="scope">
                      <el-input v-model="scope.row.auxiliary_unit" :controls="false" type="text" :disabled="true"
                        size="small" />
                    </template>
                  </el-table-column>
                  <el-table-column prop="sampleThickness" label="材料需求量">
                    <template slot-scope="scope">
                      <el-form-item :clearable="true" :prop="`materials.${scope.$index}.material_demand`"
                        :rules="{ required: true, message: '请输入材料需求量', trigger: 'blur' }">
                        <el-input :class="{ ITEMRED: scope.row.demand_state }" v-model="scope.row.material_demand"
                          :controls="false" @change="changeItemState(scope.$index, 'demand_state')" type="text"
                          size="small" />
                      </el-form-item>

                    </template>
                  </el-table-column>
                  <el-table-column prop="sampleThickness" label="材料采购量（主单位）">
                    <template slot-scope="scope">
                      <el-form-item :clearable="true" :prop="`materials.${scope.$index}.material_purchase_main`"
                        :rules="{ required: true, message: '请输入材料采购量（主单位）', trigger: 'blur' }">
                        <el-input :class="{ ITEMRED: scope.row.purchase_main_state }"
                          v-model="scope.row.material_purchase_main"
                          @change="changeItemState(scope.$index, 'purchase_main_state')"></el-input>

                      </el-form-item>

                    </template>
                  </el-table-column>
                  <el-table-column prop="sampleThickness" label="材料采购量（副单位）">
                    <template slot-scope="scope">
                      <el-form-item :clearable="true" :prop="`materials.${scope.$index}.material_purchase_auxiliary`"
                        :rules="{ required: true, message: '请输入材料采购量（副单位）', trigger: 'blur' }">
                        <el-input :class="{ ITEMRED: scope.row.purchase_auxiliary_state }"
                          @change="changeItemState(scope.$index, 'purchase_auxiliary_state')"
                          v-model="scope.row.material_purchase_auxiliary" :controls="false" type="text" size="small" />
                      </el-form-item>
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
                      <el-button type="text" @click="calculationClick(scope)" size="small">计算</el-button>
                      <el-button type="text" @click="procedureDelFn(scope.row)" size="small">删除</el-button>
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
    <!-- 弹窗 -->
    <el-dialog title="请输入名称" :visible.sync="dialogVisible" width="30%">
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
    <el-dialog title="物料清单表" :visible.sync="materialsVisible" width="80%">
      <el-table :data="materialsTable" row-key="data_id" ref="multipleTable" stripe style="width: 100%"
        tooltip-effect="dark" @selection-change="handleSelectionChange"
        :header-cell-style="{ padding: 0 + 'px', fontSize: '12px', fontWeight: 400 }"
        :header-row-style="{ height: '30px' }">
        <el-table-column type="selection" :reserve-selection="true" width="55" fixed="left">
        </el-table-column>
        <el-table-column type="index" label="序列" width="55" fixed="left">
        </el-table-column>
        <el-table-column prop="material_code" label="物料编号">
        </el-table-column>
        <el-table-column prop="material_name" label="物料名称">
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
        <el-button @click="materialsVisible = false">取 消</el-button>
        <el-button type="primary" @click="addmaterials()">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import Vue from "vue";
import eventActionDefine from "./msgCompConfig";
import { Menu, MenuItem, Submenu, Drawer, Form, FormItem, Button, Pagination, DatePicker, Dropdown, DropdownMenu, DropdownItem, Dialog, Descriptions, DescriptionsItem, Table, TableColumn, Input, InputNumber, Select, Upload } from "element-ui";
import { queryUnit, queryDevices, queryFunArea, queryMaterials, queryAllMuBan, uploadFile, puginImport } from '../api/asset'
Vue.use(Menu);
Vue.use(MenuItem);
Vue.use(Submenu);
Vue.use(Drawer);
Vue.use(Form);
Vue.use(FormItem);
Vue.use(Button);
Vue.use(DatePicker);
Vue.use(Dropdown);
Vue.use(DropdownMenu);
Vue.use(DropdownItem);
Vue.use(Dialog);
Vue.use(Menu);
Vue.use(MenuItem);
Vue.use(Submenu);
Vue.use(Drawer);
Vue.use(Form);
Vue.use(FormItem);
Vue.use(Button);
Vue.use(DatePicker);
Vue.use(DatePicker);
Vue.use(Descriptions);
Vue.use(DescriptionsItem);
Vue.use(Table);
Vue.use(TableColumn);
Vue.use(Input);
Vue.use(InputNumber);
Vue.use(Select);
Vue.use(Upload);
Vue.use(Pagination)
export default {
  name: "Add",
  props: {
    customConfig: Object,
  },
  // computed: {
  //   componentType: function () {
  //     return "PlantForm";
  //   },
  // },
  data() {
    let currentUser = window?.currentUser || {};
    return {
      currentUser, // 当前用户
      data: this.customConfig.data,
      propsConfiguration: this.customConfig.configuration || "{}",
      configuration: {},
      componentType: "Procedure", // 组件类型 emptyPage-空白页 PlantForm-计划新增
      plantList: [], // 大JSON
      menuActive: '',
      formLabelWidth: "80", // 表单label宽
      detailedTable: [],  // 工序步骤数据
      procedureTable: [], //物料数据
      devicesArr: [],//关联设备
      funAreaArr: [],//功能区域
      stepsUnit: [],//工程量单位
      fileList: [],//上传文件保存
      tasksPrievw: {},//工程任务详情
      operationPrievw: {},//工序详情
      dialogVisible: false,
      materialsVisible: false,
      backState: { operation: "" },//返回状态
      nameForm: {
        addName: ""
      },
      materialsTable: [],//物料清单表
      selectionData: [],//选中数据
      loading: false, // 远程搜索
      remoteFilter: [], // 模板数据
      remoteValue: {}, // 选中模板
      clickAddTtem: {}, // 新增项父级数据
      clickAddType: "", // 新增项父级类型
      currentPage: 1,//当前页数
      pageSize: 10,//页数大小
      total: 0,
      dataAll: [],//存放所有数据
      // 计划表单
      planForm: {
        data_id: "", // 主键
        plan_name: "", // 计划名称
        plan_number: "", // 计划编号
        plan_type: "", // 计划类型
        applicant: "", // 申报人
        applicant_unit: "", // 申报单位
        subunit: "", // 子单元
        applicant_date: new Date(), // 申报日期
        quality_record_number: "NL/QR-PD-06", // 质量记录号
        mode_type: "Plan", // 类型
      },
      //工程任务表单
      taskForm: {
        project_name: '',//工程任务名
        project_type: '', //工程任务类型
        function_area: '',//功能区域 
        associated_devices: '',//关系设备
        requirement_for_construction: '',//规范
        remark: '',//备注
        file: [{
          name: 'food.jpeg',
          url: 'https://fuss10.elemecdn.com/3/63/4e7f3a15429bfda99bce42a18cdd1jpeg.jpeg?imageMogr2/thumbnail/360x360/format/webp/quality/100'
        }]//附件
      },
      //工序表单
      operationForm: {
        name: ''
      },
      planTypeList: ['临时', '月度', '大修单项', '维保'],  // 计划类型
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
          { type: 'date', required: true, message: '请选择日期', trigger: 'change' }
        ],
        quality_record_number: [
          { required: true, message: '请输入质量记录号', trigger: 'blur' }
        ],
        plan_type: [
          { required: true, message: '请选择计划类型', trigger: 'change' }
        ],
        addName: [
          { required: true, message: '请输入名称', trigger: 'blur' }
        ],

        work_unit: [
          { required: true, message: '请输入工程量单位', trigger: 'blur' }
        ],
        work_name: [
          { required: true, message: '请输入工序描述', trigger: 'blur' }
        ],
        process_name: [
          { required: true, message: '请输入工序名称', trigger: 'blur' }
        ]
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
      }
    };
  },
  mounted() {
    let josnData = `  [{
    "data_id": "",
    "plan_name": "计划1",
    "plan_number": "2022-301W01",
    "plan_type": "月度",
    "applicant": "1234567890",
    "applicant_unit": "123456789",
    "subunit": "",
    "applicant_date": "2022-12-23",
    "quality_record_number": "AWF323434",
    "mode_type": "Plan",
    "tasks": [{ 
      "data_id": "",
      "project_name": "任务1",
      "project_type": "A",
      "parent_id": "",
      "function_area": "区域1",
      "associated_devices": "设备1",
      "requirement_for_construction": "标准1",
      "remark": "备注",
      "file": "/stopere/werere/sd.pdf",
      "mode_type": "Task",
      "procedures": [{ 
        "data_id": "",
        "process_name": "工序1",
        "remark": "",
        "parent_id": "",
        "mode_type": "Procedure",
        "steps": [{ 
          "data_id": "",
          "process_desc": "步骤1",
          "parent_id": "",
          "unit_engineering_quantity": "",
          "quantity_engineering_quantity": "3",
          "mode_type": "Step"
        }],
        "materials": [{ 
          "data_id": "",
          "parent_id": "",
          "material_name": "物料A",
          "material_code": "ASF334",
          "standard_materials": "标准AB",
          "additional_note": "备注",
          "main_unit": "个", 
          "auxiliary_unit": "个",
          "material_demand": "3",
          "material_purchase_main": "",
          "material_purchase_auxiliary": "",
          "whether_workshop_supply": "",
          "mode_type": "Material"
        }]
      }
      ]
    }]
  }]`;
    console.log('currentUser', this.currentUser);

    window?.componentCenter?.register(
      this.customConfig.componentId,
      "comp",
      this,
      eventActionDefine
    );
    try {
      this.configuration = JSON.parse(this.propsConfiguration);
      // this.plantList = JSON.parse(this.customConfig.data)
      this.plantList = JSON.parse(josnData);
      if (this.plantList.length > 0) {
        this.forKey(this.plantList);
        this.changeForm(this.plantList[0])
      } else {
        this.componentType = 'emptyPage';
      }
      this.taskForm = this.plantList[0].tasks[0]
      this.tasksPrievw = this.plantList[0].tasks[0]
      this.operationForm = this.plantList[0].tasks[0].procedures[0];
      setTimeout(() => {
        console.log('this.plantList', this.plantList)
      }, 500)
    } catch (error) {
      console.error("configuration解析错误", error);
    }
    this.querySelect()
  },
  methods: {
    // 生成唯一key
    forKey(list) {
      list.forEach((x, index) => {
        x.seletKey = `00${index}`;
        if (x.tasks?.length > 0) {
          x.tasks.forEach((y, yIndex) => {
            y.seletKey = `${x.seletKey}-00${yIndex}`;
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
        this.taskForm.status = 2
        this.componentType = 'TaskForm'
      } else {
        switch (item.mode_type) {
          case "Plan":
            this.componentType = "PlantForm";
            break;
          case "Task":
            if (item.status == 2) {
              this.componentType = "TaskForm";
              this.taskForm = JSON.parse(JSON.stringify(item))
              this.tasksPrievw = item;
            } else {
              this.componentType = "Task";
              this.tasksPrievw = item;
            }
            break;
          case "Procedure":
            this.componentType = "Procedure";
            this.operationPrievw = item
            this.operationForm = JSON.parse(JSON.stringify(item));
            break;
        }
      }
    },
    // 新增计划
    addPalnt() {
      this.componentType = "PlantForm";
    },
    // 保存提交
    saveSub(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {


          let { onChange } = this.customConfig;
          onChange(e);
          this.forKey(this.plantList);
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
            applicant: this.currentUser.id,
            applicant_unit: this.currentUser.officeId, // 申报单位
            subunit: item.subunit, // 子单元
            applicant_date: new Date(), // 申报日期
            quality_record_number: item.quality_record_number, // 质量记录号
            mode_type: "Plan", // 类型
            tasks: item.tasks
          }
          console.log('this.planForm', this.planForm);
          this.forKey([this.planForm]);
          break;
        case "Task":
          // this.clickSonAddTtem
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
    // 任务,工序新增与删除
    handleCommand({ mod, item, index }) {
      console.log(mod, item, index);
      let { mode_type } = item;
      this.clickAddType = mode_type;
      if (mod == 'add') {
        this.clickAddTtem = item;
        this.planForm = {
          data_id: "", // 主键
          plan_name: "", // 计划名称
          plan_number: "", //计划编号
          plan_type: "", // 计划类型
          applicant: "", // 申报人
          applicant_unit: "", // 申报单位
          subunit: "", // 子单元
          applicant_date: new Date(), // 申报日期
          quality_record_number: "", // 质量记录号
          mode_type: "Plan", // 类型
        }
        this.dialogVisible = true;
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
      this.operationForm.steps.push({})
    },
    //工序步骤删除
    detailedDelFn(row) {
      const i = row.$index
      this.detailedTable.splice(i, 1)
    },
    //物料删除
    procedureDelFn(row) {
      const i = row.$index
      this.procedureTable.splice(i, 1)
    },
    //物料新增按钮
    procedureAddFn() {
      this.materialsVisible = true
      queryMaterials().then(res => {
        this.dataAll = [...res.data]
        this.materialsTable = this.dataAll.slice(0, this.currentPage * this.pageSize)
        this.total = this.dataAll.length
      }).catch(err => {
        this.materialsTable = []
      })
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
          // onChange(e);
          this.forKey(this.plantList);
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
      // this.taskForm.back = false
      this.componentType = 'Task'
    },
    //工程编辑 方法
    taskEdit(task) {
      this.taskForm = JSON.parse(JSON.stringify(task))
      // this.taskForm.back = true
      this.componentType = 'TaskForm'
    },
    //工程保存
    saveTask() {
      console.log('TaskForm:', this.taskForm);
      this.$refs.taskForm.validate((valid) => {
        if (valid) {

          for (const key in this.taskForm) {
            this.tasksPrievw[key] = this.taskForm[key]
          }

          this.tasksPrievw.status = 1
          let { onChange } = this.customConfig;
          // onChange(e);
          this.forKey(this.plantList);
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
      this.operationForm.materials[i][key] = false
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
          console.log(temp.get('file'))

          uploadFile(temp)
            .then((data) => {

              this.taskForm.file = data.data[0]
            })
            .catch((err) => {

            });
        }
      }
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
    async calculationClick(e) {
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
        this.operationForm.materials[value.index].material_demand = value.material_demand
        this.operationForm.materials[value.index].demand_state = true
        this.operationForm.materials[value.index].purchase_main_state = true
        this.operationForm.materials[value.index].purchase_auxiliary_state = true
        this.operationForm.materials[value.index].material_purchase_main = value.material_purchase_main
        this.operationForm.materials[value.index].material_purchase_auxiliary = value.material_purchase_auxiliary
      }

    },
    Event_Center_getName() {
      let { formConfig, component } = this.customConfig;
      return `${formConfig?.form_name}-${component.columnStyle.title}`;
    },
    //逻辑控制 计算
    async calculationClick(e) {
      await window.eventCenter.triggerEventNew({
        objectId: formConfig?.id,
        componentId: component.id,
        type: "report",
        event: "  calculation",
        payload: {
          value: e,
        },
      });
    },
    //金额计算设值
    do_EventCenter_setValue({ value }) {
      this.procedureTable[value.index].material_demand = value.material_demand
      this.procedureTable[value.index].material_purchase_main = value.material_purchase_main
      this.procedureTable[value.index].material_purchase_auxiliary = value.material_purchase_auxiliary
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
    height: 100%;
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
            font-weight: 500;
            font-size: 14px;
            color: #373A55;
          }

          .stepTitle {
            font-weight: 400;
            font-size: 14px;
            color: #626973;
          }

          .menuIcon {
            margin-right: 5px;
            width: 13px;
            height: 13px;
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

        .operation_headr_back {
          display: flex;
          align-items: center;

          .back_title {
            width: 70px;
          }
        }

        /deep/ .el-icon-back {
          font-size: 20px;
          cursor: pointer;
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