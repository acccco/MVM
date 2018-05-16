var path = require('path');
var UglifyJsPlugin = require('uglifyjs-webpack-plugin')

module.exports = {
    mode: 'production',
    entry: './src/index.js',
    output: {
        filename: 'Mvm.js',
        path: path.resolve(__dirname, 'package'),
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
        new UglifyJsPlugin()
    ]
};