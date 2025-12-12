/**
 * NextPath AIチャット用 GAS サンプル
 * 本番ではここから外部API（OpenAI等）を呼び出す想定です。
 */

function doPost(e) {
  const data = JSON.parse(e.postData.contents || "{}");
  const userText = data.text || "";

  // TODO: ここにAI呼び出しロジックを実装
  const replyText = "（GASテスト応答）受け取ったメッセージ: " + userText;

  return ContentService
    .createTextOutput(JSON.stringify({ reply: replyText }))
    .setMimeType(ContentService.MimeType.JSON);
}


