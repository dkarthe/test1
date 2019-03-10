const webpack = require('webpack');
const path = require('path');
const Dotenv = require('dotenv-webpack');

const config = {
    entry: './src/Index.jsx',
    output: {
        path: path.resolve(__dirname, 'build'),
        filename: 'bundle.js'
    },
    module: {
        rules: [{
            test: /\.(js|jsx)$/,
            exclude: /node_modules/,
            use: 'babel-loader'
        }],
    },
    resolve: {
        extensions: [
            '.js',
            '.jsx'
        ],
        alias: {
            'react-dom': '@hot-loader/react-dom'
        }
    },
    devServer: {
        contentBase: './dist',
        // required for routing
        historyApiFallback: true,
    },
    plugins: [
        new Dotenv(),
    ]
}

module.exports = config;