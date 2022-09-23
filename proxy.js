module.exports = {
  "/api": {
    target: "http://121.36.134.217:18080/",
    changeOrigin: true,
    pathRewrite: { "^/api": "" },
  },
};
