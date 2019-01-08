const path = require('path')

module.exports = {
  entry: "./src/index.js",
  output: {
    filename: "j-iso8583.js",
    libraryTarget: 'umd',
  },
  resolve: {
    // Add '.ts' and '.tsx' as a resolvable extension.
    extensions: [".webpack.js", ".web.js", ".ts", ".tsx", ".js"],
    alias: {
      '@': path.resolve('./'),
    }    
  },
  module: {
    rules: [
      { test: /\.js$/, loader: 'babel-loader', exclude: /(node_modules)/},
      
      // all files with a '.ts' or '.tsx' extension will be handled by 'ts-loader'
      { test: /\.tsx?$/, loader: "ts-loader" }
    ]
  }
};