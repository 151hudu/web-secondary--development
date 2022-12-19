<template>
  <div>
  </div>
</template>

<script>
// 接口
import {
  fetchLogin,
  fetchUser,
} from "./api/asset"
// 加密

import qs from "querystringify";
// 样式
import "./index.css";

import {ERROR_LIST} from './dict'

export default {
  name: "App",

  props: {
    customConfig: Object,
  },

  beforeMount() {
    document.title = '登录'
  },

  mounted() {
    this.handleLogin();
  },

  watch: {},

  data() {
    return {}
  },

  computed: {},

  methods: {
    // 消息提示
    openMessage(res, type, defaultText) {
      this.$message({
        message: ERROR_LIST[`ERROR.${res?.data?.code}`] || res?.data?.message || defaultText,
        center: true,
        type: type,
        customClass: 'message-custom',
      });
    },
    handleLoginJump() {
      const {history} = this.customConfig;
      let {search} = window.location;
      const {real_redirect_url} = qs.parse(search);
      if (real_redirect_url) return history.replace(real_redirect_url);
      history.goBack();

    },
    async setUser() {
      if (!window.currentUser) {
        try {
          let {data} = await fetchUser();
          window.currentUser = data;
        } catch (err) {
          console.log('fetchCurrentUser error: ', err);
        }
      }
    },
    // 登录
    handleLogin() {
      let {search} = window.location;
      const {openid} = qs.parse(search);
      if (!openid) return;

      const loginForm = {
        openid,
      }
      // 跳转页面
      fetchLogin(loginForm).then(async () => {
        await this.setUser()
        this.handleLoginJump()
      }).catch((err) => {
        const {history} = this.customConfig;
        this.openMessage(err, 'error', '登录失败')
        history.goBack();
      })
    },
  },
};
</script>

<style scoped lang="less"></style>