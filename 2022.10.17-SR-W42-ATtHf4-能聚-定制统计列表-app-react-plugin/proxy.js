module.exports = {
  '/api': {
    'target': 'http://10.15.111.12:12200/', 
    // 'target': 'http://10.15.60.58:8080', 
    'changeOrigin': true,
    'pathRewrite': { '^/api' : '' },
  },
}