const express = require('express');
const path = require('path');
const app = express();

const port = process.env.PORT || 3000;

// 提供 React 靜態檔案
app.use(express.static(path.join(__dirname, '..', 'build')));

// API 示例
app.get('/api/hello', (req, res) => {
  res.json({ message: 'Hello from backend!' });
});

// 所有路由都導向 React 的 index.html
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'build', 'index.html'));
});

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
