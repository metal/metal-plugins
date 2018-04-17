const webpack = require('webpack');

module.exports = {
	entry: './src/Affix.js',
	module: {
		rules: [{
			test: /\.js$/,
			exclude: /(node_modules)/,
			use: {
				loader: 'babel-loader',
				options: {
					compact: false,
					presets: ['env']
				}
			}
		}]
	},
	output: {
		library: 'metal',
		libraryTarget: 'this',
		filename: './build/globals/affix.js'
	},
	plugins: [
		new webpack.optimize.ModuleConcatenationPlugin()
	]
};
