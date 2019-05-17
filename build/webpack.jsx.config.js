const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const webpack = require('webpack')

module.exports = {
  mode: 'development',
  entry: './demo/index.js',
  output: {
    filename: 'demo.js',
    path: path.resolve(__dirname, 'demo/dist'),
  },
  devtool: 'eval-source-map',
  module: {
    rules: [
      {
        test: /.js$/,
        use: 'babel-loader'
      },
      {
        test: /.s[c|a]ss$/,
        use: ['style-loader', 'css-loader', 'sass-loader']
      },
      {
        test: /.ts$/,
        use: 'ts-loader',
        exclude: /node_modules/
      }
    ]
  },
  devServer: {
    clientLogLevel: 'warning',
    hot: true,
    compress: true
  },
  plugins: [
    new webpack.HotModuleReplacementPlugin(),
    new HtmlWebpackPlugin({
      filename: 'index.html',
      template: 'demo/index.html',
      inject: true
    }),
  ],
  resolve: {
    extensions: ['.tsx', '.ts', '.js']
  }
}
