<template>
  <!--注意，有些老版本的父级宽高没有100%，需要在mounted中使用this.$refs.refName.parentNode.style.width = "100%"规避，高度同理  -->
  <div className="analyzer-secondary" :style="{
    width: '100%',
    height: '100%',
  }" :ref="id" :id="id" class="analyzer-secondary">

    <div class="two_table_han">
      <div class="two_table_head">
        <div class="two_table_title">断面流量</div>
        <div class="two_table_radio">
          <el-radio-group v-model="radio2" size="small" @change="radioChange">
            <el-radio-button label="小时累计"></el-radio-button>
            <el-radio-button label="今日累计"></el-radio-button>
            <el-radio-button label="本月累计"></el-radio-button>
          </el-radio-group>
        </div>
      </div>
      <el-table :data="cardData" stripe style="width: 100%" :row-style="{ height: '35px' }" :header-cell-style="{
        padding: 0 + 'px',
        color: headColor,
        fontSize: headSize + 'px',
        fontFamily: headfamily,
      }" :header-row-style="{ height: headHeight + 'px' }" :cell-style="{
  padding: 0 + 'px',
  color: '#000000',
  height: dataHeight + 'px',
}">
        <el-table-column prop="label" label="" :min-width="titleWidth">
          <template slot-scope="scope">
            <div class="title_che" :style="{
              color: titleColor,
              fontSize: titleSize,
              fontFamily: titlefamily,
            }">
              <div class="title_shangx">{{ scope.row.label }}</div>
              <div>(辆/h)</div>
            </div>
          </template>
        </el-table-column>
        <el-table-column v-for="(item, i) in colunmData" :key="i" :prop="item" align="center" :label="item"
          :min-width="dataWidth">
          <template slot-scope="scope">
            <div class="huanbi_che">
              <div :style="{ color: numColor, fontSize: numSize + 'px', fontFamily: numfamily }">{{
                scope.row[item].flow_num
              }}</div>
              <div
                :style="{ color: scope.row[item].flow_rate > 0 ? rateJustColor : rateLossColor, fontSize: rateSize + 'px', fontFamily: ratefamily }">
                <i :class="`el-icon-caret-${scope.row[item].flow_rate > 0 ? 'top' : 'bottom'}`"></i> {{
  Number(scope.row[item].flow_rate).toFixed(rateDigit)
                }}%
              </div>
            </div>
          </template>
        </el-table-column>
        <!-- <el-table-column prop="address" label="地址">
        </el-table-column> -->
      </el-table>
    </div>
  </div>
</template>

<script>
import msgCompConfig from "./msgCompConfig";
import Utils from "./utils";
import {
  sectionDischarge
} from '@/api/asset.js'
import {
  RadioButton,
  RadioGroup,
  Table,
  TableColumn,
  Radio

} from "element-ui";

import Vue from "vue"

Vue.use(RadioGroup)
Vue.use(RadioButton)
Vue.use(Table)
Vue.use(TableColumn)
Vue.use(Radio)


const zipObject = (arr1, arr2) => {
  const ret = {};
  arr1.forEach((item, index) => {
    ret[item] = arr2[index];
  });
  return ret;
};

