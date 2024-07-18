const fs = require('fs');

// 创建一个快捷方式
fs.symlink('/path/to/original', '/path/to/shortcut', 'file', (err) => {
  if (err) throw err;
  console.log('快捷方式已创建');
});