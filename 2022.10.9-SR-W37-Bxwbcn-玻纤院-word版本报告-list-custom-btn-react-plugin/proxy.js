module.exports = {
  "/api": {
    // 'target': 'http://10.15.111.9:7251/',
    target: "http://10.15.111.15:45603/",
    changeOrigin: true,
    pathRewrite: { "^/api": "" },
  },
};
