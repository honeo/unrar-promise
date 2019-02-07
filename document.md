# document
いわゆる製作メモ。


## 構成
* lib/
    - 各関数を返すモジュール置き場。
* test
    - index.js
        - テストで実行するモジュール。
    - example.rar, example-encrypted.rar
        - テストに使う書庫ファイル。後者のパスワードはそのままpassword.


## Mod

### dependencies
* @honeo/check
    - 型チェックなど。
* fs-extra
    - fs機能拡張版。
* node-unrar-js
    - unrar.

### devDependencies
* @honeo/test
    * テスト。
