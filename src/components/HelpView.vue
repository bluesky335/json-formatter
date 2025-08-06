<template>
  <div class="help-view">
    <header>
      <h1>JSON 格式化与可视化工具 | JSON Formatter & Visualizer</h1>
      <p>
        在线粘贴 JSON，自动缩进、高亮、结构展开。<br/>Free online JSON formatter and
        visualizer.
      </p>
    </header>
    <div class="container">
      <h2>常见问题 / FAQ</h2>
      <h3>❓ 如何使用这个 JSON 工具？ / How to use this tool?</h3>
      <p>
        📌 将 JSON 粘贴到输入框，点击“格式化”即可。Paste your JSON above and
        click "Format".
      </p>

      <h3>🔐 是否安全？/ Is it secure?</h3>
      <p>
        ✅ 本工具不会将数据发送到服务器，所有操作在浏览器本地完成。No data is
        sent to the server, formatting is done locally in your browser.
      </p>
    </div>
  </div>
</template>
<style lang="scss" scoped>
.container {
  max-width: 960px;
  margin: auto;
  padding: 1em;
}
textarea {
  width: 100%;
  height: 300px;
  font-family: monospace;
  font-size: 14px;
  padding: 1em;
  box-sizing: border-box;
}
button {
  padding: 0.8em 1.5em;
  margin-top: 1em;
  font-size: 16px;
  cursor: pointer;
}
.help-view { 
    z-index: 999;
background-color: white;
border-radius: 10px;
box-shadow: 5px 5px 20px rgba(0, 0, 0, 0.2);
padding: 20px;
}

</style>
