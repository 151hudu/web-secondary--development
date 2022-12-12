<template>
  <div class="configuration_two">
    <div class="item_config">
      <div class="item_config_title">
        资产Id
      </div>
      <div class="item_config_use">
        <input placeholder="输入一个资产id" @blur="assidFn" v-model="资产Id" />
      </div>
      <div class="item_config_title">
        路由参数名称
      </div>
      <div class="item_config_use">
        <input placeholder="请输入参数名称" v-model="路由参数名称" />
      </div>
      <div class="item_config_title">
        iframeSrc
      </div>
      <div class="item_config_use  flex_use">
        <el-select v-model="valueSrc" size="small" @change="changeIframe('valueSrc')" width="30%" placeholder=" 请选择">
          <el-option label="http" value="http">
          </el-option>
          <el-option label="https" value="https">
          </el-option>
        </el-select>

        <el-select v-model="iframeIp" size="small" @change="changeIframe('iframeIp')" width="30%" placeholder="请选择IP字段">
          <el-option v-for="(item, i) in optionsAr" :key="i" :label="item.label" :value="item.value">

          </el-option>
        </el-select>
        <el-select v-model="iframeDk" size="small" @change="changeIframe('iframeDk')" width="30%" placeholder="请选择端口字段">
          <el-option v-for="(item, i) in optionsAr" :key="i" :label="item.label" :value="item.value">

          </el-option>
        </el-select>
        <el-select v-model="iframeLj" size="small" @change="changeIframe('iframeLj')" width="30%" placeholder="请选择路径字段">
          <el-option v-for="(item, i) in optionsAr" :key="i" :label="item.label" :value="item.value">

          </el-option>
        </el-select>



      </div>

      <div class="item_config_title">
        登录接口
      </div>
      <div class="item_config_use flex_use">
        <el-select v-model="valueApi" size="small" @change="changeIframe('valueApi')" width="30%" placeholder="请选择">
          <el-option label="http" value="http">
          </el-option>
          <el-option label="https" value="https">
          </el-option>
        </el-select>

        <el-select v-model="loginIp" size="small" @change="changeIframe('loginIp')" width="30%" placeholder="请选择IP字段">
          <el-option v-for="(item, i) in optionsAr" :key="i" :label="item.label" :value="item.value">

          </el-option>
        </el-select>
        <el-select v-model="loginDk" size="small" @change="changeIframe('loginDk')" width="30%" placeholder="请选择端口字段">
          <el-option v-for="(item, i) in optionsAr" :key="i" :label="item.label" :value="item.value">

          </el-option>
        </el-select>
        <el-select v-model="loginLj" size="small" @change="changeIframe('loginLj')" width="30%" placeholder="请选择路径字段">
          <el-option v-for="(item, i) in optionsAr" :key="i" :label="item.label" :value="item.value">

          </el-option>
        </el-select>


      </div>

      <div class="item_config_title">
        登录设置
      </div>
      <div class="item_config_use flex_use">

        <input type="text" v-model="登录页名称" placeholder="页面名称">

        <el-select v-model="userFielf" size="small" @change="changeIframe('userFielf')" width="30%"
          placeholder="请选择用户名字段">
          <el-option v-for="(item, i) in optionsAr" :key="i" :label="item.label" :value="item.value">

          </el-option>
        </el-select>
        <el-select v-model="userM" size="small" @change="changeIframe('userM')" width="30%" placeholder="请选择用户密码字段">
          <el-option v-for="(item, i) in optionsAr" :key="i" :label="item.label" :value="item.value">

          </el-option>
        </el-select>

      </div>
      <el-button type="primary" @click="buttonClick">执行</el-button>

    </div>

  </div>
</template>

<script>
import {
  Option,
  Select, Button
} from "element-ui";
import Vue from "vue";
import Utils from "@/utils";
import { queryAssetById, getAssetData } from '@/api/asset.js'
Vue.use(Option);
Vue.use(Button);
Vue.use(Select);

export default {
  name: "Configuration",
  components: {},
  data() {
    return {
      // valueSrc: 'http',
      // valueApi: 'http',
      资产Id: this.customConfig?.资产Id || '',
      路由参数名称: this.customConfig?.路由参数名称 || '',
      登录接口: '',
      登录页名称: this.customConfig?.登录页名称 || '',
      iframeSrc: '',
      valueSrc: this.customConfig?.valueSrc || '',
      iframeIp: this.customConfig?.iframeIp || '',
      iframeDk: this.customConfig?.iframeDk || '',
      iframeLj: this.customConfig?.iframeLj || '',

      valueApi: this.customConfig?.valueApi || '',
      loginIp: this.customConfig?.loginIp || '',
      loginDk: this.customConfig?.loginDk || '',
      loginLj: this.customConfig?.loginLj || '',

      userFielf: this.customConfig?.userFielf || '',
      userM: this.customConfig?.userM || '',

      confi: {},
      optionsAr: []
    };
  },
  props: {
    funcRef: Object,
    //用于当改变配置的时候，将当前的customConfig当做入参，用于保存最新的customConfig
    onConfigChange: Function,
    customConfig: Object
  },
  mounted() {
    if (this.customConfig?.资产Id) {
      this.assidFn()
    }
  },
  methods: {
    //资产更改
    assidFn() {
      getAssetData(this.资产Id).then(res => {


        let arrOption = res.data[0]
        let optionsAr = arrOption.map((x, i) => {
          return { label: x.col_alias || x.col_name, value: x.col_name, key: i }
        })
        this.optionsAr = [...optionsAr]

        let arr = Utils.translatePlatformDataToJsonArray(res)
        let tet = true
        arr.forEach(x => {
          if (!x.defense_port) tet = false
        })

      })
    },

    changeIframe(type) {
      this.confi[type] = this[type]
    },

    buttonClick() {
      // let config = { ...this.customConfig };
      this.confi.资产Id = this.资产Id
      this.confi.路由参数名称 = this.路由参数名称
      this.confi.登录页名称 = this.登录页名称
      // config.资产Id = this.资产Id
      // config.路由参数名称 = this.路由参数名称
      // config.登录接口 = this.登录接口
      // config.登录页名称 = this.登录页名称
      // config.iframeSrc = this.iframeSrc
      let config = { ...this.confi };
      // console.log(config, this.confi, '=====更新');
      this.onConfigChange && this.onConfigChange(config)
    }
  }
};
</script>

<style lang="less" scoped>
.configuration_two {
  .item_config {
    .item_config_use {
      input {
        height: 32px;
        width: 90%;
        border-radius: 3px;
        border: 1px solid #DCDFE6;
        line-height: 32px;
        outline: none;
      }

      input::-webkit-input-placeholder {
        color: #DCDFE6
      }
    }

    .flex_use {
      display: flex;
      justify-content: space-around;

      /deep/ .el-select {
        width: 30%;
      }

      input {
        margin-right: 10px;
      }
    }
  }
}
</style>

