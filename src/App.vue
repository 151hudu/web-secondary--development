<template>
  <div class="main" :style="{ height: mainHeight }">
    <span class="addressSpan"
      >位置：{{ video_listData.meeting_room_name }} <span class="videoGreen" v-show="videoStatus"> (录播中)</span><span class="videoRed" v-show="!videoStatus"> (未录播)</span
      ><el-switch v-model="videoStatus" @change="videoChange" active-color="#13ce66" inactive-color="#ff4949"> </el-switch
    ></span>
    <div class="screenNum">
      <el-radio-group v-model="centerScreenIndex" size="mini" @change="centerScreenIndexChange">
        <el-radio-button v-for="(item, index) in centerScreen" :label="item.screen_name" :key="item.screen_num" :value="index">{{ item.screen_name }}</el-radio-button>
      </el-radio-group>
    </div>
    <div class="templateChoose">
      <el-select size="mini" v-model="templateChoose" placeholder="模板选择" @change="templateChooseChange">
        <el-option v-for="(item, index) in templateChooseOption" :key="item.template_num" :label="item.template_name" :value="index">{{ item.template_name }}</el-option>
      </el-select>
    </div>
    <div class="mainTop">
      <div class="topLeft">
        <el-tabs v-model="activeName" type="card" @tab-click="handleClick">
          <el-tab-pane label="终端" name="zhongduan" class="tabLable">
            <el-checkbox-group v-model="terminalCheckList">
              <div class="checkboxItem" v-for="(item, index) in terminalList" :key="index">
                <el-checkbox v-show="item.status" :label="item">{{ item.name }}</el-checkbox>
                <span v-show="!item.status" style="font-size: 14px; color: red; margin-left: 45px">{{ item.name }}</span>
                <div class="checkboxItemIcon">
                  <img
                    src="../pluginTemp/images/handle.png"
                    v-show="item.status"
                    @click="handleUp(item)"
                    alt=""
                    title="发言"
                    style="cursor: pointer; height: 24px; width: 24px; margin-right: 8px"
                  />
                  <img
                    src="../pluginTemp/images/call_2.png"
                    v-show="!item.status"
                    @click="recall(item)"
                    title="重拨"
                    style="cursor: pointer; height: 27px; width: 27px; margin-right: 8px"
                    alt=""
                  />
                  <img
                    src="../pluginTemp/images/user_1.png"
                    v-show="!item.is_main && item.status"
                    @click="changemain(item)"
                    title="主席"
                    style="cursor: pointer; height: 27px; width: 27px; margin-right: 8px"
                    alt=""
                  />
                  <img
                    src="../pluginTemp/images/user_2.png"
                    v-show="item.is_main && item.status"
                    @click="changemain(item)"
                    title="主席"
                    style="cursor: pointer; height: 27px; width: 27px; margin-right: 8px"
                    alt=""
                  />
                </div>
              </div>
            </el-checkbox-group>
          </el-tab-pane>
          <el-tab-pane label="本地" name="bendi" class="tabLable">
            <el-checkbox-group v-model="localCheckList">
              <div class="checkboxItem" v-for="(item, index) in localList" :key="index">
                <el-checkbox v-show="item.status" :label="item">{{ item.name }}</el-checkbox>
                <span v-show="!item.status" style="font-size: 14px; color: red; margin-left: 45px">{{ item.name }}</span>
                <div class="checkboxItemIcon">
                  <img
                    src="../pluginTemp/images/handle.png"
                    v-show="item.status"
                    @click="handleUp(item)"
                    alt=""
                    title="发言"
                    style="cursor: pointer; height: 24px; width: 24px; margin-right: 8px"
                  />
                  <img
                    src="../pluginTemp/images/call_2.png"
                    v-show="!item.status"
                    @click="recall(item)"
                    title="重拨"
                    style="cursor: pointer; height: 27px; width: 27px; margin-right: 8px"
                    alt=""
                  />
                </div>
              </div>
            </el-checkbox-group>
          </el-tab-pane>
          <el-tab-pane label="融合" name="ronghe" class="tabLable">
            <el-checkbox-group v-model="fuseCheckList">
              <div class="checkboxItem" v-for="(item, index) in fuseList" :key="index">
                <el-checkbox v-show="item.status" :label="item">{{ item.name }}</el-checkbox>
                <span v-show="!item.status" style="font-size: 14px; color: red; margin-left: 45px">{{ item.name }}</span>
                <div class="checkboxItemIcon">
                  <img
                    src="../pluginTemp/images/handle.png"
                    v-show="item.status"
                    @click="handleUp(item)"
                    alt=""
                    title="发言"
                    style="cursor: pointer; height: 24px; width: 24px; margin-right: 8px"
                  />
                  <img
                    src="../pluginTemp/images/call_2.png"
                    v-show="!item.status"
                    @click="recall(item)"
                    title="重拨"
                    style="cursor: pointer; height: 27px; width: 27px; margin-right: 8px"
                    alt=""
                  />
                </div>
              </div>
            </el-checkbox-group>
          </el-tab-pane>
          <el-tab-pane label="监控" name="jiankong" class="tabLable">
            <el-checkbox-group v-model="monitorCheckList">
              <div class="checkboxItem" v-for="(item, index) in monitorList" :key="index">
                <el-checkbox v-show="item.status" :label="item">{{ item.name }}</el-checkbox>
                <span v-show="!item.status" style="font-size: 14px; color: red; margin-left: 45px">{{ item.name }}</span>
                <div class="checkboxItemIcon">
                  <img
                    src="../pluginTemp/images/handle.png"
                    v-show="item.status"
                    @click="handleUp(item)"
                    alt=""
                    title="发言"
                    style="cursor: pointer; height: 24px; width: 24px; margin-right: 8px"
                  />
                  <img
                    src="../pluginTemp/images/call_2.png"
                    v-show="!item.status"
                    @click="recall(item)"
                    style="cursor: pointer; height: 27px; width: 27px; margin-right: 8px"
                    alt=""
                    title="重拨"
                  />
                </div>
              </div>
            </el-checkbox-group>
          </el-tab-pane>
        </el-tabs>
        <i class="el-icon-refresh refreshIcon" @click="searhVideoList"></i>
        <div class="advance">
          <el-button @click="advance">预监</el-button>
        </div>
      </div>
      <div class="topCenter">
        <div
          class="topCenterScreen"
          v-for="(item, index) in nowCenterScreen.window_layout"
          :key="index"
          :style="{ position: 'absolute', border: '2px solid #113164', background: '#7d7d7d', width: item.w, height: item.h, top: item.y, left: item.x }"
        >
          <draggable
            style="width: 100%; height: 100%"
            :value="centerShowVideo"
            :group="{ name: 'piece', put: true }"
            @start="drastartTop(item, index, 'top')"
            @add="drop(item, nowCenterScreen.screen_num, index)"
            :options="{ animation: 500 }"
          >
            <div
              class="dropDiv"
              @dblclick="singleVideoShowCli(item, index, 'top')"
              style="width: 100%; height: calc(100% - 70px); position: absolute; background: transparent"
            ></div>
            <iframe
              width="100%"
              v-if="centerShowVideo[index] && centerShowVideo[index].iFrameUrl"
              height="100%"
              frameborder="0"
              allowfullscreen
              :src="centerShowVideo[index].iFrameUrl"
            ></iframe>
            <el-select
              class="agreement"
              v-show="index < centerShowVideo.length"
              v-model="videoSouce[index]"
              :placeholder="item.ipv == 0 ? 'IPV4' : 'IPV6'"
              @change="videoLineChange($event, centerShowVideo[index])"
            >
              <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value"> </el-option>
            </el-select>
            <div style="color: #ffffff; position: absolute; top: 0; left: 0" v-if="centerShowVideo[index] && index < centerShowVideo.length">
              {{ centerShowVideo[index].name }}
            </div>
            <img
              class="micIcon"
              style="right: 2.8px"
              @click="imgShowChange('open', item, index)"
              v-show="index < centerShowVideo.length && centerShowVideo[index].mic_status == 'on'"
              src="../pluginTemp/images/openMIC.png"
              alt=""
            />
            <img
              class="micIcon"
              @click="imgShowChange('off', item, index)"
              v-show="index < centerShowVideo.length && centerShowVideo[index].mic_status == 'off'"
              src="../pluginTemp/images/offMIC.png"
              alt=""
            />
          </draggable>
        </div>
      </div>
      <div class="topRight">
        <div>
          <img @click="openLogout" title="结束会议" src="../pluginTemp/images/logout.png" alt="" />
        </div>
        <div>
          <img @click="openStatus" title="会场终端" src="../pluginTemp/images/setting.png" alt="" />
        </div>
        <div>
          <img @click="lineStatus" title="切换线路" src="../pluginTemp/images/line.png" alt="" />
        </div>
        <div>
          <img @click="addStatus" title="添加临时资源" src="../pluginTemp/images/add.png" alt="" />
        </div>
      </div>
    </div>
    <div class="mainBottom">
      <el-tabs v-model="activeName" type="card" @tab-click="handleClick">
        <el-tab-pane label="终端资源" name="zhongduan" class="tabPane">
          <draggable
            :group="{ name: 'piece' }"
            :value="buttomTabList2.terminalList"
            :sort="false"
            @start="
              (val) => {
                dragstart(val, 'bottom', 'terminalList');
              }
            "
            class="bottomDarg"
          >
            <div v-for="(item, index) in buttomTabList.terminalList" :key="index" class="carouselItem">
              <div style="width: 100%; height: calc(100% - 50px); position: absolute; background: transparent"></div>
              <div class="closeBox" v-show="item" @click="closeButtom(item, index, 'terminalList')">x</div>
              <iframe width="100%" v-if="item.iFrameUrl" height="100%" frameborder="0" allowfullscreen :src="item.iFrameUrl"></iframe>
            </div>
          </draggable>
        </el-tab-pane>
        <el-tab-pane label="本地设备" name="bendi" class="tabPane">
          <draggable
            :group="{ name: 'piece' }"
            :value="buttomTabList2.localList"
            :sort="false"
            @start="
              (val) => {
                dragstart(val, 'bottom', 'localList');
              }
            "
            class="bottomDarg"
          >
            <div v-for="(item, index) in buttomTabList.localList" :key="index" class="carouselItem">
              <div style="width: 100%; height: calc(100% - 50px); position: absolute; background: transparent"></div>
              <div class="closeBox" v-show="item" @click="closeButtom(item, index, 'localList')">x</div>
              <iframe width="100%" v-if="item.iFrameUrl" height="100%" frameborder="0" allowfullscreen :src="item.iFrameUrl"></iframe>
            </div>
          </draggable>
        </el-tab-pane>
        <el-tab-pane label="融合通讯" name="ronghe" class="tabPane">
          <draggable
            :group="{ name: 'piece' }"
            :value="buttomTabList2.fuseList"
            :sort="false"
            @start="
              (val) => {
                dragstart(val, 'bottom', 'fuseList');
              }
            "
            class="bottomDarg"
          >
            <div v-for="(item, index) in buttomTabList.fuseList" :key="index" class="carouselItem">
              <div style="width: 100%; height: calc(100% - 50px); position: absolute; background: transparent"></div>
              <div class="closeBox" v-show="item" @click="closeButtom(item, index, 'fuseList')">x</div>
              <iframe width="100%" v-if="item.iFrameUrl" height="100%" frameborder="0" allowfullscreen :src="item.iFrameUrl"></iframe>
            </div>
          </draggable>
        </el-tab-pane>
        <el-tab-pane label="监控资源" name="jiankong" class="tabPane">
          <draggable
            :group="{ name: 'piece' }"
            :value="buttomTabList2.monitorList"
            :sort="false"
            @start="
              (val) => {
                dragstart(val, 'bottom', 'monitorList');
              }
            "
            class="bottomDarg"
          >
            <div v-for="(item, index) in buttomTabList.monitorList" :key="index" class="carouselItem">
              <div style="width: 100%; height: calc(100% - 50px); position: absolute; background: transparent"></div>
              <div class="closeBox" v-show="item" @click="closeButtom(item, index, 'monitorList')">x</div>
              <iframe width="100%" v-if="item.iFrameUrl" height="100%" frameborder="0" allowfullscreen :src="item.iFrameUrl"></iframe>
            </div>
          </draggable>
        </el-tab-pane>
      </el-tabs>
    </div>
    <el-dialog title="关闭提示" :visible.sync="offDialogVisible" width="25%" :before-close="handleClose" class="leaceMeetingDialog">
      <span>确认结束会议？</span>
      <span slot="footer" class="dialog-footer">
        <el-button @click="offDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="leaveMeetingAll">确 定</el-button>
      </span>
    </el-dialog>
    <el-dialog :visible.sync="statusDialogVisible" title="会场终端" width="60%" :before-close="handleStatusClose" class="meetingStatus">
      <div class="metting_all">
        <!-- 会议 -->
        <div class="metting">
          <!-- 上侧 -->
          <div class="metting_top">
            <!-- 会场终端 -->
            <div class="metting_table">
              <!-- <div class="table_title">
                <div>会场终端</div>
                <img style="margin-left: 35%" src="../pluginTemp/images/ico_ty.png" alt="" />
              </div> -->
              <!-- 搜索 -->
              <div class="metting_search">
                <el-input placeholder="请输入搜索关键字" v-model="dialogSearch"></el-input>
                <el-button icon="el-icon-search" @click="handleSearch">查询</el-button>
              </div>
              <div class="radio_search">
                <el-radio-group v-model="radioSearch" size="small" @change="dialogRadioSearch">
                  <el-radio-button label="终端"></el-radio-button>
                  <el-radio-button label="本地"></el-radio-button>
                  <el-radio-button label="融合"></el-radio-button>
                  <el-radio-button label="监控"></el-radio-button>
                </el-radio-group>
              </div>
              <!-- 表格 -->
              <el-table
                :data="meetingStatusData"
                max-height="500px"
                style="margin-bottom: 30px"
                :row-style="tableRowClassName"
                :header-cell-style="{ background: '#012641', borderBottom: '1px solid #013657' }"
              >
                <el-table-column show-overflow-tooltip prop="name" label="会场名称" header-align="center" align="center" width="200"></el-table-column>
                <el-table-column show-overflow-tooltip prop="local_venue_name" label="观看会场" header-align="center" align="center" width="200"></el-table-column>
                <el-table-column show-overflow-tooltip prop="hw_addr" label="会场标识" header-align="center" align="center" width="200"></el-table-column>
                <el-table-column label="操作" header-align="center" align="center">
                  <template slot-scope="scope">
                    <el-row :gutter="28">
                      <el-col :span="3">
                        <div class="table_img" @click="handleUp(scope.row)" v-show="scope.row.status == 0 && scope.row.type == 0">
                          <img src="../pluginTemp/images/call_2.png" alt="" title="重拨" />
                          <!-- <img src="./assets/call_2.png" alt="" /> -->
                        </div>
                      </el-col>
                      <el-col :span="3">
                        <div class="table_img" @click="handleUp(scope.row)" v-show="scope.row.status">
                          <img src="../pluginTemp/images/handle.png" alt="" title="发言" />
                          <!-- <img src="./assets/call_2.png" alt="" /> -->
                        </div>
                      </el-col>
                      <el-col :span="3">
                        <div class="table_img" v-show="scope.row.is_main == false && scope.row.status == 1 && scope.row.type == 0" @click="changemain(scope.row)">
                          <img src="../pluginTemp/images/user_1.png" title="主席" />
                          <!-- <img src="./assets/user_2.png" alt="" /> -->
                        </div>
                      </el-col>
                      <el-col :span="3">
                        <div class="table_img" v-show="scope.row.is_main == true && scope.row.status == 1 && scope.row.type == 0" @click="changemain(scope.row)">
                          <img src="../pluginTemp/images/user_2.png" title="主席" />
                          <!-- <img src="./assets/user_2.png" alt="" /> -->
                        </div>
                      </el-col>
                      <el-col :span="3">
                        <div class="table_img" v-show="scope.row.mic_status == 'on' && scope.row.status == 1 && scope.row.type == 0" @click="rowImgShowChange('open', scope.row)">
                          <img src="../pluginTemp/images/mic_1.png" alt="" title="麦克风" />
                          <!-- <img src="./assets/mic_2.png" alt="" /> -->
                        </div>
                      </el-col>
                      <el-col :span="3">
                        <div class="table_img" v-show="scope.row.mic_status == 'off' && scope.row.status == 1 && scope.row.type == 0" @click="rowImgShowChange('off', scope.row)">
                          <img src="../pluginTemp/images/mic_2.png" alt="" title="麦克风" />
                          <!-- <img src="./assets/mic_2.png" alt="" /> -->
                        </div>
                      </el-col>
                      <el-col :span="3">
                        <div class="table_img" v-show="!scope.row.mic_status && scope.row.status == 1 && scope.row.type == 0">
                          <img src="../pluginTemp/images/mic_3.png" alt="" title="麦克风" />
                          <!-- <img src="./assets/mic_2.png" alt="" /> -->
                        </div>
                      </el-col>
                      <el-col :span="3">
                        <div class="table_img" v-show="scope.row.mic_status == 'on' && scope.row.status == 1 && scope.row.type == 0">
                          <img src="../pluginTemp/images/mic_4.png" alt="" title="远端麦克风" />
                          <!-- <img src="./assets/mic_4.png" alt="" /> -->
                        </div>
                      </el-col>
                      <el-col :span="3">
                        <div class="table_img" v-show="scope.row.mic_status == 'off' && scope.row.status == 1 && scope.row.type == 0">
                          <img src="../pluginTemp/images/mic_5.png" alt="" title="远端麦克风" />
                          <!-- <img src="./assets/mic_4.png" alt="" /> -->
                        </div>
                      </el-col>
                      <el-col :span="3">
                        <div class="table_img" v-show="scope.row.vol_status == 'on' && scope.row.status == 1 && scope.row.type == 0" @click="hornChange(scope.row)">
                          <img src="../pluginTemp/images/horn_1.png" alt="" title="扬声器" />
                        </div>
                      </el-col>
                      <el-col :span="3">
                        <div class="table_img" v-show="scope.row.vol_status == 'off' && scope.row.status == 1 && scope.row.type == 0" @click="hornChange(scope.row)">
                          <img src="../pluginTemp/images/horn_2.png" alt="" title="扬声器" />
                        </div>
                      </el-col>
                      <el-col :span="3">
                        <div class="table_img" @click="rowMonitor(scope.row)" v-show="scope.row.status">
                          <img src="../pluginTemp/images/camera_1.png" alt="" title="预监" />
                        </div>
                      </el-col>
                      <el-col :span="3">
                        <div class="table_img" @click="rowFinishMeeting(scope.row)" v-show="scope.row.status && scope.row.type == 0">
                          <img src="../pluginTemp/images/leave_1.png" alt="" title="离会" />
                        </div>
                      </el-col>
                    </el-row>
                  </template>
                </el-table-column>
              </el-table>
            </div>
          </div>
        </div>
      </div>
    </el-dialog>
    <el-dialog title="线路切换" :visible.sync="lineDialogVisible" width="25%" :before-close="handleLineClose" class="switchLine">
      <el-radio-group v-model="lineData">
        <el-radio label="IPV4">全部切换IPV4</el-radio>
        <br />
        <el-radio label="IPV6">全部切换IPV6</el-radio>
      </el-radio-group>
      <span slot="footer" class="dialog-footer">
        <el-button @click="lineDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="lineDialogChange">确 定</el-button>
      </span>
    </el-dialog>
    <el-dialog :visible.sync="addDialogVisible" width="980px" class="temporaryAdd" title="添加临时资源">
      <el-table :data="addtableData" style="width: 100%" height="380px" :header-cell-style="{ background: '#012641', borderBottom: '1px solid #013657', color: '#1985e1' }">
        <el-table-column align="center" prop="name" label="名称">
          <template slot-scope="scope">
            <el-input size="small" v-model="scope.row.name"></el-input>
          </template>
        </el-table-column>
        <el-table-column align="center" prop="model" label="型号">
          <template slot-scope="scope">
            <el-select size="small" class="agreement" v-model="scope.row.model" placeholder="">
              <el-option v-for="item in modelOptions" :key="item.value" :label="item.label" :value="item.value"> </el-option>
            </el-select>
          </template>
        </el-table-column>
        <el-table-column align="center" prop="type" label="类型">
          <template slot-scope="scope">
            <el-select size="small" class="agreement" v-model="scope.row.type" placeholder="">
              <el-option v-for="item in typeOptions" :key="item.value" :label="item.label" :value="item.value"> </el-option>
            </el-select>
          </template>
        </el-table-column>
        <el-table-column align="center" prop="flag" label="连接标识">
          <template slot-scope="scope"> <el-input size="small" v-model="scope.row.flag"></el-input> </template
        ></el-table-column>
        <el-table-column align="center" prop="username" label="用户名">
          <template slot-scope="scope"> <el-input size="small" v-model="scope.row.username"></el-input> </template
        ></el-table-column>
        <el-table-column align="center" prop="password" label="密码">
          <template slot-scope="scope"> <el-input size="small" v-model="scope.row.password"></el-input> </template
        ></el-table-column>
        <el-table-column align="center" prop="recall" width="180" label="操作">
          <template slot-scope="scope">
            <el-button size="mini" type="primary">高级设置</el-button>
            <el-button size="mini" type="primary" @click="deleteRow(scope.row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-button class="addRow" @click="addRow" style="background: #002c47; color: #ffffff">+新增</el-button>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addRowChange">确 定</el-button>
      </span>
    </el-dialog>
    <el-dialog :visible.sync="singleVideoShow" ref="singleVideoDialog" :title="this.singleVideoInfo.name" width="900px" :before-close="handleCloseSingle">
      <div class="singleVideoDialogHeight">
        <iframe width="100%" height="100%" frameborder="0" allowfullscreen :src="this.singleVideoInfo.iFrameUrl"></iframe>
      </div>
    </el-dialog>
  </div>
