# document
いわゆる製作メモ。

## 依存モジュール
* @honeo/check
 * 型チェックなど。
* @honeo/test
 * dev, テスト用モジュール。
* fs-extra
 * fs機能拡張版。
* node-unrar-js
 * unrar.

## 構成
* lib
 * 各関数を返すモジュール置き場。
* test
 * index.js
   * テストで実行するモジュール。
 * example.rar, example-encrypted.rar
   * テストに使う書庫ファイル。後者のパスワードはそのままpassword. 
