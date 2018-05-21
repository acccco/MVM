var path = require('path');
var HtmlWebpackPlugin = require('html-webpack-plugin')
var webpack = require('webpack')

module.exports = {
    mode: 'none',
    entry: './demo/src/index.js',
    output: {
        filename: 'test.js',
        path: path.resolve(__dirname, 'demo/dist'),
    },
    devtool: "eval-source-map",
    module: {
        rules: [
            {
                test: /.js$/,
                loader: 'babel-loader'
            }
        ]
    },
    plugins: [
        new webpack.HotModuleReplacementPlugin(),
        new HtmlWebpackPlugin({
            filename: 'index.html',
            template: 'demo/index.html',
            inject: true
        }),
    ]
};