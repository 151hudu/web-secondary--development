<template>
    <!-- <div class="query-root">{{ data }}</div> -->
    <div class="dateTime">
        <button class="itemButton  itemButtonLeft" @click="previousHandler"> <i class="el-icon-arrow-left"></i>
        </button>
        <el-date-picker prefix-icon="'" popper-class="dateTimePopr" ref="datePicker" v-model="timeDate" type="date"
            placeholder="选择日期" @change="pickDateFn">
        </el-date-picker><button @click="nextHandler" class="itemButton itemButtonRight"><i
                class="el-icon-arrow-right"></i> </button>
    </div>

</template>
  
<script>
const listId = {
    '8b6803d1-a5e3-4225-a773-9344646ae70b': '明天',
    'bf2e528f-1348-4793-9da9-83d83b11da15': '明天',
    '6c09f43d-ebe4-4e07-bc27-d3867b3c19d1': '今天',
    '86626ccb-4c8e-46a3-b5f4-b6642d2472b8': '今天',
    'e11a3915-24de-4914-a764-73bd1b371e3c': '今天',
    'e925f76a-94e0-4f58-aad2-ea4bb1ceeb50': '今天',
    '0dfbcb39-3e32-4d1d-8471-695774feedfd': '今天',
    '7d089991-32bb-43e7-b9a3-c093280a104c': '今天',
    '7b5aaa52-b350-4734-94e8-21be9ee11b31': '昨天',
    '8889a1f8-d5c1-45cc-a13e-2cc5c1ea27b8': '昨天',
    '9553bfe7-4066-4200-9d2e-af0428637b23': '昨天',
    '5807bcfe-9b9c-4442-97d5-44da0fb975f8': '昨天',
    'f898223c-e5ee-4b56-bbfe-2ee39caa1e90': '昨天',
    'c10aab38-2e59-4235-9476-05f408466b68': '昨天',
}
export default {
    name: "Query",
    props: {
        customConfig: Object,
    },
    data() {
        return {
            data: this.customConfig.data,
            timeDate: '',
            status: false,
            changeTime: '',
            queryDate: [],
            queryProps: this.customConfig?.queryProps
        };
    },
    watch: {
        timeDate: {
            handler(val) {


            },
            deep: true,
            // immediate: true
        },

        "queryProps.queryList": {
            handler(val) {

                if (val[0].list?.length >= 1 && !this.changeTime) {

                    let key = this.customConfig.component.modelId
                    switch (listId[key]) {
                        case '今天':
                            this.timeDate = new Date()

                            break;
                        case '明天':
                            this.timeDate = this.timeDate || new Date()
                            let nextDay = new Date(this.timeDate.getTime() + (60 * 60 * 24 * 1000))
                            this.timeDate = new Date(nextDay)

                            break;
                        case '昨天':
                            this.timeDate = this.timeDate || new Date()
                            let lastDay = new Date(this.timeDate.getTime() - (60 * 60 * 24 * 1000))
                            this.timeDate = new Date(lastDay)

                            break;
                        default:
                            this.timeDate = this.timeDate || new Date()


                            break;
                    }
                }
                if (val[0].list?.length >= 1) {
                    this.timeDate = new Date(val[0].list[0].value)
                }
                if (val[0].list && val[0].list.length == 0) {
                    this.timeDate = ''

                }

                if (!val[0].list) {
                    let key = this.customConfig.component.modelId

                    switch (listId[key]) {
                        case '今天':
                            this.timeDate = this.timeDate || new Date()

                            this.watchQueryDate()
                            break;
                        case '明天':
                            this.timeDate = this.timeDate || new Date()
                            let nextDay = new Date(this.timeDate.getTime() + (60 * 60 * 24 * 1000))
                            this.timeDate = new Date(nextDay)
                            this.watchQueryDate()
                            break;
                        case '昨天':
                            this.timeDate = this.timeDate || new Date()
                            let lastDay = new Date(this.timeDate.getTime() - (60 * 60 * 24 * 1000))
                            this.timeDate = new Date(lastDay)
                            this.watchQueryDate()
                            break;
                        default:
                            this.timeDate = this.timeDate || new Date()

                            this.watchQueryDate()
                            break;
                    }

                    this.seachFn()
                }




            },
            deep: true,
            immediate: true
        }
    },
    mounted() {
        let key = this.customConfig.component.modelId

        if (this.queryProps.value.length == 0) {

        }


    },
    methods: {


        previousHandler() {
            this.timeDate = this.timeDate || new Date()
            let lastDay = new Date(this.timeDate.getTime() - (60 * 60 * 24 * 1000))
            this.timeDate = new Date(lastDay)
            this.changeTime = new Date(lastDay)
            this.watchQueryDate()


        },
        nextHandler() {
            this.timeDate = this.timeDate || new Date()
            let nextDay = new Date(this.timeDate.getTime() + (60 * 60 * 24 * 1000))
            this.timeDate = new Date(nextDay)
            this.changeTime = new Date(nextDay)
            this.watchQueryDate()
        },
        watchQueryDate() {
            const { onChange } = this.queryProps
            let value = []
            if (this.timeDate) {
                this.queryDate[0] = new Date(new Date(this.timeDate.toLocaleDateString()).getTime()).getTime();
                this.queryDate[1] = new Date(new Date(this.timeDate.toLocaleDateString()).getTime() + 24 * 60 * 60 * 1000 - 1).getTime();

                value = [{
                    colId: this.queryProps.data.id,
                    coLName: this.queryProps.data.componentBusinessConfigList[0].businessName,
                    value: this.queryDate[0],
                    type: 111
                }, {
                    colId: this.queryProps.data.id,
                    coLName: this.queryProps.data.componentBusinessConfigList[0].businessName,
                    value: this.queryDate[1],
                    type: 113
                }]
            }

            onChange(value);
        },
        seachFn() {
            let filter = document.querySelector('button.filterBtn')
            filter.click()
        },
        pickDateFn() {
            this.watchQueryDate()
        }

    }
};
</script>
  
<style lang="less" scoped>
.query-root {
    box-sizing: border-box;
    height: 32px;
    line-height: 32px;
    font-size: 13px;
    color: #606266;
}

.dateTime {
    display: flex;
    // justify-content: center;

    .itemButton {
        height: 32px;
        background-color: transparent;
        border: 1px solid #DCDFE6;
        cursor: pointer;
        font-size: 20px;
        font-weight: 700;

        display: flex;
        // justify-content: center;
        // align-content: center;

        &:hover {
            color: cornflowerblue;

        }

        /deep/.el-icon-arrow-left {
            line-height: 28px;
        }

        /deep/.el-icon-arrow-right {
            line-height: 28px;
        }
    }

    .itemButtonRight {
        border-top-right-radius: 4px;
        border-bottom-right-radius: 4px;
        border-left: none;
    }

    .itemButtonLeft {
        border-top-left-radius: 4px;
        border-bottom-left-radius: 4px;
        border-right: none;
    }

    /deep/.el-date-editor {
        width: calc(70% - 53px);
        height: 32px;

        .el-input__icon {
            line-height: 32px;
        }
    }

    /deep/.el-input__inner {
        border-radius: 0px;
        border-left: none;
        border-right: none;
        text-align: center;
        height: 32px;
        // width: calc(100% - 53px);
        padding: 0px;

        &:hover {
            border-color: #DCDFE6;
        }

        &:focus {
            border-color: #DCDFE6;
        }
    }
}
</style>
  