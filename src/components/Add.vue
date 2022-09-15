<template>
  <div>
    <!-- <div class="planName">
      <span>预案名称:</span>
      <el-input v-model="mainFromData.event_name"></el-input>
    </div>
    <div class="meetingName">
      <span>所属会议室:</span>
      <el-Select v-model="mainFromData.meeting_room" @change="changeMeeting" value-key="data_id">
        <el-option v-for="item in td_conference_room_maintenanceData" :key="item.data_id" :label="item.meeting_room" :value="item.data_id">{{ item.meeting_room }} </el-option>
      </el-Select>
    </div> -->
    <div class="inputArea" v-for="(item, index) in mainFromMeetingEquipment_nameData" :key="index">
      <span class="redNum">{{ item.equipment_name }}：</span>
      <div class="screenLayout">
        <span>屏幕布局:</span>
        <el-Select v-model="item.td_screen_distribution_templateData" @change="changeLayout($event, item)" value-key="data_id">
          <el-option v-for="itemSon in td_screen_distribution_templateOption" :key="itemSon.data_id" :label="itemSon.template_name" :value="itemSon">{{
            itemSon.template_name
          }}</el-option>
        </el-Select>
      </div>
      <div class="numberScreen" v-for="(itemSon2, itemIndex2) in item.split_screenData" :key="itemIndex2">
        <span>{{ itemSon2.layout_name }}:</span>
        <el-input v-model="itemSon2.layout_parameter" @input="inputChange"></el-input>
      </div>
    </div>
  </div>
</template>

