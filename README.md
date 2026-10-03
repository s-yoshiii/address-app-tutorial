# address-app

連絡先を一覧・登録・編集・削除できる学習用アプリ。
PHP（フレームワークなし）と SQLite で作った API を、素の JavaScript から呼び出している。

## 必要なもの

- PHP 8 以上（SQLite 拡張が有効なこと）
- sqlite3 コマンド
- Node.js（Prettier による自動整形と、起動コマンドの実行に使う）

## セットアップ

```bash
npm install
sqlite3 contacts.db < schema.sql
```

`contacts.db` は Git で管理していないので、初回だけ `schema.sql` から作る。

## 起動

```bash
npm run dev
```

ブラウザで http://localhost:8000/public/index.html を開く。停止は `Ctrl + C`。

この起動方法ではプロジェクト内の全ファイルが URL で取得できてしまうため、ローカルでの学習用に限る。

## API

| メソッド | パス                 | 説明     |
| -------- | -------------------- | -------- |
| GET      | `/api/contacts`      | 一覧     |
| GET      | `/api/contacts/{id}` | 1 件取得 |
| POST     | `/api/contacts`      | 新規登録 |
| PUT      | `/api/contacts/{id}` | 更新     |
| DELETE   | `/api/contacts/{id}` | 削除     |

動作確認の例:

```bash
curl -i http://localhost:8000/api/contacts
```

## 構成

```
address-app/
├── api/
│   ├── index.php   API 本体（ルーティングと各処理）
│   └── db.php      DB 接続
├── public/
│   ├── index.html  画面
│   └── app.js      API を呼び出す JavaScript
└── schema.sql      テーブル定義
```
