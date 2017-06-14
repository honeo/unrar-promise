/*
	コンテンツを全て展開する

		引数
			1: string
				入力する.rar書庫のパス
			2: string
				出力するディレクトリのパス。
		返り値
			promise
				出力先ディレクトリのパス文字列を引数に解決する。
*/

// Mod
const fse = require("fs-extra");
const path = require('path');
const Unrar = require('node-unrar-js');
const {is, not, any} = require('@honeo/check');

async function extractAll(input, _output, password){

	// validation
	if( !is.str(input, _output) ){
		throw new TypeError(`Invalid arguments`);
	}

	// フルパス化
	const output = path.resolve(_output);

	const buffer = await fse.readFile(input);
	const extractor = Unrar.createExtractorFromData(buffer, password);
	const [{state: state}, result] = extractor.extractAll();

	// 展開失敗時はここでエラー投げて終了
	if( state!=='SUCCESS' ){
		throw new Error('extract failed');
	}

	const {files, arcHeader} = result;
	for(let {fileHeader, extract} of files){
		const [{state: state}, extractedContent] = extract;
		const name = fileHeader.name;
		const outputPath = path.join(output, name);
		if( extractedContent ){
		// file
			// const size = extractedContent.length;
			await fse.outputFile(outputPath, extractedContent);
		}else{
		// dir
			await fse.ensureDir(outputPath)
		}
	}
	return output;
}

module.exports = extractAll;
