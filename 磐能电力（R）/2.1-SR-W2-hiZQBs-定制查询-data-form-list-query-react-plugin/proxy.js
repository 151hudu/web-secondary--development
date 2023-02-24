module.exports = {
  '/api': {
    // target: 'http://localhost:8080',
    // target: 'http://10.15.111.9:13063',
    // target: 'http://10.15.111.15:44545/',
    target: 'http://10.15.70.38:18080/',
    changeOrigin: true,
    pathRewrite: { '^/api': '' },
  },
};
