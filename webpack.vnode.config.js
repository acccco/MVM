var path = require('path');
var UglifyJsPlugin = require('uglifyjs-webpack-plugin')

module.exports = {
    mode: 'production',
    entry: './vnode/index.js',
    output: {
        filename: 'vnode.js',
        path: path.resolve(__dirname, 'package'),
        library: "vnode",
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
        new UglifyJsPlugin()
    ]
};