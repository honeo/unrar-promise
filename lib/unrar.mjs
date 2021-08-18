// Mod: npm
import console from 'console-wrapper';
import fse from "fs-extra";
import path from 'path';
import sanitize from 'sanitize-filename';
import Unrar from 'node-unrar-js';
import {is, not, any} from '@honeo/check';
// Local
import list from './list.mjs';

// Var
const obj_defaultOp = {
	filter: null,
	overwrite: false
}


/*
	コンテンツを指定して展開する

		引数
			1: string
				入力する.rar書庫のパス。
			2: string
				出力するディレクトリのパス。
		返り値
			promise
				出力先ディレクトリのパス文字列を引数に解決する。
*/
async function unrar(input, _output, _options={}){
	console.group('unrar()');
	console.log(_output);
	console.log(_options);

	// validation
	if( is.false(
		is.str(input),
		is.arrbuf(input)
	) ){
		throw new TypeError(`Invalid arguments 1: not string of arraybuffer`);
	}
	if( not.str(_output) ){
		throw new TypeError(`Invalid arguments 2: not string`);
	}
	if( not.obj(_options) ){
		throw new TypeError(`Invalid arguments 3: not object`);
	}

	// var
	const output = path.resolve(_output); 	// 出力先Dirのフルパス化
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
	const isFilter = is.func(options.filter);

	// 応急処置, dir作成
	await emergency(arrbuf, output, options);


	const extractor = await Unrar.createExtractorFromData({
		data: arrbuf,
		password: options.password
	});
	const {arcHeader, files} = extractor.extract({});

	let count = 0;
	for(let {fileHeader, extraction} of files){
		const isDir = fileHeader.flags.directory;
		console.log(++count, `${isDir?'directory':'file'}: ${fileHeader.name}`);
		// 正規化
		const {dir, base} = path.parse(fileHeader.name);
		const base_sanitized = sanitize(base);
		fileHeader.name = path.normalize(path.join(
			dir,
			base_sanitized
		));
		const str_outputContentFullpath = path.join(output, fileHeader.name);

		// options.filter
		if( isFilter ){
			const type = isDir ?
				'directory': 'file';
			const str_contentPath = fileHeader.name;
			const isSkip = options.filter({
				type,
				path: str_contentPath,
				size: fileHeader.packSize
			})===false;
			console.log('options.filster:', isSkip);
			if( isSkip ){
				continue;
			}
		}else{
			console.log('options.filter: not function');
		}

		// dirなら作成
		if( isDir ){
			console.log(`ensure: ${str_outputContentFullpath}`);
			await fse.ensureDir(str_outputContentFullpath);
		}else{
		// ファイルなら存在確認、あれば上書き許可を確認
			const isAlreadyExists = await fse.existsSync(str_outputContentFullpath);
			if( !options.overwrite && isAlreadyExists ){
				console.log(`skip: ${str_outputContentFullpath}`);
				continue;
			}else if( isAlreadyExists && options.overwrite ){
				console.log(`overwrite: ${str_outputContentFullpath}`);
			}else{
				console.log(`write: ${str_outputContentFullpath}`);
			}
			await fse.outputFile(str_outputContentFullpath, extraction);
		}
	}

	console.log(`result: ${output}`);
	console.groupEnd();
	return output;
}


/*
	node-unrar-js v1.0.3現在、fileHeaderにdir情報が含まれないため別途作成
*/
async function emergency(input, output, options){
	const arr = await list(input, options);
	const isFilter = is.func(options.filter);
	for(let obj of arr){
		if( obj.type==='file'){
			continue;
		}
		if( isFilter ){
			const isSkip = options.filter(obj)===false;
			if( isSkip ){
				continue;
			}
		}
		const str_outputContentFullpath = path.join(output, obj.path);
		await fse.ensureDir(str_outputContentFullpath);
	}
}


export default unrar;