export default {
  props: {
    //用于接收分析仪拖拽过来的数据源，
    dataSource: {
      type: Array,
      default: () => []
    },
    //用于接收组件id，用于注册逻辑控制，不需要修改使用，保持默认即可
    componentId: {
      type: String | undefined,
      default: ""
    },
    //重要，用于接收分析仪右侧的配置项参数
    options: {
      type: Object,
      default: () => ({
        // 配置项从externalVariables里取
        externalVariables: {}
      })
    },
    //保持默认即可
    updateProcess: {
      type: Function,
      default: () => { }
    }
  },
  data() {
    return {
      id: "",
      //此处定义自己的业务数据
      radio2: '小时累计',
      type: 'hour',
      tableData: [{
        date: '2016-05-02',
        name: '王小虎',
        address: '上海市普陀区金沙江路 1518 弄'
      }, {
        date: '2016-05-04',
        name: '王小虎',
        address: '上海市普陀区金沙江路 1517 弄'
      }, {
        date: '2016-05-01',
        name: '王小虎',
        address: '上海市普陀区金沙江路 1519 弄'
      }, {
        date: '2016-05-03',
        name: '王小虎',
        address: '上海市普陀区金沙江路 1516 弄'
      }],
      cardData: [

      ],
      colunmData: [],
      assetId: this.options?.externalVariables?.assetId || '06b3319b-5b5b-535b-99ee-9c6eb6fc909b',
      //头部颜色
      headColor: this.options?.externalVariables?.headColor || '#abc6d8',
      headSize: this.options?.externalVariables?.headSize || '14',
      headfamily: this.options?.externalVariables?.headfamily || '',
      headHeight: this.options?.externalVariables?.headHeight || '35',
      //首列样式
      titleColor: this.options?.externalVariables?.titleColor || '#829aae',
      titleSize: this.options?.externalVariables?.titleSize || '14',
      titlefamily: this.options?.externalVariables?.titlefamily || '',
      // titleHeight: this.options?.externalVariables?.titleHeight || '35',
      titleWidth: this.options?.externalVariables?.titleWidth || '180',
      //数量样式

      numColor: this.options?.externalVariables?.numColor || '#acccde',
      numSize: this.options?.externalVariables?.numSize || '14',
      numfamily: this.options?.externalVariables?.numfamily || '',
      // titleHeight: this.options?.externalVariables?.titleHeight || '35',
      numWidth: this.options?.externalVariables?.numWidth || '180',

      //百分比样式
      // rateColor: this.options?.externalVariables?.rateColor || '#829aae',
      rateSize: this.options?.externalVariables?.rateSize || '14',
      ratefamily: this.options?.externalVariables?.ratefamily || '',
      // titleHeight: this.options?.externalVariables?.titleHeight || '35',
      rateDigit: this.options?.externalVariables?.rateDigit || '2',
      rateJustColor: this.options?.externalVariables?.rateJustColor || '#0df6ef',
      rateLossColor: this.options?.externalVariables?.rateLossColor || 'red',

      dataWidth: this.options?.externalVariables?.dataWidth || '180',
      dataHeight: this.options?.externalVariables?.dataHeight || '80',
    };
  },
  computed: {},
  watch: {},
  mounted() {
    let id = this.options?.externalVariables?.id;
    this.id = id ? `analyzer_secondary_${id}` : `analyzer_secondary_${Utils.generateUUID()}`;
    //重要，此处不可删除，用于注册逻辑控制
    this.componentId &&
      window.componentCenter?.register &&
      window.componentCenter.register(this.componentId, "comp", this, msgCompConfig);
    this.updateProcess && this.updateProcess();
    //这里用于将配置项的参数传入，与用户的代码进行交互，按照自己的业务逻辑填写

    this.queryTable()
  },
  methods: {

    radioChange() {
      let obj = {
        小时累计: 'hour',
        今日累计: 'day',
        本月累计: 'month',
      }
      this.type = obj[this.radio2]
      this.queryTable()
      //触发逻辑控制
      this.triggerEvent('tabsChange', {
        tabValue: this.radio2
      })
    },
    //查询表方法
    queryTable() {

      sectionDischarge({
        "assetId": this.assetId,
        "type": this.type
      }).then(res => {
        console.log(res.data.length);
        if (res.data.length > 0) {
          console.log(res.data);
          let cardData = []
          let item = {}
          let colunmData = []
          let resData = res.data
          let legendData = this.barDataOrder.split(",");
          legendData.forEach((item, index) => {
            resData.forEach((e) => {
              if (e.name == item) {
                tempDat.push(e);
              }
            });
          });
          tempDat.forEach(x => {
            colunmData.push(x.name)
            let a = JSON.stringify({
              flow_num: x.up_num,
              flow_rate: x.up_rate,
              truck_flow_num: x.truck_flow_num,
              car_flow_num: x.car_flow_num,
              car_truck_basis_rate: x.car_truck_basis_rate,
              car_truck_round_rate: x.car_truck_round_rate,
            })
            item[x.name] = {
              flow_num: x.up_num,
              flow_rate: x.up_rate,
              truck_flow_num: x.truck_flow_num,
              car_flow_num: x.car_flow_num,
              car_truck_basis_rate: x.car_truck_basis_rate,
              car_truck_round_rate: x.car_truck_round_rate,
            }
          });
          item.label = '上行'
          cardData.push(item)
          let item2 = {}
          tempDat.forEach(x => {
            item2[x.name] = {
              flow_num: x.down_num,
              flow_rate: x.down_rate,
              truck_flow_num: x.truck_flow_num,
              car_flow_num: x.car_flow_num,
              car_truck_basis_rate: x.car_truck_basis_rate,
              car_truck_round_rate: x.car_truck_round_rate,
            }
          });
          item2.label = '下行'
          cardData.push(item2)
          this.cardData = cardData
          this.colunmData = colunmData
        } else {
          this.cardData = []
          this.colunmData = []
        }


      }).catch(err => {
        this.cardData = []
        this.colunmData = []
      })
    },
    // 逻辑控制用，不可删，return内容可改
    Event_Center_getName() {
      return this.id;
    },
    /**
     * 触发事件方法，window.eventCenter?.triggerEvent封装了一层， 必需，不可删除
     * @param {String} eventName 事件名
     * @param {Array} payload 事件传参
     *
     */
    triggerEvent(eventName, payload) {
      this.componentId && window.eventCenter?.triggerEvent(
        this.componentId,
        eventName,
        //payload需为一个object，如msgCompConfig.js定义的payload则为{value:""}这样的形式
        payload
      );
    }
    //do_EventCenter_前缀开头的方法，用来定义对应动作
  }
};
</script>

