var path = require('path');

var amdParse = require('miaow-amd-parse');
var amdWrap = require('miaow-amd-wrap');
var autoprefixer = require('miaow-css-autoprefixer');
var ftlParse = require('miaow-ftl-parse');
var inlineParse = require('miaow-inline-parse');
var lessParse = require('miaow-less-parse');
var liveReload = require('miaow-livereload');
var replace = require('miaow-replace');
var urlParse = require('miaow-url-parse');


var cssUrlParse = {
	plugin: urlParse,
	option: {
		reg: /url\s*\(\s*['"]?([\w_\/\.\-]+)(?:[?#].*?)?['"]?\)/g
	}
};
var inlineContentParse = {
	plugin: inlineParse,
	option: {
		regexp: /((?:\/\*|<!--)\s*inline\s+['"]([\w\_\/\.\-]+)['"]\s*(?:\*\/|-->))/g,
		type: 'content'
	}
};

// 默认配置
var config = {
	// 工作目录
	cwd: path.resolve('./src'),

	// 输出目录
	output: path.resolve('./build'),

	// 缓存目录
	cache: path.resolve('./cache'),

	environment: 'default',

	// 排除目录
	exclude: [
		'build/**/*',
		'cache/**/*',
		'release/**/*',
		'**/node_modules/**/*',
		'**/*.md',
		'**/bower.json',
		'**/gulpfile.js',
		'**/miaow.config.js',
		'**/miaow.local.js',
		'**/package.json',
		'**/webpack.config.js'
	],

	// 不追加hash
	hash: 0,

	// hash值连接符
	hashConcat: '.',

	// 域名
	domain: '',

	module: {
		tasks: [
			// ftl动态假数据, RequireJS和jQuery(及其目录下的)也不做处理
			{
				test: /(?:\.ftl|require|jquery|jquery\/.*)\.js$/,
				plugins: []
			},

			{
				test: /\.js$/,
				plugins: [
					{
						plugin: replace,
						option: {
							replace: [{test: /__debug__/g, value: 'true'}]
						}
					},
					urlParse,
					amdWrap,
					{
						plugin: amdParse,
						option: {
							ignore: ['jquery']
						}
					},
					inlineContentParse
				]
			},

			{
				test: /\.css$/,
				plugins: [
					urlParse,
					cssUrlParse,
					autoprefixer,
					inlineContentParse
				]
			},

			{
				test: /\.less$/,
				plugins: [
					urlParse,
					lessParse,
					cssUrlParse,
					autoprefixer,
					inlineContentParse
				]
			},

			{
				test: /\.ftl$/,
				plugins: [
					urlParse,
					{
						plugin: replace,
						option: {
							replace: [{test: /__debug__/g, value: 'true'}]
						}
					},
					{
						plugin: ftlParse,
						option: {
							macroNameList: ['static', 'docHead', 'docFoot', 'jsFile', 'cssFile'],
							macroArgList: ['js', 'css', 'file', 'mockjax'],
							macroDebug: false
						}
					},
					{
						plugin: liveReload,
						option: {
							placeholder: '<#-- livereload -->'
						}
					},
					inlineContentParse
				]
			},

			{
				test: /\.htm[l]?$/,
				plugins: [
					urlParse,
					{
						plugin: replace,
						option: {
							replace: [{test: /__debug__/g, value: 'true'}]
						}
					},
					{
						plugin: liveReload,
						option: {
							placeholder: '<!-- livereload -->'
						}
					},
					inlineContentParse
				]
			}
		],

		// 文件生成配置
		road: [
			{
				test: /\.ftl$/,
				useHash: false,
				domain: ''
			},

			{
				test: /(.*)\.less$/,
				release: '$1.css'
			}
		]
	},

	resolve: {
		moduleDirectory: ['common', ".remote"],
		extensions: ['.js'],
		extensionAlias: {
			'.css': ['.less']
		}
	}
};

module.exports = config;
