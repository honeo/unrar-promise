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

*/


// Modules
import console from 'console-wrapper';
import Test from '@honeo/test';
import {unrar, list} from '../index.mjs';
import path from 'path';
import fse from 'fs-extra';
import {is, not, any} from '@honeo/check';

// Var
const obj_options = {
	chtmpdir: true,
	console: true,
	exit: true,
	tmpdirOrigin: './test/contents'
}

console.enable();


Test([

	async function(){
		console.log('unrar(rar, cwd)');
		const dirPath = await unrar('example.rar', './');

		return is.true(
			dirPath===process.cwd(),
			await fse.exists('example'),
			await fse.exists('example/hoge.txt')
		);
	},

	async function(){
		console.log('unrar(buf, cwd)');
		const arraybuffer = Uint8Array.from(
			await fse.readFile('example.rar')
		).buffer;
		const dirPath = await unrar(arraybuffer, './');
		return is.true(
			dirPath===process.cwd(),
			await fse.exists('example'),
			await fse.exists('example/hoge.txt')
		);
	},

	async function(){
		console.log('unrar(rar, NotExistDir)');
		const dirPath = await unrar('example.rar', 'output');
		console.log(
		);
		return is.true(
			dirPath===path.join(process.cwd(), 'output'),
			await fse.exists('./output/example/hoge.txt')
		);
	},

	async function(){
		console.log('unrar(rar, cwd) - case overwrite skip');
		await unrar('example.rar', './');
		const stats_before = await fse.stat('example/hoge.txt');
		await unrar('example.rar', './');
		const stats_after = await fse.stat('example/hoge.txt');
		return stats_before.atimeMs===stats_after.atimeMs;
	},

	// Atom内臓Node.js(v14)だと何故かコケる
	async function(){
		console.log('unrar(rar, cwd, {overwrite: true})');
		await unrar('example.rar', './');
		const stats_before = await fse.stat('example/hoge.txt');
		await unrar('example.rar', './', {overwrite: true});
		const stats_after = await fse.stat('example/hoge.txt');
		return stats_before.atimeMs!==stats_after.atimeMs;
	},


	async function(){
		console.log('unrar(rar, cwd, {filter(){}}) - through');
		let count = 0;
		await unrar('example.rar', './', {
			filter({path, type}){
				count++;
				if( !is.str(path, type) ){
					throw new Error('filter');
				}
			}
		});
		return count===5
	},


	async function(){
		console.log('unrar(rar, cwd, {filter(){}}) - dir only');
		await unrar('example.rar', './', {
			filter({path, type}){
				return type==='directory';
			}
		});
		return is.false(
			await fse.exists('example/foo/bar.txt'),
			await fse.exists('example/hoge.txt')
		);
	},

	async function(){
		console.log('unrar(rar-encrypted, cwd, {password})');
		const dirPath = await unrar(
			'example-encrypted.rar',
			'./',
			{password: 'password'}
		);
		return is.true(
			dirPath===process.cwd(),
			await fse.exists('example-encrypted/hoge.txt'),
			await fse.exists('example-encrypted/foo/bar.txt'),
			await fse.exists('example-encrypted/empty')
		);
	},


	async function(){
		console.log('list(rar)');
		const arr = await list('example.rar');
		return arr.length===5;
	},

	async function(){
		console.log('list(buf)');
		const arraybuffer =  Uint8Array.from(
			await fse.readFile('example.rar')
		).buffer;
		const arr = await list(arraybuffer);
		return arr.length===5;
	},

	async function(){
		console.log('list(rar-encrypted, {password}');
		const arr = await list(
			'example-encrypted.rar',
			{password: 'password'}
		);
		return arr.length===5;
	},


	async function(){
		console.log('list(rar) - 日本語パスを含む書庫');
		const arr = await list('CP932.rar');
		return is.true(
			is.arr(arr),
			arr.length===2,
			arr[0].path==='ディレクトリ',
			arr[1].path===path.normalize('ディレクトリ/テキストファイル.txt')
		);
	}

], obj_options);
