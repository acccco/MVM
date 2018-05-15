module.exports = {
    entry: {
        app: '../src/index.js'
    },
    output: {
        path: '../package',
        filename: 'MVM.js'
    },
    resolve: {
        extensions: ['.js', '.mjs']
    },
    devtool: '#source-map',
    module: {
        rules: [
            {
                test: /\.js$/,
                loader: 'babel-loader'
            }
        ]
    }
}
