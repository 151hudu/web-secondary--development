<template>
  <div class="inverter_parent">
    <span class="inverter_button" @click="dialogVisible = true"> {{ configuration.placeholder }}</span>
    <el-dialog class="inverter_dialog" :title="configuration.placeholder" :visible.sync="dialogVisible"
      :append-to-body="true">
      <div class="isBorder_Table" v-loading="loading" v-if="isBorder">
        <div class="isBorder_true" v-for="(item, index) in  tableData" :key="index">
          <el-table :data="item" style="width: 100%" border class="goBeyondTable"
            :header-row-style="{ color: '#5e605f', fontSize: '16px', fontWeight: '700' }"
            :header-cell-style="{ padding: '0px 0 1px 0' }" :cell-style="{ padding: 0 + 'px', color: '#5e605f' }">
            <el-table-column :prop="configuration.loopPV" :label="configuration.column[1]" width="100" align="center">
            </el-table-column>
            <el-table-column :prop="configuration.state" :label="configuration.column[2]" width="100" align="center">
              <template slot-scope="scope">
                <el-select size="small" v-model="scope.row[configuration.state]"
                  @change="ValueChange(scope.$index, scope.row[configuration.state], index)" placeholder="请选择">
                  <el-option :key="452" label="OFF" :value="0"></el-option>
                  <el-option :key="2452" label="ON" :value="1"></el-option>
                </el-select>
              </template>
            </el-table-column>
            <el-table-column :prop="configuration.capacity" :label="configuration.column[3]" width="200" align="center">
              <template slot-scope="scope">
                <div class="capacityTable" v-if="scope.row[configuration.state]">
                  <div class="capacityInput">
                    <input v-model="scope.row[configuration.capacity]" @focus="focusFn" @blur="blurFn" />
                    <div class="capacityButton">
                      <button @click="scope.row[configuration.capacity]++"><i class="el-icon-arrow-up"></i></button>
                      <button @click="scope.row[configuration.capacity]--"><i class="el-icon-arrow-down"></i></button>
                    </div>
                  </div>

                  <div style="fontSize: 16px;width: 52px;">kWp</div>
                </div>

                <div v-else></div>
              </template>
            </el-table-column>
          </el-table>
        </div>
      </div>
      <el-table v-else v-loading="loading" :data="tableData" style="width: 100%" class="goBeyondTableWu"
        :header-row-style="{ color: '#5e605f', fontSize: '16px', fontWeight: '700' }"
        :header-cell-style="{ padding: '0px 0 1px 0' }" :cell-style="{ padding: 0 + 'px', color: '#5e605f' }">
        <el-table-column :prop="configuration.loopPV" :label="configuration.column[1]" width="138" align="center">
        </el-table-column>
        <el-table-column :prop="configuration.state" :label="configuration.column[2]" width="138" align="center">
          <template slot-scope="scope">
            <el-select size="small" v-model="scope.row[configuration.state]" @change="ValueChange()" placeholder="请选择">
              <el-option :key="452" label="OFF" :value="0"></el-option>
              <el-option :key="2452" label="ON" :value="1"></el-option>
            </el-select>
          </template>
        </el-table-column>
        <el-table-column :prop="configuration.capacity" :label="configuration.column[3]" width="276" align="center">
          <template slot-scope="scope">
            <div class="capacityTable capacityTable2" v-if="scope.row[configuration.state]">
              <div class="capacityInput">
                <input v-model="scope.row[configuration.capacity]" @focus="focusFn" @blur="blurFn" />
                <div class="capacityButton">
                  <button @click="scope.row[configuration.capacity]++"><i class="el-icon-arrow-up"></i></button>
                  <button @click="scope.row[configuration.capacity]--"><i class="el-icon-arrow-down"></i></button>
                </div>
              </div>

              <div style="fontSize: 16px;width: 52px;">kWp</div>
            </div>

            <div v-else></div>
          </template>
        </el-table-column>
      </el-table>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="displayClickFn">确 定</el-button>
      </span>
    </el-dialog>
  </div>
<!-- <el-input
    v-model="data"
    @input="inputChange"
    :placeholder="configuration.placeholder"
  /> --></template>

