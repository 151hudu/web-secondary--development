<template>
  <div>
    <img src="../../pluginTemp/images/set.png" alt="" />
  </div>
</template>

<script>
import eventActionDefine from "./msgCompConfig";
import { queryAssetById } from "../api/asset";
export default {
  name: "Set",
  props: {
    customConfig: Object,
  },
  data() {
    return {
      data: this.customConfig.data,
      planName: "",
      mainFromData: {},
      td_conference_room_maintenanceData: [],
      mainFromMeetingEquipment_nameData: [],
      conference_room_maintenance_childData: [],
      td_event_plans_equipment_childData: [],
      td_event_plans_parameter_childData: [],
      td_screen_distribution_templateOption: [],
    };
  },
  mounted() {
    // console.log(this.customConfig);
    // let td_event_plans = "b48bcc99-9a62-4f23-1c7b-88dae94dbc90";
    // queryAssetById(td_event_plans).then((res) => {
    //   this.mainFromData = this.translatePlatformDataToJsonArray(res)[0];
    // });
    // let td_conference_room_maintenance = "067fd409-509b-40f3-bf47-a004c04bf32c";
    // queryAssetById(td_conference_room_maintenance).then((res) => {
    //   this.td_conference_room_maintenanceData = this.translatePlatformDataToJsonArray(res);
    // });
    // let td_screen_distribution_template = "5a758994-0b94-5a29-a8a8-60ad55b8c4dd";
    // queryAssetById(td_screen_distribution_template).then((res) => {
    //   this.td_screen_distribution_templateOption = this.translatePlatformDataToJsonArray(res);
    //   // console.log(this.td_screen_distribution_templateOption, "------------------>td_screen_distribution_templateOption");
    // });
    // let td_event_plans_parameter_child = "f9a58c38-5946-7acb-70dc-e2414e88c2bf";
    // queryAssetById(td_event_plans_parameter_child).then((res) => {
    //   this.td_event_plans_parameter_childData = this.translatePlatformDataToJsonArray(res);
    //   // console.log(this.td_event_plans_parameter_childData, "------------------>td_event_plans_parameter_childData");
    // });
    // let td_event_plans_equipment_child = "a42bfa2e-d69a-cba5-5d2b-43b9e533beb7";
    // queryAssetById(td_event_plans_equipment_child).then((res) => {
    //   this.td_event_plans_equipment_childData = this.translatePlatformDataToJsonArray(res);
    //   // console.log(this.td_event_plans_equipment_childData, "------------------>td_event_plans_equipment_childData");
    //   let td_conference_room_maintenance_child = "b72f598b-b4d2-202d-f2ad-24090e107e36";
    //   queryAssetById(td_conference_room_maintenance_child).then((res) => {
    //     this.td_conference_room_maintenance_childData = this.translatePlatformDataToJsonArray(res);
    //     this.td_conference_room_maintenance_childData.forEach((item, index) => {
    //       if (item.parent_id == this.mainFromData.meeting_room) {
    //         this.td_event_plans_equipment_childData.forEach((itemSon, indexSon) => {
    //           if (item.equipment_name == itemSon.equipment_name) {
    //             item.td_screen_distribution_templateData = itemSon.screen_layout;
    //             item.split_screenData = [];
    //             this.td_event_plans_parameter_childData.forEach((itemSon2, indexSon2) => {
    //               if (itemSon2.parent_id == itemSon.data_id) {
    //                 item.split_screenData.push(itemSon2);
    //               }
    //             });
    //           }
    //         });
    //         this.mainFromMeetingEquipment_nameData.push(item);
    //       }
    //     });
    //   });

    //   console.log(this.td_conference_room_maintenance_childData, "------------>td_conference_room_maintenance_childData");
    //   console.log(this.mainFromMeetingEquipment_nameData, "------------>mainFromMeetingEquipment_nameData");
    // });
    let { component, child_id, index } = this.customConfig;
    let initId = component.id;
    if (child_id) {
      initId = `${initId}__childId__${child_id.substr(0, 10)}`;
    }
    if (index > -1) {
      initId = `${initId}__index__${index}`;
    }
    window?.componentCenter?.register(initId, "comp", this, eventActionDefine);
  },
  methods: {
    changeMeeting(val) {
      this.mainFromMeetingEquipment_nameData = [];
      this.td_conference_room_maintenance_childData.forEach((item, index) => {
        if (item.parent_id == this.mainFromData.meeting_room) {
          this.td_event_plans_equipment_childData.forEach((itemSon, indexSon) => {
            if (item.equipment_name == itemSon.equipment_name) {
              item.td_screen_distribution_templateData = itemSon.screen_layout;
              item.split_screenData = [];
              this.td_event_plans_parameter_childData.forEach((itemSon2, indexSon2) => {
                if (itemSon2.parent_id == itemSon.data_id) {
                  item.split_screenData.push(itemSon2);
                }
              });
            }
          });
          this.mainFromMeetingEquipment_nameData.push(item);
        }
      });
      console.log(JSON.stringify(this.mainFromMeetingEquipment_nameData));
    },

    changeLayout(val, row) {
      row.split_screenData = [];
      this.td_event_plans_equipment_childData.forEach((item, index) => {
        if (item.screen_layout == val) {
          this.td_event_plans_parameter_childData.forEach((itemSon, indexSon) => {
            if (item.data_id == itemSon.parent_id) {
              row.split_screenData.push(itemSon);
            }
          });
        }
      });
      console.log(JSON.stringify(this.mainFromMeetingEquipment_nameData));
      this.$forceUpdate();
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
  },

  destroyed() {
    let { component, child_id, index } = this.customConfig;
    let initId = component.id;
    if (child_id) {
      initId = `${initId}__childId__${child_id.substr(0, 10)}`;
    }
    if (index > -1) {
      initId = `${initId}__index__${index}`;
    }
    window?.componentCenter?.removeInstance(initId);
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
  margin-top: 30px;
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
<!-- 主表：td_event_plans
td_event_plans.event_name表单中手动输入

td_event_plans.meeting_room 手动选择存储td_conference_room_maintenance.data_id，展示td_conference_room_maintenance.meeting_room

td_event_plans.screen_number 是（td_conference_room_maintenance_child中parent_id=td_conference_room_maintenance.data_id的数据量）

子表：td_event_plans_equipment_child.parent_id=td_event_plans.data_id
td_event_plans_equipment_child.equipment_name默认带出多条数据：（td_conference_room_maintenance_child中parent_id=td_conference_room_maintenance.data_id的equipment_name字段）

td_event_plans_equipment_child.screen_layout手动选择存储td_screen_distribution_template.data_id，显示：td_screen_distribution_template.template_name字段

孙表：td_event_plans_parameter_child.parent_id=td_event_plans_equipment_child.data_id
td_event_plans_parameter_child的行数是td_event_plans_equipment_child表的split_screen_number

screen_num从“第一屏”到“第split_screen_number屏”（其中split_screen_number需转为中文）

layout_parameter字段手动输入 -->
