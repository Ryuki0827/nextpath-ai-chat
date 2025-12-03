# NextPath Career｜AIキャリア相談システム

LP → LINE リッチメニュー → 外部AIチャット → 履歴書項目の収集 → 推薦意思の確認 → 管理者メール通知 → スプレッドシート保存までを自動化する一式です。すべてコピペで動かせる構成にしてあります。

## ディレクトリ構成
```
/public
  ├ index.html   … 外部AIチャットページ
  ├ style.css    … チャットUIのデザイン
  └ script.js    … GAS へ POST するフロントロジック
/gas
  ├ Code.gs          … GAS バックエンド（API・管理画面）
  └ appsscript.json  … GAS の設定（スコープ）
README.md            … 本手順書
```

## 全体フロー（LP → LINE → 外部AIチャット → 推薦）
1. LP から「LINE 友だち追加」導線を配置
2. LINE 公式アカウントのリッチメニューに「AI相談スタート」ボタンを作成し、外部チャットページ（例: `https://example.com/ai-chat`）へ遷移させる
3. 外部チャットページで AI と相談 → session_id 単位でスプレッドシートに記録
4. ユーザーが「はい」「お願いします」などで推薦希望を出すと、AI がサマリーを生成し、メール通知 & `ai_summary` シートに保存
5. 管理者は GAS の管理画面（`?page=admin`）でログと推薦希望を確認

## 事前準備（スプレッドシート）
1. Google スプレッドシートを新規作成
2. シート名を以下の2つにしておく
   - `ai_chat_logs`（ヘッダー: `session_id | role | message | timestamp`）
   - `ai_summary`（ヘッダー: `session_id | name | age | experience | strengths | suitable_jobs | resume_fields | summary | timestamp`）
3. スプレッドシートIDを控える（URLの `/d/` と `/edit` の間の文字列）

## GAS 側の設定手順
1. [Google Apps Script](https://script.google.com/) を開き、新しいプロジェクトを作成
2. `Code.gs` の内容をコピペ
3. `appsscript.json` をプロジェクトのマニフェストに上書き（ファイル > プロジェクトのプロパティ > マニフェストファイルを編集）
4. Script Properties に以下を登録（プロジェクトの設定 > スクリプト プロパティ）
   - `OPENAI_API_KEY` … OpenAIのAPIキー
   - `SPREADSHEET_ID` … 事前に用意したスプレッドシートID
   - `ADMIN_EMAIL` … 通知先メールアドレス（例: `t.ryuki55@gmail.com`）
5. デプロイ
   - 画面右上「デプロイ」→「新しいデプロイ」
   - 種類: ウェブアプリ
   - 誰として実行するか: 自分
   - アクセスできるユーザー: 全員
   - 発行された Web アプリ URL を控える（`/exec` で終わる）

## フロントエンド設置手順
1. `public` フォルダをそのままホスティング（例: Cloud Storage 静的ホスティング、Vercel、Firebase Hosting など）
2. `public/script.js` の `GAS_ENDPOINT` を、先ほど控えた Web アプリ URL に差し替える
3. 公開URLを LINE リッチメニューのリンク先に設定する

## 管理者ページのURL
- GAS の Web アプリ URL に `?page=admin` を付けるだけで閲覧可能です
  - 例: `https://script.google.com/macros/s/xxxxxxxx/exec?page=admin`
- `session_id` 検索、推薦希望のみの絞り込みが可能です

## 動作確認手順
1. 外部チャットページを開くと自動で `session_id` が発行され、AI の初回メッセージが表示されます
2. 相談内容を送信すると GAS に POST され、OpenAI 経由で応答が返ってきます
3. スプレッドシートの `ai_chat_logs` にログが追記されていることを確認します
4. ユーザーが「はい」「お願いします」など肯定的に回答すると、
   - `ai_summary` に1行追加される
   - ADMIN_EMAIL 宛に推薦希望メールが届く
5. 管理画面（`?page=admin`）でチャット履歴とサマリーを閲覧できることを確認します

## セキュリティ・補足
- OpenAI APIキーやスプレッドシートID、メールアドレスは ScriptProperties にのみ保持し、コードに直書きしません
- CORS は `doPost` / `doOptions` で `Access-Control-Allow-Origin: *` を返すため、外部ホスティングのフロントから直接叩けます
- モデルは `gpt-4o-mini`（低コスト）をデフォルト指定。`gpt-4.1-mini` に変更したい場合は `MODEL` 定数を書き換えてください
