# unrar-promise
* [honeo/unrar-promise](https://github.com/honeo/unrar-promise)
* [unrar-promise](https://www.npmjs.com/package/unrar-promise)

## __Caution!__
v3.0.0-*現在、依存モジュールの不具合に対応するためアーカイブを二重にパースしている。
しばらくはv2がおすすめ。
```bash
$ npm i unrar-promise@2
```
* [for ver2.0.1 page](https://github.com/honeo/unrar-promise/tree/229e1ec9f6d6f91eab92ebe90ce549aa8ff96d6d)

## なにこれ
かんたん.rar展開モジュール。

## 使い方
```sh
$ npm i unrar-promise
```
```js
import {unrar, list} from 'unrar-promise';

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


### unrar(input, outputDir [, options])
引数1パスの.rar書庫を引数2のディレクトリへ展開する。
展開先ディレクトリのパスを引数に解決するpromiseを返す。
```js
// .rar path => "output"
const dirPath = await unrar('hoge.rar', 'output');

// or Buffer<.rar>
const dirPath = await unrar(arraybuffer, 'output');

// options
const dirPath = await unrar('hoge.rar', 'output', {
	filter({path, type, size}){
		return type==='file' && /\.txt$/.test(path); //  *.txt file only
	},
	overwrite: true,
	password: '123456'
});
```


### list(input [, options])
引数1パスの.rar書庫が持つコンテンツ一覧をpromise<[...object]>で取得する。
```js
const arr = await list('foobar.rar');

// or Buffer<.rar>
const arr = await list(arraybuffer);

// example result
[{
	path: 'foo',
	size: 0,
	type: 'directory'
}, {
	path: 'foo/bar.txt',
	size: 8,
	type: 'file',
}]

// options
const arr = await list('foobar.rar', {
	password: 'qwerty'
});
```



## Breaking Changes

### v2 => v3
* CJS => ESM.
* unrar()
 	- options.filterに渡されるobject.typeが全て小文字になった。
		- "File" => "file"
	- options.filterに渡されるobject.pathが末尾に"/"を含まなくなった。
		- "foo/" => "foo"
* list()
	- 返り値を[...string]から[...object]に変更。
	- 返り値のpathが末尾に"/"を含まなくなった。
		- "foo/" => "foo"

### v1 => v2
* .extract(), extractAll()
	- 廃止して.unrar()に統合。
* .list()
	- 引数2をstringからobjectに変更。