<style lang="less" scoped>
.two_table_han {
  background: #000319;
  padding: 20px;

  .two_table_head {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 15px;

    .two_table_radio {
      /deep/.el-radio-button__inner {
        background: #041c36;
        border: 1px #0f4b71 solid;
        width: 64px;
        padding: 7px 8px;
        color: #89a7bb;

        /deep/ .is-active .el-radio-button__inner {
          background: #0f5078;
          color: #c5eafb;
          border: 1px solid #1b7bad;
        }

        /deep/.el-radio-button__orig-radio:checked+.el-radio-button__inner {
          box-shadow: none;
        }
      }
    }

    .two_table_title {
      color: #c4e7f8;
    }

    .title_che {
      display: flex;
      flex-direction: column;
      align-items: center;

      .title_shangx {
        letter-spacing: 2px;
      }
    }

    .huanbi_che {
      display: flex;
      flex-direction: column;
      // align-items: center;
    }

    /deep/ .el-table,
    /deep/ .el-table__expanded-cell {
      background-color: transparent;
    }

    /* 表格内背景颜色 */
    /deep/ .el-table th,
    /deep/ .el-table tr,
    /deep/ .el-table td {
      background-color: transparent;
    }

    /deep/.el-table__row>td {
      border: none;
    }

    /deep/.el-table::before {
      height: 0px;
    }

    /deep/.el-table thead tr th.is-leaf {
      background: #171d32;
      border: none;
    }

    /deep/.el-table--striped .el-table__body tr.el-table__row--striped td.el-table__cell {
      background: #171d32;
    }

    /deep/ .el-table--enable-row-hover .el-table__body tr:hover>td.el-table__cell {
      background: none;
    }

    /deep/ .el-table--enable-row-hover .el-table__body tr.el-table__row--striped:hover>td.el-table__cell {
      background: #171d32;
    }

    /deep/.el-table__row :last-child {
      border-radius: 0 7px 7px 0;
    }

    /deep/.el-table__row :first-child {
      border-radius: 7px 0 0 7px;
    }
  }

  .huanbi_che {
    display: flex;
    flex-direction: column;
    // align-items: center;
  }

  /deep/ .el-table,
  /deep/ .el-table__expanded-cell {
    background-color: transparent;
  }

  /* 表格内背景颜色 */
  /deep/ .el-table th,
  /deep/ .el-table tr,
  /deep/ .el-table td {
    background-color: transparent;

  }

  /deep/.el-table__row>td {
    border: none;
  }

  /deep/.el-table::before {
    height: 0px;
  }

  /deep/.el-table thead tr th.is-leaf {
    background: #FFFFFF19;
    border: none;
  }

  /deep/.el-table--striped .el-table__body tr.el-table__row--striped td.el-table__cell {
    background: #FFFFFF19;
  }



  /deep/ .el-table--enable-row-hover .el-table__body tr:hover>td.el-table__cell {
    background: none;
  }

  /deep/ .el-table--enable-row-hover .el-table__body tr.el-table__row--striped:hover>td.el-table__cell {
    background: #FFFFFF19;
  }

  /deep/.el-table__row :last-child {
    border-radius: 0 7px 7px 0;
  }

  /deep/ .el-table .cell {
    padding: 0px;
  }

  /deep/.el-table__row :first-child {
    border-radius: 7px 0 0 7px;

  }
}
</style>
