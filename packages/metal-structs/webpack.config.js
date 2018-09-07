const webpack = require('webpack');
const UglifyJSPlugin = require('uglifyjs-webpack-plugin');
const packageName = require('./package.json').name.slice(6);

let common = {
	entry: `./src/all/${packageName}.js`,
	module: {
		rules: [{
			test: /\.js$/,
			exclude: /(node_modules)/,
			use: {
				loader: 'babel-loader',
				options: {
					compact: false,
					presets: ['@babel/preset-env'],
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
		libraryTarget: 'this',
		filename: `./build/globals/${packageName}.js`,
	},
	plugins: [
		new webpack.optimize.ModuleConcatenationPlugin(),
	],
}, common);

let minified = Object.assign({
	output: {
		library: 'metal',
		libraryTarget: 'this',
		filename: `./build/globals/${packageName}-min.js`,
	},
	plugins: [
		new webpack.optimize.ModuleConcatenationPlugin(),
		new UglifyJSPlugin(),
	],
}, common);


module.exports = [bundle, minified];