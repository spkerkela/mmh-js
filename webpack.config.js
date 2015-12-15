/* global __dirname */
var CopyWebpackPlugin = require('copy-webpack-plugin')
var path = require('path')

module.exports = {
	entry: "./src/js/entry.js",
	target: "web",
	output: {
		path: __dirname + "/out",
		filename: 'bundle.js'
	},
	module: {
		loaders: [
			{ test: /\.css$/, loader: "style!css" },
			{ test: /\.jsx?$/, exclude: /node_modules/, loader: "babel-loader",
			  query: { presets: ['react', 'es2015']}}
		]
	},
	plugins: [
		new CopyWebpackPlugin([
			{from: './src/html'}
		])
	]
}