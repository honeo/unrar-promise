/*
	コンテンツを指定して展開する

		引数
			1: string
				入力する.rar書庫のパス
			2: string or array
				展開するコンテンツ名の文字列、またはその配列。
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

async function extract(input, _target, _output, password){

	// 配列でなければ配列化
	const targetArr = is.arr(_target) ?
		_target:
		[_target];

	// validation
	if( !is.str(input, ...targetArr, _output) ){
		throw new TypeError(`Invalid arguments`);
	}

	// フルパス化
	const output = path.resolve(_output);

	const buffer = await fse.readFile(input);
	const extractor = Unrar.createExtractorFromData(buffer, password);
	const [obj_state, obj_header] = extractor.extractFiles(targetArr, password);

	// 展開失敗時はここでエラー投げて終了
	if( obj_state.state!=='SUCCESS' ){
		throw new Error('extract failed');
	}


	const {files, arcHeader} = obj_header;
	for(let file of files){
		const {fileHeader, extract} = file;
		const [obj_state, uint8arr_content] = extract;
		const name = fileHeader.name;
		const outputPath = path.join(output, name);
		if( uint8arr_content ){
		// file
			await fse.outputFile(outputPath, uint8arr_content);
		}else{
		// dir
			await fse.ensureDir(outputPath)
		}
	}
	return output;
}

module.exports = extract;