</template>

<script>
// import appService from "@njsdata/app-sdk";

import eventActionDefine from "./components/msgCompConfig";
import draggable from "vuedraggable";
import {
  queryAssetById,
  add_resources,
  create,
  record,
  change_ipv,
  change_main,
  say,
  recall,
  preview,
  mic_all,
  video_list,
  change_all_loudspeaker,
  up_screen,
  window_layout,
  finish,
  hangup,
  screen_template_layout,
  change_screen_template,
} from "./api/asset";
import "./index.css";
import { Five, People, PhoneCall, Refresh } from "@icon-park/vue";
import { finished } from "stream";
const CKplayer = window.ckplayer;
export default {
  name: "App",
  props: {
    customConfig: Object,
    info: Object,
  },
  components: {
    Five,
    draggable,
    People,
    PhoneCall,
    Refresh,
  },
  data() {
    return {
      page_server: "http://114.115.248.69",
      video_size: "700x440",
      conference_id: "", //会议ID，
      activeName: "zhongduan",
      offDialogVisible: false,
      statusDialogVisible: false,
      lineDialogVisible: false,
      addDialogVisible: false,
      imgshow: true, //麦克风图片控制
      lineData: "IPV4", //线路数据
      videoStatus: true, //录播状态
      addtableData: [
        {
          name: "",
          model: "",
          type: "",
          flag: "",
          username: "",
          password: "",
          listId: "0",
        },
      ], //新增弹窗表格
      videoSouce: [], //每个屏幕的线路
      terminalList: [], //终端数据
      localList: [], //本地数据
      fuseList: [], //融合数据
      monitorList: [], //监控数据
      centerScreen: [],
      nowCenterScreen: [],
      windowLayoutOption: [],
      videoList: [],
      radioSearch: "终端", //弹窗radio搜索
      dialogSearch: "", //弹窗搜索
      options: [
        {
          value: "IPV4",
          label: "IPV4",
        },
        {
          value: "IPV6",
          label: "IPV6",
        },
      ], //线路选项
      modelOptions: [
        {
          value: "华为中端",
          label: "华为终端",
        },
        {
          value: "中兴终端",
          label: "中兴终端",
        },
        {
          value: "小鱼终端",
          label: "小鱼终端",
        },
        {
          value: "华平终端",
          label: "华平终端",
        },
      ], //弹窗模型选项
      typeOptions: [
        {
          value: "H.323",
          label: "H.323",
        },
      ], //弹窗类型选项
      modelOptionsModel: "",
      typeOptionsModel: "",
      centerScreenIndex: "左辅屏",
      singleVideoShow: false,
      singleVideoInfo: {},
      templateChoose: {},
      templateChooseOption: [],
      meetingStatusData: [], //弹窗最终展示数据
      buttomTabList: {
        terminalList: [],
        localList: [],
        fuseList: [],
        monitorList: [],
      },
      buttomTabList2: {
        terminalList: [],
        localList: [],
        fuseList: [],
        monitorList: [],
      },
      centerShowVideo: [], //中间屏幕展示的
      terminalCheckList: [], //终端值
      localCheckList: [], //本地值
      fuseCheckList: [], //融合值
      monitorCheckList: [], //监控值
      listId: 1, //新增ID
      nowLocaltion: "终端", //当前的tab
      video_listData: [], //所有会议的初始数据
      data_id: "", //data_id
      mainHeight: "980px", //组件高度
      nowDialogRadioSearch: "终端",
      movingInfo: {},
      movingInfoIndex: "",
      movingInfoType: "",
      nowLocal_venue_name: "",
      nowLocal_venue_num: "",
      colors: [
        {
          text: "Aquamarine",
        },
        {
          text: "Hotpink",
        },
        {
          text: "Gold",
        },
        {
          text: "Crimson",
        },
        {
          text: "Blueviolet",
        },
        {
          text: "Lightblue",
        },
        {
          text: "Cornflowerblue",
        },
        {
          text: "Skyblue",
        },
        {
          text: "Burlywood",
        },
      ],
    };
  },
  computed: {},
  mounted() {
    let { componentId } = this.customConfig || {};
    let dataid = this.GetQueryString("data_id");
    this.data_id = this.GetQueryString("data_id");
    this.creatMeeting(dataid);
    componentId && window.componentCenter?.register(componentId, "comp", this, eventActionDefine);
    this.$nextTick(() => {
      let elements = document.querySelectorAll(".dropDiv");
      Array.prototype.forEach.call(elements, function (element) {
        element.addEventListener("dragover", function (event) {
          event.preventDefault();
          event.stopPropagation();
        });
        element.addEventListener("dragEnter", function (event) {
          event.preventDefault();
          event.stopPropagation();
        });
      });
    });
  },
  methods: {
    // 创建会议
    creatMeeting(data_id) {
      let message = {
        data_id: data_id,
        type: "1",
      };
      create(message)
        .then((res) => {
          if (res.status == 200) {
            this.conference_id = res.data.conference_id;
            let message = {
              conference_id: +this.conference_id,
              external: "",
              type: 1,
            };
            video_list(message).then((res) => {
              this.video_listData = res.data;
              this.nowLocal_venue_name = res.data.local_venue_name;
              this.windowLayout();
              if (res.data.is_recording) {
                let message = {
                  conference_id: this.conference_id,
                  status: 1,
                };
                record(message)
                  .then((res) => {
                    if (res.status == 200) {
                      this.$message({
                        message: "正在录播中",
                        type: "success",
                      });
                    }
                  })
                  .catch((error) => {
                    this.$message({
                      message: error.data.result,
                      type: "error",
                    });
                  });
              }
              this.videoList = res.data.terminal_list;
              this.centerShowVideo = JSON.parse(JSON.stringify(res.data.terminal_list));
              this.centerShowVideo.forEach((item, index) => {
                this.$nextTick(() => {
                  let h = document.getElementsByClassName("topCenterScreen")[index].offsetHeight;
                  let w = document.getElementsByClassName("topCenterScreen")[index].offsetWidth;
                  item.video_size = `${w - 8}x${h - 10}`;
                  item.iFrameUrl = `${this.page_server}/embed?s=${window.btoa(item.video_url)}&r=${window.btoa(item.video_size)}`;
                  item.ipv == 0 ? (this.videoSouce[index] = "IPV4") : (this.videoSouce[index] = "IPV6");
                  this.$forceUpdate();
                });
              });
              this.handleRedData();
            });
          }
        })
        .catch((error) => {
          console.log(error);
          this.$message({
            message: error.data.result,
            type: "error",
          });
        });
    },
    // 主屏幕布局
    windowLayout() {
      let message = {
        local_venue_name: this.conference_id,
      };
      window_layout(message)
        .then((res) => {
          if (res.status == 200) {
            this.centerScreen = res.data;
            this.centerScreenIndex = this.centerScreen[0].screen_name;
            this.nowLocal_venue_num = this.centerScreen[0].screen_num;
            this.nowCenterScreen = this.centerScreen[0];
            let message2 = {
              local_venue_name: this.nowLocal_venue_name,
              screen_num: this.nowLocal_venue_num,
            };
            screen_template_layout(message2).then((res) => {
              this.templateChooseOption = res.data;
              this.templateChoose = "";
            });
            this.centerShowVideo.forEach((item, index) => {
              this.$nextTick(() => {
                let h = document.getElementsByClassName("topCenterScreen")[index].offsetHeight;
                let w = document.getElementsByClassName("topCenterScreen")[index].offsetWidth;
                item.video_size = `${w - 8}x${h - 10}`;
                item.ipv == 0 ? (this.videoSouce[index] = "IPV4") : "IPV6";
                item.iFrameUrl = `${this.page_server}/embed?s=${window.btoa(item.video_url)}&r=${window.btoa(item.video_size)}`;
                this.$forceUpdate();
              });
            });
            this.$nextTick(() => {
              let elements = document.getElementsByClassName("dropDiv");
              Array.prototype.forEach.call(elements, function (element) {
                element.addEventListener("dragover", function (event) {
                  event.preventDefault();
                  event.stopPropagation();
                });
                element.addEventListener("dragEnter", function (event) {
                  event.preventDefault();
                  event.stopPropagation();
                });
              });
            });
          }
        })
        .catch((error) => {
          this.$message({
            message: error.data.result,
            type: "error",
          });
        });
    },
    // 查询视频资源
    searhVideoList() {
      let message = {
        conference_id: +this.conference_id,
        external: "",
        type: 1,
      };
      this.terminalCheckList = []
      this.localCheckList = []
      this.fuseCheckList = []
      this.monitorCheckList = []
      video_list(message).then((res) => {
        // this.video_listData = res.data;
        this.videoList = res.data.terminal_list;
        this.meetingStatusData = res.data.terminal_list;
        // this.videoList.forEach((item, index) => {
        //   this.$nextTick(() => {
        //     let h = document.getElementsByClassName("topCenterScreen")[index].offsetHeight;
        //     let w = document.getElementsByClassName("topCenterScreen")[index].offsetWidth;
        //     item.video_size = `${w - 8}x${h - 10}`;
        //     item.ipv == 0 ? (this.videoSouce[index] = "IPV4") : (this.videoSouce[index] = "IPV6");
        //     item.iFrameUrl = `${this.page_server}/embed?s=${window.btoa(item.video_url)}&r=${window.btoa(item.video_size)}`;
        //     this.$forceUpdate();
        //   });
        // });
        this.handleRedData();
      });
    },
    // tab改变
    handleClick(tab, event) {
      this.nowLocaltion = tab.label;
      this.terminalCheckList = [];
      this.localCheckList = [];
      this.fuseCheckList = [];
      this.monitorCheckList = [];
    },
    // 重拨
    recall(row) {
      let message = {
        conference_id: this.conference_id,
        terminal_id: row.id,
      };
      recall(message)
        .then((res) => {
          if (res.status == 200) {
            this.searhVideoList();
          }
        })
        .catch((error) => {
          this.$message({
            message: error.data.result,
            type: "error",
          });
        });
    },
    // 呼叫
    changemain(row) {
      let message = {
        conference_id: this.conference_id,
        terminal_id: row.id,
      };
      change_main(message)
        .then((res) => {
          if (res.status == 200) {
            this.searhVideoList();
          }
        })
        .catch((error) => {
          this.$message({
            message: error.data.result,
            type: "error",
          });
        });
    },
    // 发言
    handleUp(row) {
      let message = {
        conference_id: this.conference_id,
        terminal_id: row.id,
      };
      say(message)
        .then((res) => {
          if (res.status == 200) {
            let info = this.centerShowVideo[1];
            this.centerShowVideo[1] = row;
            this.centerShowVideo[1].video_size = info.video_size;
            this.centerShowVideo[1].iFrameUrl = `${this.page_server}/embed?s=${window.btoa(this.centerShowVideo[1].video_url)}&r=${window.btoa(
              this.centerShowVideo[1].video_size
            )}`;
            this.$forceUpdate();
            this.searhVideoList();
          }
        })
        .catch((error) => {
          this.$message({
            message: error.data.result,
            type: "error",
          });
        });
    },
    // 录播
    videoChange() {
      this.videoStatus = this.videoStatus;
      let message = {
        conference_id: this.conference_id,
        status: "",
      };
      this.videoStatus ? (message.status = 1) : (message.status = 0);
      record(message)
        .then((res) => {
          if (res.status == 200) {
            if (this.videoStatus) {
              this.$message({
                message: "正在录播中",
                type: "success",
              });
            } else {
              this.$message({
                message: "录制已关闭",
                type: "warning",
              });
            }
          }
        })
        .catch((error) => {
          this.$message({
            message: error.data.result,
            type: "error",
          });
        });
    },
    // 预监
    advance() {
      let message = {
        conference_id: this.conference_id,
        terminal_list: [],
      };
      switch (this.nowLocaltion) {
        case "终端":
        case "终端资源":
          this.terminalCheckList.forEach((item, index) => {
            message.terminal_list.push(item.id);
          });
          break;
        case "本地":
        case "本地设备":
          this.localCheckList.forEach((item, index) => {
            message.terminal_list.push(item.id);
          });
          break;
        case "融合":
        case "融合通讯":
          this.fuseCheckList.forEach((item, index) => {
            message.terminal_list.push(item.id);
          });
          break;
        case "监控":
        case "监控资源":
          this.monitorCheckList.forEach((item, index) => {
            message.terminal_list.push(item.id);
          });
          break;
      }
      if (message.terminal_list.length == 0) {
        return this.$message({
          message: "请勾选终端后预监",
          type: "warning",
        });
      }
      preview(message)
        .then((res) => {
          if (res.status == 200) {
            switch (this.nowLocaltion) {
              case "终端":
              case "终端资源":
                this.buttomTabList.terminalList = res.data;
                this.buttomTabList.terminalList.forEach((item, index) => {
                  this.$nextTick(() => {
                    let h = document.getElementsByClassName("carouselItem")[0].offsetHeight;
                    let w = document.getElementsByClassName("carouselItem")[0].offsetWidth;
                    item.video_size = `${w - 8}x${h - 10}`;
                    item.iFrameUrl = `${this.page_server}/embed?s=${window.btoa(item.video_url)}&r=${window.btoa(item.video_size)}`;
                    this.$forceUpdate();
                  });
                });
                break;
              case "本地":
              case "本地设备":
                this.buttomTabList.localList = res.data;
                this.buttomTabList.localList.forEach((item, index) => {
                  this.$nextTick(() => {
                    let h = document.getElementsByClassName("bottomDarg")[1].offsetHeight;
                    let w = document.getElementsByClassName("bottomDarg")[1].offsetWidth / 5;
                    item.video_size = `${w - 8}x${h - 10}`;
                    console.log(item.video_size);
                    item.iFrameUrl = `${this.page_server}/embed?s=${window.btoa(item.video_url)}&r=${window.btoa(item.video_size)}`;
                    this.$forceUpdate();
                  });
                });
                break;
              case "融合":
              case "融合通讯":
                this.buttomTabList.fuseList = res.data;
                this.buttomTabList.fuseList.forEach((item, index) => {
                  this.$nextTick(() => {
                    let h = document.getElementsByClassName("bottomDarg")[2].offsetHeight;
                    let w = document.getElementsByClassName("bottomDarg")[2].offsetWidth / 5;
                    item.video_size = `${w - 8}x${h - 10}`;
                    item.iFrameUrl = `${this.page_server}/embed?s=${window.btoa(item.video_url)}&r=${window.btoa(item.video_size)}`;
                    this.$forceUpdate();
                  });
                });
                break;
              case "监控":
              case "监控资源":
                this.buttomTabList.monitorList = res.data;
                this.buttomTabList.monitorList.forEach((item, index) => {
                  this.$nextTick(() => {
                    let h = document.getElementsByClassName("bottomDarg")[3].offsetHeight;
                    let w = document.getElementsByClassName("bottomDarg")[3].offsetWidth / 5;
                    item.video_size = `${w - 8}x${h - 10}`;
                    item.iFrameUrl = `${this.page_server}/embed?s=${window.btoa(item.video_url)}&r=${window.btoa(item.video_size)}`;
                    this.$forceUpdate();
                  });
                });
                break;
            }
            this.$message({
              message: "预监资源已更新",
              type: "success",
            });
          }
        })
        .catch((error) => {
          console.log(error.data.result);
          this.$message({
            message: error.data.result,
            type: "error",
          });
        });
    },
    // 预监删除
    closeButtom(item, index, type) {
      this.buttomTabList[type].splice(index, 1);
    },
    // 拖动拖动源
    dragstart(event, type, shunxu) {
      let index = event.oldIndex;
      this.movingInfo = JSON.parse(JSON.stringify(this.buttomTabList[shunxu][index]));
      this.movingInfoIndex = index;
      this.movingInfoType = type;
      console.log(event, type, shunxu, "拖动源信息");
    },
    drastartTop(item, index) {
      console.log(item, index);
      this.movingInfo = JSON.parse(JSON.stringify(this.centerShowVideo[index]));
      this.movingInfoIndex = index;
      this.movingInfoType = "top"
    },
    // 拖动接收源
    drop(item, num, index) {
      console.log(item, num, index);
      let message = {
        conference_id: this.conference_id,
        terminal_id: this.centerShowVideo[index].id,
        screen_id: num,
        window_id: index,
      };
      up_screen(message).then((res) => {
        if (res.status == 200) {
          if (this.movingInfoType == "bottom") {
            this.movingInfo.video_size = this.centerShowVideo[index].video_size;
            this.movingInfo.iFrameUrl = `${this.page_server}/embed?s=${window.btoa(this.movingInfo.video_url)}&r=${window.btoa(this.movingInfo.video_size)}`;
            this.centerShowVideo.splice(index, 1, this.movingInfo);
            switch (this.nowLocaltion) {
              case "终端":
              case "终端资源":
                this.buttomTabList.terminalList.splice(this.movingInfoIndex, 1);
                break;
              case "本地":
              case "本地设备":
                this.buttomTabList.localList.splice(this.movingInfoIndex, 1);
                break;
              case "融合":
              case "融合通讯":
                this.buttomTabList.fuseList.splice(this.movingInfoIndex, 1);
                break;
              case "监控":
              case "监控资源":
                this.buttomTabList.monitorList.splice(this.movingInfoIndex, 1);
                break;
            }
          } else {
            let message2 = {
              conference_id: this.conference_id,
              terminal_id: this.centerShowVideo[this.movingInfoIndex].id,
              screen_id: this.nowCenterScreen.screen_num,
              window_id: this.movingInfoIndex,
            };
            up_screen(message2).then((res) => {
              console.log(res);
            });
            let info = this.centerShowVideo[index];
            let size = this.centerShowVideo[this.movingInfoIndex].video_size;
            this.centerShowVideo[index] = this.centerShowVideo[this.movingInfoIndex];
            this.centerShowVideo[index].video_size = info.video_size;
            this.centerShowVideo[index].iFrameUrl = `${this.page_server}/embed?s=${window.btoa(this.centerShowVideo[index].video_url)}&r=${window.btoa(
              this.centerShowVideo[index].video_size
            )}`;
            this.centerShowVideo[this.movingInfoIndex] = info;
            this.centerShowVideo[this.movingInfoIndex].video_size = size;
            this.centerShowVideo[this.movingInfoIndex].iFrameUrl = `${this.page_server}/embed?s=${window.btoa(
              this.centerShowVideo[this.movingInfoIndex].video_url
            )}&r=${window.btoa(this.centerShowVideo[this.movingInfoIndex].video_size)}`;
            this.$forceUpdate();
          }
        }
      });
    },
    dragleave(event) {
      event.preventDefault();
    },
    centerScreenIndexChange(val) {
      let message = {
        local_venue_name: this.nowLocal_venue_name,
        screen_num: "",
        template_num: 0,
      };
      this.centerScreen.forEach((item, index) => {
        if (item.screen_name == val) {
          message.screen_num = item.screen_num;
          this.nowCenterScreen = item;
          this.nowLocal_venue_num = item.screen_num;
        }
      });
      change_screen_template(message).then((res) => {
        if (res.status == 200) {
          let message = {
            conference_id: +this.conference_id,
            external: "",
            type: 1,
          };
          video_list(message).then((res) => {
            this.videoList = res.data.terminal_list;
            this.meetingStatusData = res.data.terminal_list;
            this.buttomTabList.terminalList = [];
            this.buttomTabList.fuseList = [];
            this.buttomTabList.localList = [];
            this.buttomTabList.monitorList = [];
            this.centerShowVideo = JSON.parse(JSON.stringify(res.data.terminal_list));
            let message2 = {
              local_venue_name: this.nowLocal_venue_name,
              screen_num: this.nowLocal_venue_num,
            };
            screen_template_layout(message2).then((res) => {
              this.templateChooseOption = res.data;
            });
            this.centerShowVideo.forEach((item, index) => {
              this.$nextTick(() => {
                let h = document.getElementsByClassName("topCenterScreen")[index].offsetHeight;
                let w = document.getElementsByClassName("topCenterScreen")[index].offsetWidth;
                item.video_size = `${w - 8}x${h - 10}`;
                item.iFrameUrl = `${this.page_server}/embed?s=${window.btoa(item.video_url)}&r=${window.btoa(item.video_size)}`;
                item.ipv == 0 ? (this.videoSouce[index] = "IPV4") : (this.videoSouce[index] = "IPV6");
                this.$forceUpdate();
              });
            });
            this.$nextTick(() => {
              let elements = document.getElementsByClassName("dropDiv");
              Array.prototype.forEach.call(elements, function (element) {
                element.addEventListener("dragover", function (event) {
                  event.preventDefault();
                  event.stopPropagation();
                });
                element.addEventListener("dragEnter", function (event) {
                  event.preventDefault();
                  event.stopPropagation();
                });
              });
            });
            this.handleRedData();
          });
        }
      });
    },
    // 屏幕布局切换
    templateChooseChange(val) {
      this.nowCenterScreen = this.templateChooseOption[val];
      this.centerShowVideo.forEach((item, index) => {
        this.$nextTick(() => {
          let h = document.getElementsByClassName("topCenterScreen")[index].offsetHeight;
          let w = document.getElementsByClassName("topCenterScreen")[index].offsetWidth;
          item.video_size = `${w - 8}x${h - 10}`;
          item.ipv == 0 ? (this.videoSouce[index] = "IPV4") : "IPV6";
          item.iFrameUrl = `${this.page_server}/embed?s=${window.btoa(item.video_url)}&r=${window.btoa(item.video_size)}`;
          this.$forceUpdate();
        });
      });
      this.$nextTick(() => {
        let elements = document.getElementsByClassName("dropDiv");
        Array.prototype.forEach.call(elements, function (element) {
          element.addEventListener("dragover", function (event) {
            event.preventDefault();
            event.stopPropagation();
          });
          element.addEventListener("dragEnter", function (event) {
            event.preventDefault();
            event.stopPropagation();
          });
        });
      });
    },
    // 麦克风
    imgShowChange(val, item, index) {
      let message = {
        conference_id: this.conference_id,
        terminal_id: this.centerShowVideo[index].id,
      };
      if (val == "off") {
        message.status = 1;
      } else if (val == "open") {
        message.status = 0;
      }
      mic_all(message)
        .then((res) => {
          if (res.status == 200) {
            // let message2 = {
            //   conference_id: +this.conference_id,
            //   external: "",
            //   type: 1,
            // };
            // video_list(message2).then((res) => {
            //   this.video_listData = res.data;
            this.centerShowVideo[index].mic_status == "off" ? (this.centerShowVideo[index].mic_status = "on") : (this.centerShowVideo[index].mic_status = "off");
            // });
          }
        })
        .catch((error) => {
          this.$message({
            message: error.data.result,
            type: "error",
          });
        });
    },
    // 弹窗搜索方法
    handleSearch() {
      this.meetingStatusData = [];
      this.videoList.map((item) => {
        if (item.name.indexOf(this.dialogSearch) !== -1) {
          this.meetingStatusData.push(item);
        }
      });
      this.radioSearch = "";
    },
    // 线路切换
    videoLineChange(val, item) {
      let message = {
        conference_id: this.conference_id,
        terminal_id: item.id,
        ipv: val == "IPV4" ? 0 : 1,
      };
      change_ipv(message)
        .then((res) => {
          if (res.status == 200) {
            if (val == "IPV4") {
              // this.$message({
              //   message: "已切换至IPV4",
              //   type: "success",
              // });
            } else {
              // this.$message({
              //   message: "已切换至IPV6",
              //   type: "success",
              // });
            }
          }
        })
        .catch((error) => {
          this.$message({
            message: error.data.result,
            type: "error",
          });
        });
    },
    // 右侧退出会议按钮
    leaveMeetingAll() {
      let message = {
        conference_id: this.conference_id,
        data_id: this.data_id,
        type: 1, //1 紧急会议 0 普通会议
      };
      finish(message).then((res) => {
        if (res.status == 200) {
          var userAgent = navigator.userAgent;
          if (userAgent.indexOf("Firefox") != -1 || userAgent.indexOf("Chrome") != -1) {
            window.location.href = "about:blank";
            window.close();
          } else {
            window.opener = null;
            window.open("", "_self");
            window.close();
          }
          this.offDialogVisible = false;
        }
      });
    },
    // 线路弹窗事件
    lineDialogChange() {
      let message = {
        conference_id: +this.conference_id,
        terminal_id: "", // 为空，切换整个会议Ip线路，不为空切换终端ip线路
        ipv: this.lineData == "IPV4" ? 0 : 1, // 0 、为默认ipv4 1 、ipv6
      };
      change_ipv(message).then((res) => {
        if (res.status == 200) {
          this.lineDialogVisible = false;
          this.$message({
            message: "保存成功",
            type: "success",
          });
          let message2 = {
            conference_id: +this.conference_id,
            external: "",
            type: 1,
          };
          video_list(message2).then((res) => {
            this.video_listData = res.data;
            this.centerShowVideo = res.data.terminal_list;
            this.meetingStatusData = this.videoList;
            this.centerShowVideo.forEach((item, index) => {
              this.$nextTick(() => {
                let h = document.getElementsByClassName("topCenterScreen")[index].offsetHeight;
                let w = document.getElementsByClassName("topCenterScreen")[index].offsetWidth;
                item.video_size = `${w - 8}x${h - 10}`;
                item.ipv == 0 ? (this.videoSouce[index] = "IPV4") : (this.videoSouce[index] = "IPV6");
                item.iFrameUrl = `${this.page_server}/embed?s=${window.btoa(item.video_url)}&r=${window.btoa(item.video_size)}`;
                this.$forceUpdate();
              });
            });
            this.handleRedData();
          });
        }
      });
    },
    // 弹窗tabs筛选
    dialogRadioSearch(val) {
      this.nowDialogRadioSearch = val;
      this.meetingStatusData = [];
      this.terminalList1 = [];
      this.terminalListRed1 = [];
      this.localList1 = [];
      this.localListRed1 = [];
      this.fuseList1 = [];
      this.fuseListRed1 = [];
      this.monitorList1 = [];
      this.monitorListRed1 = [];
      this.videoList.forEach((item, index) => {
        switch (item.type) {
          case 0:
            if (item.status == 1) {
              this.terminalList1.push(item);
            } else {
              this.terminalListRed1.push(item);
            }
            break;
          case 1:
            if (item.status == 1) {
              this.localList1.push(item);
            } else {
              this.localListRed1.push(item);
            }

            break;
          case 2:
            if (item.status == 1) {
              this.fuseList1.push(item);
            } else {
              this.fuseListRed1.push(item);
            }

            break;
          case 3:
            if (item.status == 1) {
              this.monitorList1.push(item);
            } else {
              this.monitorListRed1.push(item);
            }
            break;
        }
      });
      this.terminalList1 = this.terminalList1.concat(this.terminalListRed1);
      this.localList1 = this.localList1.concat(this.localListRed1);
      this.fuseList1 = this.fuseList1.concat(this.fuseListRed1);
      this.monitorList1 = this.monitorList1.concat(this.monitorListRed1);
      switch (this.nowDialogRadioSearch) {
        case "终端":
          this.meetingStatusData = this.terminalList1;
          break;
        case "本地":
          this.meetingStatusData = this.localList1;
          break;
        case "融合":
          this.meetingStatusData = this.fuseList1;
          break;
        case "监控":
          this.meetingStatusData = this.monitorList1;
          break;
      }
    },
    // ROW麦克风
    rowImgShowChange(val, item, index) {
      let message = {
        conference_id: this.conference_id,
        terminal_id: item.id,
      };
      if (val == "off") {
        message.status = 1;
      } else if (val == "open") {
        message.status = 0;
      }
      mic_all(message)
        .then((res) => {
          console.log(res);
          if (res.status == 200) {
            message.status == 0 ? item.mic_status == "off" : item.mic_status == "on";
            this.imgshow = !this.imgshow;
            this.searhVideoList();
          }
        })
        .catch((error) => {
          this.$message({
            message: error.data.result,
            type: "error",
          });
        });
    },
    // ROW喇叭
    hornChange(row) {
      let message = {
        conference_id: this.conference_id,
        terminal_id: row.id,
        status: 1,
      };
      change_all_loudspeaker(message)
        .then((res) => {
          if (res.status == 200) {
            this.searhVideoList();
          }
        })
        .catch((error) => {
          this.$message({
            message: error.data.result,
            type: "error",
          });
        });
    },
    // ROW预监
    rowMonitor(row) {
      let message = {
        conference_id: this.conference_id,
        terminal_list: [],
      };
      message.terminal_list[0] = row.id.toString();
      preview(message)
        .then((res) => {
          if (res.status == 200) {
            // this.searhVideoList();
            let message0 = false;
            let message1 = false;
            let message2 = false;
            let message3 = false;
            let data = JSON.parse(JSON.stringify(row));
            let cssIndex = "";
            switch (this.nowLocaltion) {
              case "终端":
              case "终端资源":
                cssIndex = 0;
                break;
              case "本地":
              case "本地设备":
                cssIndex = 1;
                break;
              case "融合":
              case "融合通讯":
                cssIndex = 2;
                break;
              case "监控":
              case "监控资源":
                cssIndex = 3;
                break;
            }
            switch (row.type) {
              case 0:
                this.buttomTabList.terminalList.forEach((item, index) => {
                  if (item.data_id == row.data_id) {
                    message0 = true;
                  }
                });
                if (!message0) {
                  this.$nextTick(() => {
                    let w = +document.getElementsByClassName("bottomDarg")[cssIndex].offsetWidth / 5;
                    let h = document.getElementsByClassName("bottomDarg")[cssIndex].offsetHeight;
                    data.video_size = `${w - 8}x${h - 10}`;
                    data.iFrameUrl = `${this.page_server}/embed?s=${window.btoa(data.video_url)}&r=${window.btoa(data.video_size)}`;
                    this.buttomTabList.terminalList.push(data);
                    this.$forceUpdate();
                  });
                }
                break;
              case 1:
                this.buttomTabList.localList.forEach((item, index) => {
                  if (item.data_id == row.data_id) {
                    message1 = true;
                  }
                });
                if (!message1) {
                  this.$nextTick(() => {
                    let w = +document.getElementsByClassName("bottomDarg")[cssIndex].offsetWidth / 5;
                    let h = document.getElementsByClassName("bottomDarg")[cssIndex].offsetHeight;
                    data.video_size = `${w - 8}x${h - 10}`;
                    data.iFrameUrl = `${this.page_server}/embed?s=${window.btoa(data.video_url)}&r=${window.btoa(data.video_size)}`;
                    this.buttomTabList.localList.push(data);
                    this.$forceUpdate();
                  });
                }
                break;
              case 2:
                this.buttomTabList.fuseList.forEach((item, index) => {
                  if (item.data_id == row.data_id) {
                    message2 = true;
                  }
                });
                if (!message2) {
                  this.$nextTick(() => {
                    let w = +document.getElementsByClassName("bottomDarg")[cssIndex].offsetWidth / 5;
                    let h = document.getElementsByClassName("bottomDarg")[cssIndex].offsetHeight;
                    data.video_size = `${w - 8}x${h - 10}`;
                    data.iFrameUrl = `${this.page_server}/embed?s=${window.btoa(data.video_url)}&r=${window.btoa(data.video_size)}`;
                    this.buttomTabList.fuseList.push(data);
                    this.$forceUpdate();
                  });
                }
                break;
              case 3:
                this.buttomTabList.monitorList.forEach((item, index) => {
                  if (item.data_id == row.data_id) {
                    message3 = true;
                  }
                });
                if (!message3) {
                  this.$nextTick(() => {
                    let w = +document.getElementsByClassName("bottomDarg")[cssIndex].offsetWidth / 5;
                    let h = document.getElementsByClassName("bottomDarg")[cssIndex].offsetHeight;
                    data.video_size = `${w - 8}x${h - 10}`;
                    data.iFrameUrl = `${this.page_server}/embed?s=${window.btoa(data.video_url)}&r=${window.btoa(data.video_size)}`;
                    this.buttomTabList.monitorList.push(data);
                    console.log(this.buttomTabList.monitorList);
                    this.$forceUpdate();
                  });
                }
                break;
            }
          }
        })
        .catch((error) => {
          this.$message({
            message: error.data.result,
            type: "error",
          });
        });
    },
    // ROW踢出会议
    rowFinishMeeting(row) {
      let message = {
        conference_id: this.conference_id,
        terminal_id: row.id,
      };
      hangup(message)
        .then((res) => {
          if (res.status == 200) {
            this.searhVideoList();
          }
        })
        .catch((error) => {
          this.$message({
            message: error.data.result,
            type: "error",
          });
        });
    },
    // 添加临时资源
    addRowChange() {
      this.addtableData.forEach((item, index) => {
        let message = {
          data_id: null,
          parent_id: this.GetQueryString("data_id"),
          name: item.name,
          model: item.model,
          type: item.type,
          connection_identifier: item.flag,
          user_name: item.username,
          password: item.password,
        };
        add_resources(this.conference_id, message).then((res) => {
          if (res.status == 200) {
            this.addDialogVisible = false;
            this.searhVideoList();
          }
        });
      });
    },
    // 弹窗新增行
    addRow() {
      let message = {
        name: "",
        model: "",
        type: "",
        flag: "",
        username: "",
        password: "",
        listId: this.listId++,
      };
      if (this.addtableData.length == 5) {
        return this.$message({
          message: "最多设置5条",
          type: "warning",
        });
      } else {
        this.addtableData.push(message);
      }
    },
    // 弹窗删除行
    deleteRow(row) {
      this.addtableData.forEach((item, index) => {
        if (item.listId == row.listId) {
          this.addtableData.splice(index, 1);
        }
      });
    },
    // 退出弹窗
    handleClose() {
      this.offDialogVisible = false;
    },
    // 放大视频弹窗
    handleCloseSingle() {
      this.singleVideoShow = false;
    },
    // 会场状态弹窗
    handleStatusClose() {
      this.statusDialogVisible = false;
    },
    // 线路切换弹窗
    handleLineClose() {
      this.lineDialogVisible = false;
    },
    // 新增设备弹窗
    handleAddClose() {
      this.addDialogVisible = false;
    },
    // 退出弹窗
    openLogout() {
      this.offDialogVisible = true;
    },
    // 会场状态弹窗
    openStatus() {
      this.statusDialogVisible = true;
    },
    // 线路切换弹窗
    lineStatus() {
      this.lineDialogVisible = true;
    },
    // 新增设备弹窗
    addStatus() {
      this.addDialogVisible = true;
    },
    // 放大视频弹窗
    singleVideoShowCli(item, index, type) {
      if (type == "top") {
        this.singleVideoInfo = JSON.parse(JSON.stringify(this.centerShowVideo[index]));
      } else {
        switch (this.nowLocaltion) {
          case "终端":
          case "终端资源":
            this.singleVideoInfo = JSON.parse(JSON.stringify(this.buttomTabList.terminalList[index]));
            break;
          case "本地":
          case "本地设备":
            this.singleVideoInfo = JSON.parse(JSON.stringify(this.buttomTabList.localList[index]));
            break;
          case "融合":
          case "融合通讯":
            this.singleVideoInfo = JSON.parse(JSON.stringify(this.buttomTabList.fuseList[index]));
            break;
          case "监控":
          case "监控资源":
            this.singleVideoInfo = JSON.parse(JSON.stringify(this.buttomTabList.monitorList[index]));
            break;
        }
      }
      this.singleVideoInfo.video_size = `900x540`;
      this.singleVideoInfo.iFrameUrl = `${this.page_server}/embed?s=${window.btoa(this.singleVideoInfo.video_url)}&r=${window.btoa(this.singleVideoInfo.video_size)}`;
      this.singleVideoShow = true;
    },
    // 处理红色数据
    handleRedData() {
      this.terminalList = [];
      this.terminalListRed = [];
      this.localList = [];
      this.localListRed = [];
      this.fuseList = [];
      this.fuseListRed = [];
      this.monitorList = [];
      this.monitorListRed = [];
      this.videoList.forEach((item, index) => {
        switch (item.type) {
          case 0:
            if (item.status == 1) {
              this.terminalList.push(item);
            } else {
              this.terminalListRed.push(item);
            }
            break;
          case 1:
            if (item.status == 1) {
              this.localList.push(item);
            } else {
              this.localListRed.push(item);
            }
            break;
          case 2:
            if (item.status == 1) {
              this.fuseList.push(item);
            } else {
              this.fuseListRed.push(item);
            }
            break;
          case 3:
            if (item.status == 1) {
              this.monitorList.push(item);
            } else {
              this.monitorListRed.push(item);
            }
            break;
        }
      });
      this.terminalList = this.terminalList.concat(this.terminalListRed);
      this.localList = this.localList.concat(this.localListRed);
      this.fuseList = this.fuseList.concat(this.fuseListRed);
      this.monitorList = this.monitorList.concat(this.monitorListRed);
      switch (this.nowDialogRadioSearch) {
        case "终端":
          this.meetingStatusData = this.terminalList;
          break;
        case "本地":
          this.meetingStatusData = this.localList;
          break;
        case "融合":
          this.meetingStatusData = this.fuseList;
          break;
        case "监控":
          this.meetingStatusData = this.monitorList;
          break;
      }
    },
    // 表格行样式
    tableRowClassName(row) {
      if (row.row.status == 0) {
        return {
          color: "red",
        };
      } else {
        return {
          color: "#fff",
        };
      }
    },
    // 获取URL参数
    GetQueryString(name) {
      var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
      var r = window.location.search.substr(1).match(reg); //获取url中"?"符后的字符串并正则匹配
      var context = "";
      if (r != null) context = r[2];
      reg = null;
      r = null;
      return context == null || context == "" || context == "undefined" ? "" : context;
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
    // 获取会议信息
    do_EventCenter_getMettingInfo(value) {
      console.log("----->", value);
      this.data_id = value.data_id;
      if (value.mettingID) {
        this.conference_id = value.mettingID;
        this.searhVideoList();
        this.windowLayout();
      } else {
        creatMetting(value.data_id).then((res) => {
          this.conference_id = res.data.conference_id;
          this.searhVideoList();
          this.windowLayout();
        });
      }
    },
  },
  destroyed() {
    window.componentCenter?.removeInstance(this.customConfig?.componentId);
  },
};
</script>
<style lang="less" scoped>
.main {
  width: 100%;
  display: flex;
  flex-direction: column;
  justify-content: space-around;
  background-color: rgba(0, 21, 41, 1);
}
.videoGreen {
  color: #13ce66 !important;
}
.screenNum {
  position: absolute;
  left: 16.1%;
  top: 2.7%;
  /deep/.el-radio-button__inner {
    padding: 5px 5px;
    color: #ffffff;
    border: 0px;
    border-radius: 0;
    background: transparent;
  }
  /deep/.is-active {
    .el-radio-button__inner {
      background: #409eff;
    }
  }
}
.templateChoose {
  position: absolute;
  top: 2.6%;
  right: 6.5%;
  /deep/.el-select {
    width: 100px;
  }
  /deep/.el-input__suffix {
    top: 3px;
  }
  /deep/.el-input__inner {
    height: 22px;
    line-height: 22px;
    border-radius: 3px;
    top: 3px;
    padding-right: 0px;
  }
}
.videoRed {
  color: #ff4949 !important;
}
.addressSpan {
  color: #ffffff;
  font-size: 22px;
  font-weight: 700;
  margin-left: 0.5%;
}
.mainTop {
  height: 63%;
  width: 100%;
  display: flex;
  justify-content: space-around;
  .topLeft {
    border: 3.5px solid #2062a0;
    height: 100%;
    width: 15.5%;
    position: relative;
    background-color: #113164;
    /deep/.el-tabs__item {
      padding: 0 10px !important;
    }
    /deep/.el-tabs__content,
    .el-tabs {
      height: 90%;
    }
    .tabLable {
      display: flex;
      justify-content: space-between;
      // overflow: scroll;
      height: 100%;
      overflow-x: hidden;
      /*滚动条样式*/
      &::-webkit-scrollbar {
        width: 4px;
        height: 4px;
      }
      &::-webkit-scrollbar-thumb {
        border-radius: 10px;
        box-shadow: inset 0 0 5px rgba(250, 250, 250, 1);
        background: rgba(0, 0, 0, 0.2);
      }
      &::-webkit-scrollbar-track {
        box-shadow: inset 0 0 5px rgba(0, 0, 0, 0.2);
        border-radius: 0;
        background: rgba(0, 0, 0, 0.1);
      }
      .checkboxItem {
        display: flex;
        justify-content: space-between;
        .checkboxItemIcon {
          display: flex;
          justify-content: space-between;
        }
      }
    }
    .refreshIcon {
      position: absolute;
      top: 6px;
      right: 10px;
      font-size: 24px;
      cursor: pointer;
      color: #ffffff;
    }
    .advance {
      height: 10%;
      width: 100%;
      display: flex;
      justify-content: center;
      /deep/.el-button {
        width: 160px;
        height: 40px;
        color: #ffffff;
        border: 0px rgba(80, 115, 237, 0.580392156862745);
        background-color: rgba(80, 115, 237, 0.580392156862745);
        &:hover {
          border-color: rgba(59, 96, 229, 1);
          background-color: rgba(59, 96, 229, 1);
        }
      }
    }
    /deep/ .el-tabs__header {
      border: 0px;
    }
    /deep/.el-tabs__item {
      border-color: #2062a0;
      border-bottom-width: 0px;
      color: #ffffff;
      height: 30px;
      line-height: 30px;
      padding: 0 10px;
    }
    /deep/ .el-tabs__nav {
      border-radius: 0px;
      border-color: #2062a0;
      border-top: 0px;
      border-right-color: #2062a0;
      border-left: 0;
      border-bottom: 1px solid #2062a0;
    }
    /deep/.el-checkbox-group {
      display: flex;
      flex-direction: column;
      width: 100%;
    }
    /deep/.el-checkbox {
      margin-left: 10px;
      margin-bottom: 27px;
      // margin-top: 5px;
      line-height: 22px;
      width: 60%;
      span {
        margin-right: 5px;
        margin-top: -2px;
      }
    }
    /deep/.is-active {
      background-color: #5073ed;
    }
    /deep/.el-checkbox__label {
      color: #ffffff;
    }
  }
  .topCenter {
    border: 3.5px solid #2062a0;
    height: 100%;
    width: 77%;
    position: relative;
    // display: flex;
    // flex-direction: column;
    // justify-content: space-between;

    .topCenterScreen {
      .micIcon {
        position: absolute;
        right: 0;
        bottom: 0;
        cursor: pointer;
      }
      .agreement {
        position: absolute;
        left: 0;
        bottom: 0;
        color: #ffffff;
        font-size: 22px;
        font-weight: 700;
      }
      /deep/.el-input__inner {
        border: 0px;
        width: 100px;
        line-height: 22px;
        font-size: 20px;
        padding: 0;
        color: #ffffff !important;
        background: transparent;
        &::placeholder {
          color: #ffffff !important;
        }
      }

      /deep/.el-input__suffix {
        display: none;
      }
    }
  }
  .monitorbBottom {
    height: 36.6%;
    display: flex;
    justify-content: space-between;
    div {
      width: 24.8%;
      height: 100%;
      background: #7d7d7d;
      .mainImg {
        width: 100%;
        height: 100%;
      }
    }
  }
  .topRight {
    border: 3.5px solid #2062a0;
    height: 100%;
    width: 6%;

    div {
      display: flex;
      height: 60px;
      justify-content: center;
      margin-top: 15px;
      &:first-child {
        border-bottom: 1px solid #ffffff;
      }
    }

    img {
      width: 45px;
      height: 45px;
      cursor: pointer;
    }
  }
}
.mainBottom {
  margin-top: 0.5%;
  height: 29.5%;
  box-sizing: border-box;
  width: 99%;
  margin-left: 0.5%;
  border: 3.5px solid #2062a0;
  /deep/ .el-tabs__header {
    border: 0px;
    margin: 0px;
  }
  /deep/ .el-tabs__nav {
    border: 0px;
    padding-left: 100px;
  }
  /deep/ .el-tab-pane,
  .el-tabs {
    height: 100%;
  }
  /deep/ .el-tabs__content {
    height: calc(100% - 40px);
  }
  /deep/.el-tabs__item {
    border-color: #2062a0;
    border-bottom-width: 0px;
    color: #ffffff;
    border: 0px;
  }
  /deep/.is-active {
    background-color: #5073ed;
  }
  /deep/.el-carousel--horizontal {
    height: 100%;
    width: 100%;
  }
  /deep/.el-carousel__container {
    height: 90%;
    width: 100%;
    overflow: hidden;
    margin-left: 0%;
  }
  .arrowBox,
  .arrowBoxRight {
    height: 60%;
    width: 40px;
    margin-top: 30px;
    background: #0f264d;
    cursor: pointer;

    img {
      margin-top: 40%;
      margin-left: 20%;
      height: 70%;
      width: 20px;
      cursor: pointer;
    }
  }
  .arrowBoxRight {
    transform: rotateY(180deg);
  }
  /deep/.el-carousel__item {
    width: 100%;
    background-color: #7d7d7d !important;
    display: flex;
    // justify-content: space-around;
  }
  .carouselItem {
    height: 100%;
    width: 19.9%;
    position: relative;
    img {
      height: 100%;
      width: 100%;
    }
    .closeBox {
      position: absolute;
      top: 0;
      right: 0;
      cursor: pointer;
      width: 20px;
      height: 20px;
      background: #ffffff;
      border-radius: 4px;
      line-height: 17px;
      font-size: 20px;
      text-align: center;
      font-weight: 700;
    }
  }
  .tabPane {
    display: flex;
    background-color: #7d7d7d !important;
    width: 100%;
  }
}

/deep/.el-radio {
  margin-bottom: 20px;
}
/deep/.el-dialog {
  border: 0px solid #2062a0 !important;
  background: transparent !important;
  .el-dialog__body {
    padding: 0;
  }
  .el-dialog__header {
    border-bottom: 1px solid #ffffff;
  }
  .el-dialog__title {
    background: transparent;
    color: #ffffff;
  }
  .el-dialog__close,
  .el-dialog__body {
    color: #ffffff;
  }
  .el-radio__label {
    color: #ffffff;
  }
}
.meetingStatus {
  .dialogX {
    position: relative;
    left: 98%;
    top: 25px;
    font-size: 22px;
    cursor: pointer;
  }
  /deep/.el-dialog {
    border: 0px solid #2062a0 !important;
    background: transparent !important;
    .el-dialog__body {
      padding: 0;
    }
    .el-dialog__header {
      // display: none;
      background: #001529;
      border-color: #ffffff;
      color: #ffffff;
    }
    .el-dialog__title {
      background: transparent;
    }
    .el-dialog__close,
    .el-dialog__body {
      color: #ffffff;
    }
    .el-radio__label {
      color: #ffffff;
    }
  }
  /deep/.el-dialog__wrapper {
    left: 15%;
    top: 10%;
  }
  // 会议整体
  .metting_all {
    width: 100%;
    height: 100%;
    background: #001529;
    border-radius: 10px;
    border-top-left-radius: 20px;
    box-sizing: border-box;
    z-index: -1;
  }
  // 会议位置标题
  .metting_title {
    width: 100%;
    position: absolute;
    top: 8px;
    color: #ffffff;
    font-size: 21px;
  }
  // 退出标题
  .metting_title img {
    position: absolute;
    right: 1%;
    top: 3px;
    width: 26px;
    height: 26px;
  }
  // 会议
  .metting {
    width: 100%;
    height: 100%;
    box-sizing: border-box;
  }
  // 会议上侧
  .metting_top {
    width: 100%;
    height: 70%;
    display: flex;
    justify-content: center;
    align-items: center;
    // 左侧表格
    .metting_table {
      width: 100%;
      height: 100%;
      border-radius: 15px;
      border-bottom: 1px solid #2062a0;
      border-top-left-radius: 20px;
    }
    // 表格标题
    .table_title {
      margin-left: -3px;
      background: url("../pluginTemp/images/bg_title@2x.png") no-repeat;
      color: #ffffff;
      height: 35px;
      line-height: 35px;
      width: 70%;
      font-size: 15px;
      padding-left: 20px;
      box-sizing: border-box;
      display: flex;
      align-items: center;
    }
    .table_title img:first-child {
      margin: 3px 4px 0 -4px;
      width: 28px;
      height: 28px;
    }
    .table_img img {
      cursor: pointer;
      margin-top: 7px;
      width: 26px;
      height: 26px;
    }
    // 单选
    .radio_search {
      padding-left: 20px;
      padding-bottom: 10px;
    }
    // 单选框样式
    /deep/ .el-radio-button__inner {
      color: #ffffff;
      border-color: #00a6d3;
      background: #001529;
    }
    /deep/ .el-radio-group .is-active .el-radio-button__inner {
      color: #00a6d3;
    }
    // 搜索
    .metting_search {
      display: flex;
      justify-content: center;
      align-items: center;
      padding: 10px 0 10px 20px;
      width: 28%;
      /deep/ .el-button {
        margin: 0;
        height: 35px;
        line-height: 35px;
        border-radius: 0;
        padding: 0 15px;
        background: #032037;
        border-color: #014e70;
        color: #00b8e2;
      }
    }
    // 单选
    .radio_search {
      padding-left: 20px;
      padding-bottom: 10px;
    }
    // 单选框样式
    /deep/ .el-radio-button__inner {
      color: #ffffff;
      border-color: #00a6d3;
      background: #001529;
    }
    /deep/ .el-radio-group .is-active .el-radio-button__inner {
      color: #00a6d3;
    }
    // 搜索框样式
    /deep/ .el-input__inner {
      height: 35px;
      border-radius: 0;
      background: #04162e;
      border-color: #024b6b;
    }
    // Table样式配置
    /deep/ .el-table {
      width: 100%;
      height: 100%;
      background: none;
    }
    /deep/ .el-table tr {
      background: none;
    }
    /deep/ .metting_table ::before {
      height: 0;
    }
    /deep/ .el-table__header .cell {
      color: #1985e1;
    }
    /deep/ .el-table tbody tr:hover > td {
      background: #171f34 !important;
    }
    /deep/ .el-table td.el-table__cell,
    .el-table th.el-table__cell.is-leaf {
      border-bottom: 1px solid #013153;
    }
    /deep/ .gutter {
      background: rgb(1, 38, 65);
    }
    // 滚动条样式
    /deep/ .el-table__body-wrapper::-webkit-scrollbar {
      width: 0;
    }
    // 工具栏标题
    .tool_title {
      background: url("../pluginTemp/images/bg_title.png") no-repeat;
      color: #ffffff;
      height: 30px;
      line-height: 30px;
      width: 100%;
      font-size: 15px;
      padding-left: 20px;
      box-sizing: border-box;
      display: flex;
      align-items: center;
    }
    .tool_title img:first-child {
      margin: 3px 4px 0 -15px;
      width: 28px;
      height: 28px;
    }
  }
}
.leaceMeetingDialog,
.switchLine {
  /deep/.el-dialog {
    background: #171f34 !important;
    border-radius: 5px !important;
  }
  /deep/.el-dialog__wrapper {
    left: 15%;
    top: 10%;
  }
  /deep/.el-dialog__header {
    display: block;
    span {
      color: #ffffff;
    }
  }
  /deep/.el-dialog__body {
    padding: 30px 20px !important;
  }
}
.temporaryAdd {
  // 表格标题
  .table_title {
    margin-left: -21px;
    background: url("../pluginTemp/images/bg_title@2x.png") no-repeat;
    color: #ffffff;
    height: 35px;
    line-height: 35px;
    width: 70%;
    font-size: 15px;
    padding-left: 20px;
    box-sizing: border-box;
    display: flex;
    align-items: center;
    margin-top: -28px;
    margin-bottom: 20px;
  }
  .table_title img:first-child {
    margin: 3px 4px 0 -4px;
    width: 28px;
    height: 28px;
  }
  .table_img img {
    cursor: pointer;
    margin-top: 7px;
    width: 26px;
    height: 26px;
  }
  /deep/.el-table__cell {
    background: #171f34;
    .cell {
      border: 0px;
    }
  }
  /deep/.el-input__inner {
    background: #001529;
    border-color: #014e70;
    color: #ffffff;
  }
  /deep/.is-scrolling-none {
    background: #171f34 !important;
  }
  /deep/.el-table--border {
    border: 0px;
  }
  /deep/.el-dialog {
    background: #171f34 !important;
    border-radius: 5px !important;
    border-bottom: 1px solid #2062a0 !important;
  }
  /deep/.el-dialog__body {
    padding: 0px 20px 0px 20px !important;
  }
  /deep/.el-table--enable-row-hover .el-table__body tr:hover > td {
    /*更改鼠标悬停时表格高亮色*/
    background-color: #171f34 !important;
  }
  /deep/.el-table__empty-block {
    background: #171f34;
    span {
      color: #ffffff;
    }
    color: #ffffff;
  }
}
.addRow {
  width: 100% !important;
  border-top: 0px !important;
  border-radius: 0px !important;
}
.singleVideoDialogHeight {
  height: 550px !important;
  margin-top: -20px;
}
@font-face {
  font-family: "iconfont";
  src: url("iconfont.woff2?t=1659519918538") format("woff2"), url("iconfont.woff?t=1659519918538") format("woff"), url("iconfont.ttf?t=1659519918538") format("truetype");
}
.iconfont {
  font-family: "iconfont" !important;
  font-size: 30px;
  font-weight: 700;
  font-style: normal;
  cursor: pointer;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}
.bottomDarg {
  width: 100%;
  display: flex;
}
</style>
