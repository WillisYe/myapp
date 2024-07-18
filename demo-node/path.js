const { execSync } = require('child_process');

function addToPathIfNotExists(folderPath) {
  const pathExists = process.env.PATH.split(';').includes(folderPath);
  if (!pathExists) {
    const command = `setx PATH "%PATH%;${folderPath}"`;
    execSync(command);
    console.log(`${folderPath} 已成功添加到环境变量PATH中`);
  } else {
    console.log(`${folderPath} 已存在于环境变量PATH中，无需重复添加`);
  }
}

// 从命令行参数中获取文件夹路径C:\your\folder\path
const folderPath = process.argv[2];
if (folderPath) {
  addToPathIfNotExists(folderPath);
} else {
  console.log('请提供文件夹路径作为参数');
}