<script>
import eventActionDefine from "./msgCompConfig";
import { queryAssetById } from "../api/asset";
export default {
  name: "Add",
  props: {
    customConfig: Object,
  },
  data() {
    return {
      data: this.customConfig.data,
      assetsId: JSON.parse(this.customConfig.configuration),
      propsConfiguration: this.customConfig.configuration || "{}",
      configuration: {},
      mainFromData: {
      },
      td_conference_room_maintenanceData: [],
      mainFromMeetingEquipment_nameData: this.customConfig.data ? JSON.parse(this.customConfig.data) : [],
      conference_room_maintenance_childData: [],
      td_event_plans_equipment_childData: [],
      td_event_plans_parameter_childData: [],
      td_screen_distribution_templateOption: [],
    };
  },
  mounted() {
    // let td_event_plans = "9b7be334-b18c-f552-1bf0-829aff0a4db2";
    // queryAssetById(td_event_plans).then((res) => {
    //   this.mainFromData = this.translatePlatformDataToJsonArray(res)[0];
    // });
    console.log(this.customConfig);
    let td_conference_room_maintenance = this.assetsId.td_conference_room_maintenance ? this.assetsId.td_conference_room_maintenance : "067fd409-509b-40f3-bf47-a004c04bf32c";
    queryAssetById(td_conference_room_maintenance).then((res) => {
      this.td_conference_room_maintenanceData = this.translatePlatformDataToJsonArray(res);
    });
    let td_screen_distribution_template = this.assetsId.td_screen_distribution_template ? this.assetsId.td_screen_distribution_template : "5a758994-0b94-5a29-a8a8-60ad55b8c4dd";
    queryAssetById(td_screen_distribution_template).then((res) => {
      this.td_screen_distribution_templateOption = this.translatePlatformDataToJsonArray(res);
      // console.log(this.td_screen_distribution_templateOption, "------------------>td_screen_distribution_templateOption");
    });
    // let td_event_plans_parameter_child = this.assetsId.td_event_plans_parameter_child ? this.assetsId.td_event_plans_parameter_child : "f9a58c38-5946-7acb-70dc-e2414e88c2bf";
    // queryAssetById(td_event_plans_parameter_child).then((res) => {
    //   this.td_event_plans_parameter_childData = this.translatePlatformDataToJsonArray(res);
    //   // console.log(this.td_event_plans_parameter_childData, "------------------>td_event_plans_parameter_childData");
    // });
    // let td_event_plans_equipment_child = this.assetsId.td_event_plans_equipment_child ? this.assetsId.td_event_plans_equipment_child : "a42bfa2e-d69a-cba5-5d2b-43b9e533beb7";
    // queryAssetById(td_event_plans_equipment_child).then((res) => {
    //   this.td_event_plans_equipment_childData = this.translatePlatformDataToJsonArray(res);
      // console.log(this.td_event_plans_equipment_childData, "------------------>td_event_plans_equipment_childData");
      let td_conference_room_maintenance_child = this.assetsId.td_conference_room_maintenance_child
        ? this.assetsId.td_conference_room_maintenance_child
        : "b72f598b-b4d2-202d-f2ad-24090e107e36";
      queryAssetById(td_conference_room_maintenance_child).then((res) => {
        this.td_conference_room_maintenance_childData = this.translatePlatformDataToJsonArray(res);
        this.td_conference_room_maintenance_childData.forEach((item, index) => {
          if (item.parent_id == this.mainFromData.meeting_room && item.equipment_name.indexOf('屏') != -1) {
            console.log(item);

            // this.td_event_plans_equipment_childData.forEach((itemSon, indexSon) => {
            //   if (item.equipment_name == itemSon.equipment_name) {
            //     item.td_screen_distribution_templateData = itemSon.screen_layout;
            //     item.split_screenData = [];
            //     this.td_event_plans_parameter_childData.forEach((itemSon2, indexSon2) => {
            //       if (itemSon2.parent_id == itemSon.data_id) {
            //         item.split_screenData.push(itemSon2);
            //       }
            //     });
            //   }
            // });
            this.mainFromMeetingEquipment_nameData.push(item);
          }
        });
      // });
      // console.log(this.td_conference_room_maintenance_childData, "------------>td_conference_room_maintenance_childData");
      console.log(this.mainFromMeetingEquipment_nameData, "------------>mainFromMeetingEquipment_nameData");
    });
    window?.componentCenter?.register(this.customConfig.componentId, "comp", this, eventActionDefine);
    try {
      this.configuration = JSON.parse(this.propsConfiguration);
    } catch (error) {
      console.error("configuration解析错误", error);
    }
  },
  methods: {
    // changeMeeting(val) {
    //   this.mainFromMeetingEquipment_nameData = [];
    //   this.td_conference_room_maintenance_childData.forEach((item, index) => {
    //     if (item.parent_id == this.mainFromData.meeting_room) {
    //       this.td_event_plans_equipment_childData.forEach((itemSon, indexSon) => {
    //         if (item.equipment_name == itemSon.equipment_name) {
    //           item.td_screen_distribution_templateData = itemSon.screen_layout;
    //           item.split_screenData = [];
    //           this.td_event_plans_parameter_childData.forEach((itemSon2, indexSon2) => {
    //             if (itemSon2.parent_id == itemSon.data_id) {
    //               item.split_screenData.push(itemSon2);
    //             }
    //           });
    //         }
    //       });
    //       this.mainFromMeetingEquipment_nameData.push(item);
    //     }
    //   });
    //   console.log(this.mainFromMeetingEquipment_nameData);
    // },

    changeLayout(val, row) {
      console.log(val, row);
      row.split_screenData = [];
   
      for (let k = 0; k < val.split_screen_number; k++) {
        let message = {
        layout_parameter: "",
        layout_name: "",
      };
        message. layout_name= "第" + this.toChinesNum(k+1)+'屏'
        row.split_screenData.push(message);
      }
      console.log(row);
      // this.td_event_plans_equipment_childData.forEach((item, index) => {
      //   if (item.screen_layout == val) {
      //     this.td_event_plans_parameter_childData.forEach((itemSon, indexSon) => {
      //       if (item.data_id == itemSon.parent_id) {
      //         row.split_screenData.push(itemSon);
      //       }
      //     });
      //   }
      // });
      this.inputChange();
      // console.log(JSON.stringify(this.mainFromMeetingEquipment_nameData));
      this.$forceUpdate();
    },
    async inputChange(e) {
      this.$forceUpdate();
      console.log(this.mainFromMeetingEquipment_nameData, 156, 156156);
      this.data = JSON.stringify(this.mainFromMeetingEquipment_nameData);
      let { formConfig, component, onChange } = this.customConfig;
      await window.eventCenter.triggerEventNew({
        objectId: formConfig?.id,
        componentId: component.id,
        type: "report",
        event: "change",
        payload: {
          value: JSON.stringify(this.mainFromMeetingEquipment_nameData),
        },
      });
      onChange(JSON.stringify(this.mainFromMeetingEquipment_nameData));
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
    Event_Center_getName() {
      let { formConfig, component } = this.customConfig;
      return `${formConfig?.form_name}-${component.columnStyle.title}`;
    },
    toChinesNum(num) {
      let changeNum = ["零", "一", "二", "三", "四", "五", "六", "七", "八", "九"];
      let unit = ["", "十", "百", "千", "万"];
      num = parseInt(num);
      let getWan = (temp) => {
        let strArr = temp.toString().split("").reverse();
        let newNum = "";
        let newArr = [];
        strArr.forEach((item, index) => {
          newArr.unshift(item === "0" ? changeNum[item] : changeNum[item] + unit[index]);
        });
        let numArr = [];
        newArr.forEach((m, n) => {
          if (m !== "零") numArr.push(n);
        });
        if (newArr.length > 1) {
          newArr.forEach((m, n) => {
            if (newArr[newArr.length - 1] === "零") {
              if (n <= numArr[numArr.length - 1]) {
                newNum += m;
              }
            } else {
              newNum += m;
            }
          });
        } else {
          newNum = newArr[0];
        }
        return newNum;
      };
      let overWan = Math.floor(num / 10000);
      let noWan = num % 10000;
      if (noWan.toString().length < 4) {
        noWan = "0" + noWan;
      }
      return overWan ? getWan(overWan) + "万" + getWan(noWan) : getWan(num);
    },
    do_EventCenter_setMeeting_room(value) {
      console.log(value, 180180180180);
      this.mainFromData.meeting_room = value.value;
      this.mainFromMeetingEquipment_nameData = [];
      this.td_conference_room_maintenance_childData.forEach((item, index) => {
        if (item.parent_id == this.mainFromData.meeting_room&& item.equipment_name.indexOf('屏') != -1) {
          // this.td_event_plans_equipment_childData.forEach((itemSon, indexSon) => {
          //   if (item.equipment_name == itemSon.equipment_name) {
          //     item.td_screen_distribution_templateData = itemSon.screen_layout;
          //     item.split_screenData = [];
          //     this.td_event_plans_parameter_childData.forEach((itemSon2, indexSon2) => {
          //       if (itemSon2.parent_id == itemSon.data_id) {
          //         item.split_screenData.push(itemSon2);
          //       }
          //     });
          //   }
          // });
          this.mainFromMeetingEquipment_nameData.push(item);
        }
      });
      this.inputChange();
      // console.log(this.mainFromMeetingEquipment_nameData);
    },
    // do_EventCenter_setEvent_name(value) {
    //   console.log(value, 183183183183);
    // },
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
.planName {
  display: flex;
  margin-top: 15px;
  span {
    width: 100px;
    line-height: 40px;
  }
  .el-input {
    width: 350px;
  }
}
.meetingName {
  display: flex;
  margin-top: 15px;

  span {
    width: 100px;
    line-height: 40px;
  }
  .el-select {
    width: 350px;
  }
}
.inputArea {
  margin-bottom: 30px;
}
.redNum {
  color: red;
  width: 100px;
}
.screenLayout {
  display: flex;
  margin-top: 15px;
  span {
    width: 100px;
    line-height: 40px;
  }
  .el-select,
  .el-input {
    width: 350px;
  }
}
.numberScreen {
  display: flex;
  margin-top: 15px;
  span {
    width: 100px;
    line-height: 40px;
  }
  .el-select,
  .el-input {
    width: 350px;
  }
}
</style>
