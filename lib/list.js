/*
	コンテンツ一覧を配列で返す。

		引数
			1: string
				入力する.rarファイルのパス
		返り値
			array
*/

// Mod
const console = require('console-wrapper');
const fse = require("fs-extra");
const path = require('path');
const sanitize = require('sanitize-filename');
const Unrar = require('node-unrar-js');
const {is, not, any} = require('@honeo/check');

async function list(input, _options={}){
	console.group('list()', input, _options);

	// validation
	if( not.str(input) ){
		throw new TypeError(`Invalid arguments 1: ${input}`);
	}
	if( not.obj(_options) ){
		throw new TypeError(`Invalid arguments 2: ${_options}`);
	}

	const options = Object.assign({}, _options);
	const buffer = Uint8Array.from(
		await fse.readFile(input)
	).buffer;
	const extractor = Unrar.createExtractorFromData(buffer, options.password);
	const [{state: state}, result] = extractor.getFileList();

	// 展開失敗時はここでエラー投げて終了
	if( state!=='SUCCESS' ){
		throw new Error('parse failed');
	}

	const {arcHeader, fileHeaders} = result;
	const arr = fileHeaders.map( (file, index)=>{

		// 正規化, dirなら末尾/を補完
		const {dir, base} = path.parse(file.name);
		file.name = path.normalize(path.join(
			dir,
			file.flags.directory ?
				sanitize(base)+'/':
				sanitize(base)
		));

		const str_outputContentPath = path.normalize(file.name);
		console.log(`${index} :${str_outputContentPath}`);
		return str_outputContentPath;
	});

	console.log(`result: array, length ${arr.length}`);
	console.groupEnd();
	return arr;
}

module.exports = list;
