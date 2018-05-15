var path = require('path');
var UglifyJsPlugin = require('uglifyjs-webpack-plugin')
var webpack = require('webpack');

module.exports = {
    mode: 'production',
    entry: './src/index.js',
    output: {
        filename: 'Mvm.js',
        path: path.resolve(__dirname, 'dist'),
        library: "Mvm",
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
    },
    plugins: [
        new UglifyJsPlugin(),
    ]
};