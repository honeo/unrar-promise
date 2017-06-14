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
const unrarp = require('unrar-promise');

await unrarp.extractAll('archive.rar', './output');
```

## API

### .extract(inputFilePath, targetContent or [..targetContent], outputDirPath [, password])
引数1パスの.rar書庫の中から、引数2のコンテンツを、引数3パスのディレクトリへ展開する。  
展開先ディレクトリのパス文字列を引数に解決するpromiseを返す。
```js
// hoge.rar => output/
const dirpath = await unrarp.extract('hoge.rar', 'dirinrar/file', 'output');

// multi
const dirpath = await unrarp.extract('hoge.rar', [
	'dirinrar/fileA',
	'dirinrar/fileB'
], 'output');
```

### .extractAll(inputFilePath, outputDirPath [, password])
引数1パスの.rar書庫を、引数2パスのディレクトリへ展開する。  
展開先ディレクトリのパス文字列を引数に解決するpromiseを返す。
```js
// hoge.rar => output/...
const dirpath = await unrarp.extractAll('hoge.rar', 'output')
```

### .list(inputFilePath [, password])
引数1パスの.rar書庫が持つコンテンツ一覧を配列で取得する。  
取得した配列を引数に解決するpromiseを返す。
```js
const arr = await unrarp.list('hoge.rar'); // [...'content-name']
```
