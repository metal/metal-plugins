const webpack = require('webpack');
const UglifyJSPlugin = require('uglifyjs-webpack-plugin');

let common = {
    entry: './src/Anim.js',
    module: {
        rules: [{
            test: /\.js$/,
            exclude: /(node_modules)/,
            use: {
                loader: 'babel-loader',
                options: {
                    compact: false,
                    presets: ['env'],
                    plugins: ['babel-plugin-transform-node-env-inline'],
                },
            },
        }],
    },
};

let bundle = Object.assign({
    devtool: 'source-map',
    output: {
        library: 'metal',
        libraryTarget: 'global',
        filename: './build/globals/anim.js',
    },
    plugins: [
        new webpack.optimize.ModuleConcatenationPlugin(),
    ],
}, common);

let minified = Object.assign({
    output: {
        library: 'metal',
        libraryTarget: 'global',
        filename: './build/globals/anim-min.js',
    },
    plugins: [
        new webpack.optimize.ModuleConcatenationPlugin(),
        new UglifyJSPlugin(),
    ],
}, common);


module.exports = [bundle, minified];
