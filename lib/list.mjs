// Mod
import console from 'console-wrapper';
import fse from "fs-extra";
import path from 'path';
import sanitize from 'sanitize-filename';
import Unrar from 'node-unrar-js';
import {is, not, any} from '@honeo/check';

// Var
const obj_defaultOp = {}

/*
	コンテンツ一覧を配列で返す。

		引数
			1: string
				入力する.rarファイルのパス
		返り値
			array
*/
async function list(input, _options={}){
	console.group('list()');
	console.log(input);
	console.log(_options);

	// validation
	if( is.false(
		is.str(input),
		is.arrbuf(input)
	) ){
		throw new TypeError(`Invalid arguments 1: not string of arraybuffer`);
	}
	if( not.obj(_options) ){
		throw new TypeError(`Invalid arguments 2: not object`);
	}

	// var
	const options = {...obj_defaultOp, ..._options}
	const arrbuf = await (async function(){
		if( is.str(input) ){
			console.log('input: path');
			return Uint8Array.from(
				await fse.readFile(input)
			).buffer;
		}else{
			console.log('input: arraybuffer');
			return input;
		}
	}());
	const extractor = await Unrar.createExtractorFromData({
		data: arrbuf,
		password: options.password
	});

	const {arcHeader, fileHeaders} = extractor.getFileList();
	const arr_contents = [];
	let count = 0;
	for(let fileHeader of fileHeaders){
		// 正規化
		const {dir, base} = path.parse(fileHeader.name);
		const base_sanitized = sanitize(base);
		const str_contentPath = path.normalize(
			path.join(dir, base_sanitized)
		);
		const str_contentType = fileHeader.flags.directory ?
			'directory':
			'file';
		const obj_content = {
			path: str_contentPath,
			size: fileHeader.packSize,
			type: str_contentType
		}
		console.log(++count, obj_content);
		arr_contents.push(obj_content);
	}
	arr_contents.reverse(); // 直感的にする
	console.log('result', arr_contents);
	console.groupEnd();
	return arr_contents;
}

export default list;
