<template>


  <div class="listAdd">
    <el-button type="primary" class="listAdd_btn" size="small" @click="editFn('','','edit')">新增</el-button>

    <el-table :data="tableData" style="width: 100%" border stripe header-cell-class-name='listBan'>
      <el-table-column type="index" label="组数" width="180">
      </el-table-column>
      <el-table-column prop="repeatTimes" label="重复次数" width="180">
      </el-table-column>
      <el-table-column prop="shearStrength" label="剪切强度(MPa)">
      </el-table-column>
      <el-table-column prop="shearModulus" label="剪切模量(MPa)">
      </el-table-column>
      <el-table-column prop="shearStrain" label="剪切应变(%)">
      </el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-button type="text" @click="editFn(scope.row,scope.$index,'edit')" size="small">编辑</el-button>
          <el-button type="text" size="small" @click="editFn(scope.row,scope.$index,'')">详情</el-button>
          <el-button type="text" size="small" @click="deleteFn(scope.$index)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-dialog :title="edit?'编辑':'详情'" :visible.sync="dialogVisible">
      <template v-if="edit">
        <el-descriptions border>

          <el-descriptions-item label="载荷类型" label-class-name="my_label">
            <el-select v-model="value" placeholder="请选择">
              <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value">
              </el-option>
            </el-select>
          </el-descriptions-item>

        </el-descriptions>


        <el-table :data="childTable" style="width: 100%" border stripe header-cell-class-name='listBan'>
          <el-table-column type="index" label="序号">
          </el-table-column>
          <el-table-column prop="loadValue" label="载荷数值(N)">
            <template slot-scope="scope">
              <el-input-number :controls="false" type="text" v-model="scope.row.loadValue"
                @input="childChangeFn(scope.row,scope.$index)" size="small" />
            </template>
          </el-table-column>
          <el-table-column prop="vnotchesWidth" label="V型槽口间的宽度(mm)">
            <template slot-scope="scope">
              <el-input-number :controls="false" type="text" v-model="scope.row.vnotchesWidth"
                @input="childChangeFn(scope.row,scope.$index)" size="small" />
            </template>
          </el-table-column>
          <el-table-column prop="sampleThickness" label="试样厚度(mm)">
            <template slot-scope="scope">
              <el-input-number :controls="false" type="text" v-model="scope.row.sampleThickness"
                @input="childChangeFn(scope.row,scope.$index)" size="small" />
            </template>
          </el-table-column>
          <el-table-column prop="shearStrength" label="剪切强度(MPa)">
            <template slot-scope="scope">
              <el-input-number :controls="false" type="text" v-model="scope.row.shearStrength" :disabled="true"
                size="small" />
            </template>
          </el-table-column>
          <el-table-column prop="shearModulus" label="剪切模量(Mpa)">
            <template slot-scope="scope">
              <el-input-number :controls="false" type="text" v-model="scope.row.shearModulus" size="small" />
            </template>
          </el-table-column>
          <el-table-column prop="shearStrain" label="剪切应变(%)">
            <template slot-scope="scope">
              <el-input-number :controls="false" type="text" v-model="scope.row.shearStrain" size="small" />
            </template>
          </el-table-column>
          <el-table-column label="操作">
            <template slot-scope="scope">
              <el-button type="text" @click="childDelFn(scope)" size="small">删除</el-button>
            </template>
          </el-table-column>
          <div slot="append" class="child_end_fill">
            <div class="end_span" @click="childAddFn">新增</div>
          </div>
        </el-table>
      </template>
      <template v-else>
        <el-descriptions border>

          <el-descriptions-item label="载荷类型" label-class-name="my_label">
            <el-select v-model="value" placeholder="请选择" :disabled="true">
              <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value">
              </el-option>
            </el-select>
            <!-- {{value}} -->
          </el-descriptions-item>

        </el-descriptions>
        <el-table :data="childTable" style="width: 100%" border stripe header-cell-class-name='listBan'>
          <el-table-column type="index" label="序号">
          </el-table-column>
          <el-table-column prop="loadValue" label="载荷数值(N)">

          </el-table-column>
          <el-table-column prop="vnotchesWidth" label="V型槽口间的宽度(mm)">

          </el-table-column>
          <el-table-column prop="sampleThickness" label="试样厚度(mm)">

          </el-table-column>
          <el-table-column prop="shearStrength" label="剪切强度(MPa)">

          </el-table-column>
          <el-table-column prop="shearModulus" label="剪切模量(Mpa)">

          </el-table-column>
          <el-table-column prop="shearStrain" label="剪切应变(%)">

          </el-table-column>
          <el-table-column label="操作">
            <template>
              <span>删除</span>
            </template>
          </el-table-column>
          <div slot="append" class="child_end_fill">
            <div class="eidt_end_span">新增</div>
          </div>
        </el-table>
      </template>

      <span slot="footer" class="dialog-footer" v-if="edit">
        <el-button v-show="tableIndex!==''" @click="childSaveFn('save',tableIndex)">保存</el-button>
        <el-button type="primary" class="listAdd_btn" @click="childSaveFn('add',undefined)">保存并新增</el-button>
      </span>
    </el-dialog>


  </div>
