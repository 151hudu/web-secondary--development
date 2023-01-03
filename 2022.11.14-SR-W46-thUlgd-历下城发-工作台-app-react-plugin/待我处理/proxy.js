module.exports = {
   "/api": {
      target: "http://10.15.111.13:9093/",
      changeOrigin: true,
      pathRewrite: { "^/api": "" },
   },
};
