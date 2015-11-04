var path = require('path');

var amdParse = require('miaow-amd-parse');
var babelParse = require('miaow-babel-parse');
var ftlParse = require('miaow-ftl-parse');
var inlineParse = require('miaow-inline-parse');
var lessParse = require('miaow-less-parse');
var liveReload = require('miaow-livereload');
var replace = require('miaow-replace');
var urlParse = require('miaow-url-parse');

var ThirdPartyPlugin = require('miaow-thirdparty-plugin');
var PackPlugin = require('miaow-pack-plugin');


var autoprefixer = {
	task: require('miaow-css-autoprefixer'),
	options: {
		browsers: ['> 1%', 'last 2 versions', 'Firefox ESR', 'Android >= 2.1']
	}
};
var cssUrlParse = {
	task: urlParse,
	options: {
		regexp: /url\s*\(\s*['"]?([\w_\/\.\-]+)(?:[?#].*?)?['"]?\)/g
	}
};
var inlineContentParse = {
	task: inlineParse,
	options: {
		regexp: /((?:\/\*|<!--)\s*inline\s+['"]([\w\_\/\.\-]+)['"]\s*(?:\*\/|-->))/g,
		type: 'content'
	}
};
var debugReplace = {
	task: replace,
	options: {
		replace: [{test: /__debug__/g, value: 'true'}]
	}
};

// 默认配置
var config = {
	// 工作目录
	context: path.resolve('./src'),

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
	hashLength: 0,

	// hash值连接符
	hashConcat: '.',

	// 域名
	domain: '',

	plugins: [
		new ThirdPartyPlugin({test: '*.+(js|es6)', tasks: []}),
		new PackPlugin({debug: true})
	],

	modules: [
		{
			test: '*.ftl.js',
			tasks: []
		},

		{
			test: '*.js',
			tasks: [
				debugReplace,
				urlParse,
				{
					task: amdParse,
					options: {
						debug: true
					}
				},
				inlineContentParse
			]
		},

		{
			test: '*.es6',
			ext: '.js',
			tasks: [
				debugReplace,
				urlParse,
				{
					task: babelParse,
					options: {
						blacklist: ['strict'],
						optional: ['es7.classProperties'],
						modules: 'amd'
					}
				},
				{
					task: amdParse,
					options: {
						debug: true
					}
				},
				inlineContentParse
			]
		},

		{
			test: '*.css',
			tasks: [
				urlParse,
				cssUrlParse,
				autoprefixer,
				inlineContentParse
			]
		},

		{
			test: '*.less',
			ext: '.css',
			tasks: [
				urlParse,
				lessParse,
				autoprefixer,
				inlineContentParse
			]
		},

		{
			test: '*.ftl',
			domain: '',
			hashLength: 0,
			tasks: [
				urlParse,
				debugReplace,
				{
					task: ftlParse,
					options: {
						macroNameList: ['static', 'docHead', 'docFoot', 'jsFile', 'cssFile'],
						macroArgList: ['js', 'css', 'file', 'mockjax']
					}
				},
				{
					task: liveReload,
					options: {
						placeholder: '<#-- livereload -->'
					}
				},
				inlineContentParse
			]
		},

		{
			test: '*.+(html|tpl)',
			tasks: [
				urlParse,
				debugReplace,
				{
					task: liveReload,
					options: {
						placeholder: '<!-- livereload -->'
					}
				},
				inlineContentParse
			]
		}
	],

	resolve: {
		moduleDirectory: ['common', ".remote"],
		extensions: ['.js', '.es6'],
		extensionAlias: {
			'.css': ['.less']
		}
	}
};

module.exports = config;
