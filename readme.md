# unrar-promise
* [honeo/unrar-promise](https://github.com/honeo/unrar-promise)  
* [unrar-promise](https://www.npmjs.com/package/unrar-promise)


## なにこれ
かんたん.rar展開モジュール。


## 使い方
```sh
$ npm i unrar-promise
```
```js
const {unrar, list} = require('unrar-promise');

await unrar('archive.rar', './output');
```


## API
* 出力先について
	- ファイルが既にあればスキップする。
	- ディレクトリがなければ作成する。
	- [node-sanitize-filename](https://github.com/parshap/node-sanitize-filename)で正規化する。

### options
| key       | type     | default | description                                                           |
|:--------- |:-------- | ------- | --------------------------------------------------------------------- |
| filter    | function |         | 出力するコンテンツ毎にobjectを引数に実行され、falseが返ればskipする。 |
| overwrite | boolean  | false   | 上書きを許可するか。                                                  |
| password  | string   |         | 書庫のパスワード。                                                    |


### unrar(inputFile, outputDir [, options])
引数1パスの.rar書庫を引数2のディレクトリへ展開する。  
展開先ディレクトリのパスを引数に解決するpromiseを返す。
```js
// hoge.rar => output/...
const dirPath = await unrar('hoge.rar', 'output');

// options
const dirPath = await unrar('hoge.rar', 'output', {
	filter({path, type}){
		return type==='File' && /\.txt$/.test(path); //  *.txt file only
	},
	overwrite: true,
	password: '123456'
});
```


### list(inputFile [, options])
引数1パスの.rar書庫が持つコンテンツ一覧を配列で取得する。  
取得した配列を引数に解決するpromiseを返す。
```js
const arr = await list('hoge.rar'); // [..."path"]

// options
const arr = await list('foobar.rar', {
	password: 'qwerty'
});
```
