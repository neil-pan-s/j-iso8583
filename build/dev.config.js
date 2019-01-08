const config = require('./webpack.config')

module.exports = Object.assign({
  mode: 'development',
  devtool: 'source-map',
}, config)