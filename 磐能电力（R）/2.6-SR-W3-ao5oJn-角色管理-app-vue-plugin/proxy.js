module.exports = {
  '/api': {
    // 'target': 'http://192.168.1.240:43210/',
    'target': 'http://10.15.111.9:13098/',
    'changeOrigin': true,
    'pathRewrite': { '^/api': '' },
  },
}