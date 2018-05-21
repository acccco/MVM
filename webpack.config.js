var path = require('path');
var UglifyJsPlugin = require('uglifyjs-webpack-plugin')

module.exports = {
    mode: 'production',
    entry: './src/index.js',
    output: {
        filename: 'RD.js',
        path: path.resolve(__dirname, 'package'),
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
    },
    plugins: [
        new UglifyJsPlugin()
    ]
};