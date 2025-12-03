document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("chat-form");
  const input = document.getElementById("user-input");
  const chatWindow = document.getElementById("chat-window");

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const text = input.value.trim();
    if (!text) return;

    appendMessage("user", text);
    input.value = "";

    // TODO: ここでGASや別APIにリクエストを投げる
    setTimeout(() => {
      appendMessage("bot", "（テスト応答）本番環境では、ここにAIからの返信が表示されます。");
    }, 400);
  });

  function appendMessage(role, text) {
    const wrapper = document.createElement("div");
    wrapper.className = `message message-${role}`;

    const meta = document.createElement("div");
    meta.className = "message-meta";
    meta.textContent = role === "user" ? "あなた" : "AIキャリア相談";

    const body = document.createElement("div");
    body.className = "message-body";
    body.textContent = text;

    wrapper.appendChild(meta);
    wrapper.appendChild(body);

    chatWindow.appendChild(wrapper);
    chatWindow.scrollTop = chatWindow.scrollHeight;
  }
});


