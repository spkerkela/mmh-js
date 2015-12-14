/* global __dirname */
module.exports = {
	entry: "./src/entry.js",
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
	}
}