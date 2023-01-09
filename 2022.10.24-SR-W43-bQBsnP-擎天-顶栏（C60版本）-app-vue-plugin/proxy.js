module.exports = {
  "/api": {
    // target: "http://10.15.111.6:8088/", 
    target: "https://tyzy.jsghfw.com/jss_zgh_gxpt",
    changeOrigin: true,
    pathRewrite: { "^/api": "" },
  },
};
