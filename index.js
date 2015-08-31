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
		pluginMap: {
			amdParse: amdParse,
			amdWrap: amdWrap,
			autoprefixer: autoprefixer,
			cssUrlParse: cssUrlParse,
			ftlParse: ftlParse,
			inlineContentParse: inlineContentParse,
			inlineParse: inlineParse,
			lessParse: lessParse,
			liveReload: liveReload,
			replace: replace,
			urlParse: urlParse
		},

		taskMap: {
			empty: {
				test: /(?:\.ftl|require|jquery\/.*|echarts\/.*|zrender\/.*)\.js$/,
				plugins: []
			},

			js: {
				test: /\.js$/,
				plugins: [
					{
						plugin: replace,
						option: {
							replace: [{test: /__debug__/g, value: 'true'}]
						}
					},
					urlParse,
					{
						plugin: amdParse,
						option: {
							ignore: ['jquery', /^echarts/, /^zrender/]
						}
					},
					inlineContentParse
				]
			},

			css: {
				test: /\.css$/,
				plugins: [
					urlParse,
					cssUrlParse,
					autoprefixer,
					inlineContentParse
				]
			},

			less: {
				test: /\.less$/,
				plugins: [
					urlParse,
					lessParse,
					cssUrlParse,
					autoprefixer,
					inlineContentParse
				]
			},

			ftl: {
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

			html: {
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
		},

		tasks: ['empty', 'js', 'css', 'less', 'ftl', 'html'],

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
