# document
いわゆる製作メモ。

## TODO
* 分割ファイル読み込み
    - 対応unrarモジュール待ち。
* 内部でStream
    - 同上。


## testディレクトリ
- index.mjs
    - テストで実行するモジュール。
- contents/
    - テストに使う書庫ファイル置き場。
    - example.rar
    - example-encrypted.rar
        - パスワードはそのままpassword.
    - CP932.rar
        - WinRARv5.31で作った日本語名のディレクトリ・ファイルを含む書庫。
        - 現在はUTF-8にパスが変換された上で圧縮されるため、実際にはCP932ではない。

## Mod

### dependencies
* @honeo/check
    - 型チェックなど。
* console-wrapper
    - コンソール一括ON/OFF
* fs-extra
    - fs機能拡張版。
* node-unrar-js
    - unrar.
* sanitize-filename
    - 出力ファイルパス正規化。


### devDependencies
* @honeo/test
    * テスト。


## 参考
* [RAR - Wikipedia](https://ja.wikipedia.org/wiki/RAR)
