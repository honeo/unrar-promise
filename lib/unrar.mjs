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

// Mod
import console from 'console-wrapper';
import fse from "fs-extra";
import path from 'path';
import sanitize from 'sanitize-filename';
import Unrar from 'node-unrar-js';
import {is, not, any} from '@honeo/check';

// Var
const obj_defaultOp = {
	filter: null,
	overwrite: false,
	password: ''
}


// Result
async function unrar(input, _output, _options={}){
	console.group('unrar()', _output, _options);

	// validation
	if( !is.str(input, _output) ){
		throw new TypeError(`Invalid arguments`);
	}
	if( not.obj(_options) ){
		throw new TypeError(`Invalid arguments 3: ${_options}`);
	}

	// フルパス化
	const output = path.resolve(_output);
	const options = {...obj_defaultOp, ..._options}

	const buffer = Uint8Array.from(
		await fse.readFile(input)
	).buffer;
	const extractor = Unrar.createExtractorFromData(buffer, options.password);
	const [obj_state, obj_header] = extractor.extractAll();

	// 読み込み失敗時はエラー投げて終了
	if( obj_state.state!=='SUCCESS' ){
		throw new Error('unrar: parse failed');
	}

	const {files, arcHeader} = obj_header;
	for(let {fileHeader, extract} of files){

		// 正規化, dirなら末尾/を補完
		const {dir, base} = path.parse(fileHeader.name);
		fileHeader.name = path.normalize(path.join(
			dir,
			fileHeader.flags.directory ?
				sanitize(base)+'/':
				sanitize(base)
		));

		const str_outputContentFullpath = path.join(output, fileHeader.name);

		// options.filter
		if( is.func(options.filter) ){
			const type = fileHeader.flags.directory ?
				'Directory': 'File';
			const str_contentPath = fileHeader.name;
			const isSkip = options.filter({
				type,
				path: str_contentPath
			});
			if( not.true(isSkip) ){
				console.log('skip: ', str_outputContentFullpath);
				continue;
			}
		}

		if( fileHeader.flags.directory ){
			console.log(`ensure: ${str_outputContentFullpath}`);
			await fse.ensureDir(str_outputContentFullpath);
		}else{
			if( !options.overwrite && fse.existsSync(str_outputContentFullpath) ){
				console.log(`skip: ${str_outputContentFullpath}`);
				continue;
			}
			console.log(`write: ${str_outputContentFullpath}`);
			await fse.outputFile(str_outputContentFullpath, extract[1]);
		}
	}

	console.log(`result: ${output}`);
	console.groupEnd();
	return output;
}

export default unrar;
