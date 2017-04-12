const path = require('path')
const webpack = require('webpack')

module.exports = {
    entry: './index.js',
    output: {
        filename: 'pagin.min.js',
        path: path.resolve(__dirname, 'dist')
    },
    plugins: [
        new webpack.optimize.UglifyJsPlugin(),
    ],
    module: {
        rules: [{
            test: /\.(js|jsx)$/,
            use: 'babel-loader'
        }]
    }
}
