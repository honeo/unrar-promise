/*
	コンテンツ一覧を配列で返す。

		引数
			1: string
				入力する.rarファイルのパス
		返り値
			array
*/

// Mod
const fse = require("fs-extra");
const path = require('path');
const Unrar = require('node-unrar-js');
const {is, not, any} = require('@honeo/check');

async function list(input, password){
	// validation
	if( not.str(input) ){
		throw new TypeError('Invalid arguments');
	}

	const buffer = await fse.readFile(input);
	const extractor = Unrar.createExtractorFromData(buffer, password);
	const [{state: state}, result] = extractor.getFileList();

	// 展開失敗時はここでエラー投げて終了
	if( state!=='SUCCESS' ){
		throw new Error('extract failed');
	}

	const {arcHeader, fileHeaders} = result;
	return fileHeaders.map( (content)=>{
		return path.normalize(content.name);
	});
}

module.exports = list;
