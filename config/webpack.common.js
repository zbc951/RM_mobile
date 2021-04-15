var webpack = require('webpack');
var HtmlWebpackPlugin = require('html-webpack-plugin');
var ExtractTextPlugin = require('extract-text-webpack-plugin');
var CopyWebpackPlugin = require('copy-webpack-plugin');
var autoprefixer      = require('autoprefixer')
var helpers = require('./helpers');
var path = require('path');

module.exports = function (_isProd) {
	return {
		entry: {
			'polyfills': [
				'core-js/client/shim.js',
				'core-js/es7/reflect.js',
				'zone.js/dist/zone.js',
				'web-animations-js/web-animations.min',
				'./src/polyfills.ts',
				'jquery',
				'hammerjs'
			],
			'vendor': './src/vendor.ts',
			'app': './src/main.ts'
		},

		resolve: {
			alias: {
				lib: path.resolve('./src/lib/'),
				service: path.resolve('./src/service/')
			},
			extensions: ['.ts', '.js']
		},

		module: {
			rules: [
				{
					test: /\.ts$/,
					loader: _isProd === 'production' ? [
						'@ngtools/webpack'
					] : [
						'angular2-template-loader',
						'awesome-typescript-loader',
					]
				},
				{
					test: /\.html$/,
					loader: 'html-loader'
				},
				{
					test: /\.(png|jpe?g|gif|svg|woff|woff2|ttf|eot)$/,
					loader: 'file-loader?name=assets/[name].[ext]'
				},
				{
					test: /\.css$/,
					exclude: [
						helpers.root('src', 'app')
					],
					loader: ExtractTextPlugin.extract({
						fallbackLoader: 'style-loader',
						loader: 'css-loader!autoprefixer-loader'
					})
				},
				{
					test: /\.css$/,
					include: helpers.root('src', 'app'),
					loader: 'raw-loader'
				},
				{
					test: /\.scss$/,
					include: helpers.root('src', 'app'),
					loader: ['raw-loader', 'sass-loader']
				},
				{
					test: /\.scss$/,
					exclude: [
						helpers.root('src', 'app')
					],
					loader: ExtractTextPlugin.extract({
						fallbackLoader: 'style-loader',
						loader: ['css-loader', 'sass-loader', 'autoprefixer-loader']
					})
				}
			]
		},

		plugins: [
			new webpack.optimize.CommonsChunkPlugin({
				name: ['plugins', 'app', 'vendor',  'polyfills']
			}),
			new webpack.ContextReplacementPlugin(
				// The (\\|\/) piece accounts for path separators in *nix and Windows
				// /angular(\\|\/)core(\\|\/)(esm(\\|\/)src|src)(\\|\/)linker/,
				/angular(\\|\/)core(\\|\/)@angular/,
				helpers.root('./src'), // location of your src
				{} // a map of your routes
			),
			new CopyWebpackPlugin([
				{
					from: 'src/img',
					to: 'assets'
				},
				{
					from: 'src/js',
					to: 'js'
				},
				{
					from: 'src/file',
					to: 'file'
				},
				{
					from: 'src/css',
					to: 'css'
				}
			]),
			new HtmlWebpackPlugin({
				template: 'src/index.html'
			})
		]
	}
};