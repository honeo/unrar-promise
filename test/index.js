/*
	Test
		テスト用の書庫ファイル ./example.rar をコピーして使う。
		example-encrypted.rarは暗号化されているだけで中身は同じ。

		example.rar [
			example [
				hoge.txt,
				foo [
					bar.txt
				],
				empty []
			]
		]

	Bug
		Atomからterminalやscriptsで実行すると @honeo/test か node-unrar-js が実行時に削除される。
		package.jsonの依存からも外されてしまう。わけわからん。

*/
const {name, version} = require('../package.json');
console.log(`${name} v${version}: test`);

// Modules
const Test = require('@honeo/test');
const unrarp = require('../');
const path = require('path');
const fse = require('fs-extra');
const {is, not, any} = require('@honeo/check');

// Var
const file_example = path.resolve('./example.rar');
const file_example_encrypted = path.resolve('./example-encrypted.rar');

Test([

	async function(){
		console.log('init check, find example.rar');
		return fse.exists('example.rar');
	},

	async function(){
		console.log('.extract() single');
		const dirPath = await unrarp.extract('example.rar', 'example/hoge.txt', './');
		return is.true(
			dirPath===process.cwd(),
			await fse.exists('example'),
			await fse.exists('example/hoge.txt')
		);
	},


	async function(){
		console.log('.extract() single encrypt');
		const dirPath = await unrarp.extract('example-encrypted.rar', 'example-encrypted/hoge.txt', './', 'password');
		return is.true(
			dirPath===process.cwd(),
			await fse.exists('example-encrypted'),
			await fse.exists('example-encrypted/hoge.txt')
		);
	},

	async function(){
		console.log('.extract() multi');
		const dirPath = await unrarp.extract('example-encrypted.rar', [
			'example-encrypted/hoge.txt',
			'example-encrypted/foo/bar.txt',
			'example-encrypted/empty'
		], './', 'password');
		return is.true(
			dirPath===process.cwd(),
			await fse.exists('example-encrypted'),
			await fse.exists('example-encrypted/hoge.txt'),
			await fse.exists('example-encrypted/foo/bar.txt'),
			await fse.exists('example-encrypted/empty')
		);
	},

	async function(){
		console.log('.extractAll()');
		const dirPath = await unrarp.extractAll('example.rar', './');
		return is.true(
			dirPath===process.cwd(),
			await fse.exists('example'),
			await fse.exists('example/hoge.txt'),
			await fse.exists('example/foo'),
			await fse.exists('example/foo/bar.txt'),
			await fse.exists('example/empty')
		);
	},

	async function(){
		console.log('.extractAll() encrypt');
		const dirPath = await unrarp.extractAll('example-encrypted.rar', './', 'password');
		return is.true(
			dirPath===process.cwd(),
			await fse.exists('example-encrypted'),
			await fse.exists('example-encrypted/hoge.txt'),
			await fse.exists('example-encrypted/foo'),
			await fse.exists('example-encrypted/foo/bar.txt'),
			await fse.exists('example-encrypted/empty')
		);
	},

	async function(){
		console.log('.list()');
		const arr = await unrarp.list('example.rar');
		return arr.length===5;
	},

	async function(){
		console.log('.list() encrypt');
		const arr = await unrarp.list('example-encrypted.rar', 'password');
		return arr.length===5;
	}

], {
	chtmpdir: true,
	console: true,
	exit: true,
	async init(){
		// 実行場所に example.rar と example-encrypted.rar をコピー
		await fse.copy(file_example, './example.rar');
		await fse.copy(file_example_encrypted, './example-encrypted.rar');
	}
}).then( (arg)=>{

}).catch( (err)=>{

});