</template>

<script>
import eventActionDefine from "./msgCompConfig";
import myMixin from '../mixin'
import { getAssetsData, queryAssetsData, saveCustomize } from '../api/asset.js'
export default {
  name: "Add",
  props: {
    customConfig: Object,
  },
  mixins: [myMixin],
  data() {
    return {
      cusData: this.customConfig.data,
      parentId: this.customConfig.detailInfo.dataId,
      propsConfiguration: this.customConfig.configuration || "{}",
      configuration: {},
      resData: [],
      tableData: [],
      dialogVisible: false,
      options: [{
        value: '最大载荷',
        label: '最大载荷'
      }, {
        value: '5%应变时的载荷',
        label: '5%应变时的载荷'
      },],
      value: '',
      edit: true,
      childTable: [],
      tableIndex: 0
    };
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

      this.configuration.assetId = '4230b357-96d0-6258-cab3-968990b6a03a'
      this.resData = JSON.parse(this.cusData)
    } catch (error) {
      console.error("configuration解析错误", error);
    }
    console.log(this.parentId, this.customConfig.detailInfo, '===');
    if (this.parentId) {
      this.queryAsset()
    }


  },
  methods: {
    async inputChange(e) {
      this.data = e;
      let { formConfig, component, onChange } = this.customConfig;
      await window.eventCenter.triggerEventNew({
        objectId: formConfig?.id,
        componentId: component.id,
        type: "report",
        event: "change",
        payload: {
          value: e,
        },
      });
      onChange(e);
    },
    generateUUID: () => {
      let d = new Date().getTime();
      return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function (c) {
        let r = (d + Math.random() * 16) % 16 | 0;
        d = Math.floor(d / 16);
        return (c == "x" ? r : (r & 0x3) | 0x8).toString(16);
      });
    },
    saveFn() {
      let tableD = []

      this.tableData.forEach((x, i) => {
        let item = {}
        for (let key in x) {
          if (typeof x[key] == 'string') {
            item[key] = x[key]?.split(' ')[0]
          } else {
            item[key] = x[key]
          }

          if (key == 'shearStrength') {
            item.shearStrengthMean = this.avgFn(x[key]?.split(','))
          }
          if (key == 'shearModulus') {
            item.shearModulusMean = this.avgFn(x[key]?.split(','))
          }
          if (key == 'shearStrain') {
            item.shearStrainMean = this.avgFn(x[key]?.split(','))
          }
        }
        tableD.push(item)
      })

      let parent_id = this.parentId
      saveCustomize({ dataList: tableD, childAssetId: this.configuration.assetId, parent_id }).then(res => { console.log('保存成功') }).catch(err => { console.log('保存失败') })
    },
    handleClose(done) {
      this.$confirm('确认关闭？')
        .then(_ => {
          done();
        })
        .catch(_ => { });
    },
    childSaveFn(type, i) {
      const tableItem = { loadValue: [], vnotchesWidth: [], sampleThickness: [], shearStrength: [], shearModulus: [], shearStrain: [] }
      this.childTable.forEach((x, i) => {
        for (const key in tableItem) {
          if (x[key]) {
            tableItem[key].push(x[key])
          }

        }
      })
      const length = this.childTable.length
      let pushIs
      for (const key in tableItem) {


        // tableItem[key] = tableItem[key].join('、')
        tableItem[key] = tableItem[key].join(',')
        if (key == 'shearStrength' || key == 'shearModulus' || key == 'shearStrain') {
          let avg = this.avgFn(tableItem[key].split(','))
          tableItem[key] += ` (${avg})`
        }
        if (key == 'data_id') continue

        pushIs = tableItem[key] ? true : false
      }
      if (!pushIs && type != 'add') {
        this.dialogVisible = false
        return
      }
      if (!pushIs && type == 'add') {
        this.childTable = []
        return
      }
      tableItem.repeatTimes = length
      tableItem.loadType = this.value
      if (i || i == 0) {

        this.$set(this.tableData, i, tableItem)
      } else {
        tableItem.parent_id = this.parentId
        // tableItem.data_id = this.generateUUID()
        this.tableData.push(tableItem)
      }

      if (type == 'add') {

        this.childTable = []
      } else {
        this.dialogVisible = false
      }
    },
    editFn(data, i, type) {
      this.dialogVisible = true
      this.childTable = []
      this.tableIndex = i

      if (data) {
        const dataTemp = {}
        let tempArr = []

        for (let key in data) {
          if (typeof data[key] == 'string') {
            // let item = data[key]?.split(' ')[0]?.split('、')
            let item = data[key]?.split(' ')[0]?.split(',')
            dataTemp[key] = item
            tempArr.push(item.length)
          }


        }

        const max = Math.max(...tempArr)
        for (let i = 0; i < max; i++) {
          let item = {}
          for (let key in dataTemp) {
            item[key] = dataTemp[key][i]
          }
          this.childTable.push(item)
        }
        // console.log(this.childTable, dataTemp, '===child')
        this.value = dataTemp.loadType[0]
      } else {
        this.value = ''
      }

      this.edit = type == 'edit' ? true : false

    },
    childAddFn() {
      this.childTable.push({})
    },
    queryAsset() {
      let childAssetId = this.configuration?.assetId
      let parentId = this.parentId
      queryAssetsData({ parentId, childAssetId }).then(res => {
        let result = []

        res.data.forEach((x) => {
          let length1 = []
          for (const key in x) {
            if (key == 'shearStrength') {
              x.shearStrengthMean = this.avgFn(x[key]?.split(','))
              x[key] += ` (${x.shearStrengthMean})`
            }
            if (key == 'shearModulus') {
              x.shearModulusMean = this.avgFn(x[key]?.split(','))
              x[key] += ` (${x.shearModulusMean})`
            }
            if (key == 'shearStrain') {
              x.shearStrainMean = this.avgFn(x[key]?.split(','))
              x[key] += ` (${x.shearStrainMean})`
            }
            if (typeof x[key] == 'string' && key != 'loadType') {
              length1.push(x[key]?.split(',').length)
            }
          }
          x.repeatTimes = Math.max(...length1)
          result.push(x)
        })
        this.tableData = res.data
      })
    },
    avgFn(dataArr) {
      let length = dataArr.length
      let sum = 0
      dataArr.forEach(x => {
        sum += Number(x) || 0
      })
      return (sum / length).toFixed(2)
    },
    dataHandler(data) {
      const header = data[0]
      const body = data[1]
      const result = []
      const headerObj = []
      header.forEach((x, i) => {
        headerObj.push(x.col_name || x.col_alias)
      })
      body.forEach((x, i) => {
        let temp = {}
        let date = []
        x.forEach((item, index) => {
          temp[headerObj[index]] = item
          if (headerObj[index] == 'data_id') return
          let avg = this.avgFn(item.split('、'))
          temp[headerObj[index]] += ` (${avg})`
          date.push(item.split('、').length)
        })
        temp.date = String(Math.max(...date))

        result.push(temp)
      })
      return result
    },
    childDelFn(row) {
      const i = row.$index

      this.childTable.splice(i, 1)

    },
    deleteFn(i) {
      this.tableData.splice(i, 1)
    },
    childChangeFn(row, i) {
      if (row.vnotchesWidth == 0 || row.sampleThickness == 0) return
      const strength = !row.vnotchesWidth || !row.sampleThickness ? '' : (Number(row.loadValue) / (Number(row.vnotchesWidth) * Number(row.sampleThickness))).toFixed(2)

      this.childTable[i].shearStrength = strength || ''

    },
    Event_Center_getName() {
      let { formConfig, component } = this.customConfig;
      return `${formConfig?.form_name || formConfig?.formName}-${component.columnStyle.title}`;
    },

    do_EventCenter_setValue({ value }) {
      this.data = value;
    },
    do_EventCenter_getValue() {

      let tableD = []
      this.tableData.forEach((x, i) => {
        let item = {}
        for (let key in x) {
          if (typeof x[key] == 'string') {
            item[key] = x[key]?.split(' ')[0]
          } else {
            item[key] = x[key]
          }

          if (key == 'shearStrength') {

            item.shearStrengthMean = this.avgFn(item[key]?.split(','))
          }
          if (key == 'shearModulus') {
            item.shearModulusMean = this.avgFn(item[key]?.split(','))
          }
          if (key == 'shearStrain') {
            item.shearStrainMean = this.avgFn(item[key]?.split(','))
          }
        }
        tableD.push(item)
      })
      let parent_id = this.parentId

      return { value: { dataList: tableD, childAssetId: this.configuration.assetId, parent_id } };
    },
    do_EventCenter_getRowNumber() {
      let value = this.tableData.length

      return { value }
    },
  },
  destroyed() {
    window?.componentCenter?.removeInstance(this.customConfig.componentId);
  },
};
</script>

<style lang="less" scoped>
.listAdd {

  /deep/ input::-webkit-outer-spin-button,
  /deep/ input::-webkit-inner-spin-button {
    -webkit-appearance: none !important;
  }

  /deep/ input[type='number'] {
    -moz-appearance: textfield !important;
  }

  /deep/.el-input-number--small {
    width: 100%;
  }

  /deep/ .listAdd_btn {
    background-color: #0454f2;
    border-color: #0454f2;
  }

  /deep/ .listBan {
    background: #f7f7f7;
  }

  /deep/.my_label {
    background: rgb(247, 247, 247);
    color: rgb(144, 147, 153);
  }

  /deep/ .el-select {
    width: 100%;
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
</style>
