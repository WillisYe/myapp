# 黑八桌球游戏启动脚本
# 此脚本将启动一个本地HTTP服务器来运行游戏

Write-Host "正在启动黑八桌球游戏..."
Write-Host "请确保您的设备已连接到网络（用于加载Tailwind CSS和Font Awesome）"

# 检查Python是否安装
$pythonInstalled = $false
try {
    $pythonVersion = python --version 2>&1
    if ($pythonVersion -like "Python *") {
        $pythonInstalled = $true
    }
} catch {
    # Python未安装
}

if ($pythonInstalled) {
    Write-Host "使用Python内置HTTP服务器..."
    Write-Host "请在浏览器中访问 http://localhost:8000"
    python -m http.server
} else {
    # 检查Node.js是否安装
    $nodeInstalled = $false
try {
        $nodeVersion = node --version 2>&1
        if ($nodeVersion -like "v*") {
            $nodeInstalled = $true
        }
    } catch {
        # Node.js未安装
    }

    if ($nodeInstalled) {
        Write-Host "使用Node.js的http-server..."
        Write-Host "请在浏览器中访问 http://localhost:8080"
        npx http-server
    } else {
        Write-Host "错误：未找到Python或Node.js。请安装其中一个来运行游戏，或直接双击index.html文件打开游戏。"
        Read-Host "按Enter键退出"
    }
}