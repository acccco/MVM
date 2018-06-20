var path = require('path');

module.exports = {
  mode: 'production',
  entry: './src/index.js',
  output: {
    filename: 'RD.js',
    path: path.resolve(__dirname, '../dist'),
    library: "RD",
    libraryTarget: 'umd',
    libraryExport: "default"
  },
  module: {
    rules: [
      {
        test: /.js$/,
        loader: 'babel-loader'
      }
    ]
  }
};