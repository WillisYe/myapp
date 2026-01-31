# 使用示例

本文档提供XLSX转JSON工具的详细使用示例。

## 快速开始

### 1. 最简单的方式
```bash
deno run --allow-read --allow-write --allow-run convert.js
```
这将启动交互式的转换向导，自动检测文件并提供最佳转换方案。

## 示例场景

### 场景1：转换CSV文件
假设您有一个`data.csv`文件：
```csv
name,张三
age,25
city,北京
```

运行：
```bash
deno run --allow-read --allow-write scripts/xlsx2json-simple.js data.csv
```

生成的`data.json`：
```json
{
  "name": "张三",
  "age": "25",
  "city": "北京"
}
```

### 场景2：批量处理多个Excel文件
当前目录有多个.xlsx文件时：

```bash
deno run --allow-read --allow-write --allow-run scripts/batch-convert.js
```

工具会列出所有Excel文件并提供转换选项。

### 场景3：处理包含中文的文件
文件名：`用户信息.xlsx` -> `用户信息.csv` -> `用户信息.json`

```bash
# 先在Excel中另存为CSV
# 然后运行
deno run --allow-read --allow-write scripts/xlsx2json-simple.js "用户信息.csv"
```

### 场景4：自定义输出路径
```bash
deno run --allow-read --allow-write scripts/xlsx2json-simple.js input.csv output/result.json
```

## 常见问题解决

### 网络连接问题
如果网络版本无法访问，使用离线版本：
1. 在Excel中将.xlsx文件另存为.csv
2. 使用`xlsx2json-simple.js`处理CSV文件

### 文件编码问题
确保CSV文件使用UTF-8编码保存，避免中文乱码。

### 大文件处理
对于大型Excel文件，建议：
1. 分批处理
2. 使用CSV格式以提高处理速度

## 文件格式要求

### Excel/CSV格式
```
A列(Key)  | B列(Value)
---------|----------
username | admin
password | 123456
email    | admin@example.com
```

### 生成的JSON格式
```json
{
  "username": "admin",
  "password": "123456",
  "email": "admin@example.com"
}
```

## 权限说明

不同脚本需要的Deno权限：

| 脚本 | 权限 | 说明 |
|------|------|------|
| convert.js | `--allow-read --allow-write --allow-run` | 主启动脚本 |
| xlsx2json.js | `--allow-read --allow-write --allow-net` | 网络版本 |
| xlsx2json-simple.js | `--allow-read --allow-write` | 简化版本 |
| batch-convert.js | `--allow-read --allow-write --allow-run` | 批量处理 |

## 成功转换的标志

转换成功时会看到：
```
✅ 转换完成！
   输入文件: demo.csv
   输出文件: demo.json
   转换行数: 8
```

转换失败时会显示具体的错误信息，帮助您快速定位和解决问题。