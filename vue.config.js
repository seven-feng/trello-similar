module.exports = {
    publicPath: process.env.NODE_ENV === 'production'
      ? '/production-sub-path/'
      : '/',
      devServer: {
        port: 8088
      }
  }