<script>
import eventActionDefine from "./msgCompConfig";
import myMixin from '../mixin'
import { queryAssetById } from "../api/asset";
import Utils from "../utils";
export default {
  name: "Add",
  props: {
    customConfig: Object,
  },
  mixins: [myMixin],
  data() {
    return {
      data: this.customConfig.data,
      propsConfiguration: this.customConfig.configuration || "{}",
      configuration: { column: [] },
      data_Id: this.customConfig?.detailInfo?.dataId,
      isBorder: false,
      sumCap: {},//保存事件存放的和
      resultData: {},//保存数据动作存放的值。
      offStatus: { '1': 1, '0': 0, 'null': 0, 'undefined': 0, "": 0 },
      tableData: [],
      loading: false,
      dialogVisible: false,
      dataColName: []
    };
  },
  computed: {
    colorAlartm() {
      return (data) => {
        return data == 1 ? 1 : 0
      }
    },
  },
  mounted() {
    window?.componentCenter?.register(
      this.customConfig.componentId,
      "comp",
      this,
      eventActionDefine
    );
    let { component, child_id, index } = this.customConfig;
    this.mixData.id = component.id
    this.mixData.child_id = child_id
    this.mixData.index = index
    this.mixData.eventActionDefine = eventActionDefine
    this.mixData.actions = { Event_Center_getName: this.Event_Center_getName, Event_Center_getParentInfo: this.Event_Center_getParentInfo }
    this.mixData.componentCenter = window?.componentCenter
    try {
      this.configuration = JSON.parse(this.propsConfiguration);
      this.configuration.column = [this.configuration.column0, this.configuration.column1, this.configuration.column2, this.configuration.column3,]
    } catch (error) {
      console.error("configuration解析错误", error);
    }
    this.filterKeyFn()
  },
  methods: {
    ValueChange(value, state, isBorder = false) {
      if (state == 0) {
        if (isBorder !== false) {
          this.tableData[isBorder][value][this.configuration.capacity] = ''
        } else {
          this.tableData[value][this.configuration.capacity] = ''
        }

      }

    },
    //过滤主外键
    async filterKeyFn() {
      let res = await queryAssetById(this.configuration.assetName)
      let table = Utils.translatePlatformDataToJsonArray(res)
      this.loading = true
      queryAssetById(this.configuration.assetId).then(res => {
        let resData = Utils.translatePlatformDataToJsonArray(res)
        let filterData = resData.filter((item, i) => {
          return item[this.configuration.foreignKey] == this.data_Id
        })
        // filterData.forEach(item => {
        //   item[this.configuration.state] = Number(item[this.configuration.state])
        // })
        //PV或者MPPT名称
        table.forEach((x, i) => {
          table[i][this.configuration.loopPV] = x.name
        })
        //填充数据
        if (filterData.length > 0) {
          filterData.forEach(item => {
            table.forEach((x, i) => {
              if (x.name == item[this.configuration.loopPV]) {
                table[i] = item
              }
              // table[i][this.configuration.state] = Number(table[i][this.configuration.state])
              x.status1 = Number(x[this.configuration.state])
              table[i][this.configuration.state] = table[i][this.configuration.state] == 1 ? 1 : 0
            })
          })
        } else {
          table.forEach((x, i) => {
            x.status1 = Number(x[this.configuration.state])
            x[this.configuration.state] = x[this.configuration.state] == 1 ? 1 : 0
          })
        }

        if (table.length > 12) {
          let arr1 = table.slice(0, table.length / 2)
          let arr2 = table.slice(table.length / 2)
          table = [arr1, arr2]
          this.isBorder = true
        } else {
          this.isBorder = false
        }
        console.log(table, '====table');

        this.tableData = table
        this.loading = false
        // console.log(this.tableData, filterData, '----------table');
      }).catch(err => {
        this.loading = false
      })
    },
    //弹框确定事件
    displayClickFn() {
      this.dialogVisible = false
      this.sumCapacityFn()
      this.inputChange(this.sumCap)
      // this.filetrResult()
      // console.log(this.tableData, '==========shuj');
    },
    //求和值 
    sumCapacityFn() {
      let table
      if (this.isBorder) {
        table = [...this.tableData[0], ...this.tableData[1]]
      } else {
        table = [...this.tableData]
      }
      let sumCap = { capacity: 0, quantity: 0 }

      table.forEach((x, i) => {
        sumCap.capacity += Number(x[this.configuration.capacity])
        if (x[this.configuration.state]) sumCap.quantity++
      })
      sumCap.capacity = Number(sumCap.capacity).toFixed(2)
      this.sumCap = sumCap
      // console.log('==========>', sumCap);
    },
    //像后端传递参数
    filetrResult() {
      let table
      if (this.isBorder) {
        table = [...JSON.parse(JSON.stringify(this.tableData[0])), ...JSON.parse(JSON.stringify(this.tableData[1]))]
      } else {
        table = [...JSON.parse(JSON.stringify(this.tableData))]
      }
      let table2 = table.filter(x => {
        x[this.configuration.state] = Boolean(x[this.configuration.state]) ? Number(Boolean(x[this.configuration.state])) : x.status1
        delete x.create_time
        delete x.last_modify_time
        return true
      })
      this.resultData = { table2, assetId: this.configuration.assetId }

    },
    //输入框获取焦点事件
    focusFn(e) {
      e.target.parentNode.className += ' focusParent'
    },
    blurFn(e) {
      e.target.parentNode.className = 'capacityInput'
    },
    async inputChange(e) {
      // this.data = e;
      let { formConfig, component, onChange } = this.customConfig;
      await window.eventCenter.triggerEventNew({
        objectId: formConfig?.id,
        componentId: component.id,
        type: "report",
        event: "preservation",
        payload: {
          value: e,
        },
      });
      onChange(e);
    },
    Event_Center_getName() {
      let { formConfig, component } = this.customConfig;
      return `${formConfig?.form_name}-${component.columnStyle.title}`;
    },
    // do_EventCenter_setValue({ value }) {
    //   this.data = value;
    // },
    do_EventCenter_setValue({ value }) {
      this.filetrResult()
      return { value: this.resultData }
    },
    do_EventCenter_getValue({ value }) {
      this.sumCapacityFn()
      return { value: Number(this.sumCap.quantity) };
    },
    do_EventCenter_getSum({ value }) {
      this.sumCapacityFn()
      return { value: Number(this.sumCap.capacity) };
      // return Number(this.sumCap.quantity)
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
.inverter_button {
  color: rgb(56, 123, 255);
  cursor: pointer;
  text-decoration: underline;
}

.isBorder_Table {
  display: flex;

  .isBorder_true:nth-of-type(1) {
    margin-right: -1px;

    .goBeyondTable {
      border-right: none;
    }
  }
}

.inverter_dialog {
  /deep/.el-dialog {
    display: table;
    width: auto;
  }

}

.capacityTable {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 32px;

  .focusParent {
    border-color: #2e7bff !important;
    border-right-width: 1px !important;
    box-shadow: 0 0 0 2px rgba(4, 84, 242, .2);
    outline: 0;
  }

  .capacityInput:hover {
    border-color: #2e7bff;
    border-right-width: 1px !important;
    box-shadow: 0 0 0 2px rgba(4, 84, 242, .2);
    outline: 0;
  }

  .capacityInput {
    display: flex;
    // width: 90%;
    height: 100%;
    // flex: 1;
    border: 1px solid #dedfe0;
    // padding-left: 0.7px;
    border-radius: 4px;
    outline: none;

    input {
      outline: none;
      border: none;
      margin-left: 2px;
      // flex: 1;
      width: 132px;
    }
  }

  .capacityButton {
    display: flex;
    flex-direction: column;
    width: 14px;
    height: 32px;

    button {
      background: transparent;
      border: none;
      border-left: 1px solid #dedfe0;
      border-bottom: 1px solid #dedfe0;
      height: 50%;
      display: flex;
      justify-content: center;

      :hover {
        cursor: pointer;
        color: #2e7bff;
      }
    }

    button:nth-last-child(1) {
      border-bottom: 0;
    }
  }
}

.capacityTable2 {
  .capacityInput {
    input {
      // flex: 1;
      width: 215px;
    }
  }
}

.goBeyondTable {
  border-bottom: 1px solid black;
  border-right: 1px solid black;
  margin: 0 auto;
}

::v-deep.goBeyondTable th {
  border: 1px solid black !important;
  border-right: none !important;
  border-bottom: none !important;
}

::v-deep .goBeyondTable td {
  border: 1px solid black;
  border-right: none !important;
}

/deep/ .el-table__cell .cell {
  padding: 0px !important;
}


//去除边框
.goBeyondTableWu /deep/ td.el-table__cell {
  border: none;
}

.goBeyondTableWu /deep/ th.el-table__cell {
  border: none;
}

.goBeyondTableWu /deep/ .el-table::before {
  left: 0;
  bottom: 0;
  width: 100%;
  height: 0;
}

/*表格最外层边框-底部边框*/
.goBeyondTableWu .el-table--border::after,
.goBeyondTableWu .el-table--group::after {
  width: 0;
}

.goBeyondTableWu::before {
  width: 0;
}

/deep/ .goBeyondTableWu td.el-table__cell,
/deep/.goBeyondTableWu th.el-table__cell.is-leaf {
  border-bottom: 0px;
}
</style>