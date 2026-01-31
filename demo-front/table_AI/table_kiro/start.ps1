# 黑八桌球游戏启动脚本
Write-Host "🎱 启动黑八桌球游戏..." -ForegroundColor Green

# 检查Node.js
if (!(Get-Command node -ErrorAction SilentlyContinue)) {
    Write-Host "❌ 未找到Node.js，请先安装Node.js" -ForegroundColor Red
    exit 1
}

# 检查依赖
if (!(Test-Path "node_modules")) {
    Write-Host "📦 安装依赖..." -ForegroundColor Yellow
    npm install
}

# 启动开发服务器
Write-Host "🚀 启动开发服务器..." -ForegroundColor Cyan
Write-Host "📱 建议使用横屏模式获得最佳游戏体验" -ForegroundColor Yellow
Write-Host "🌐 游戏将在浏览器中自动打开" -ForegroundColor Green

npm run dev