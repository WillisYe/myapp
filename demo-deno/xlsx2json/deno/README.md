# XLSX转JSON工具 - Deno版本

这是一个使用Deno编写的工具集，用于将XLSX表格文件转换为JSON格式。提供了多种转换方式以适应不同的网络环境和使用场景。

## 功能特点

- 将XLSX文件的第一个工作表转换为JSON
- A列作为JSON的key，B列作为value
- 自动跳过空行和key为空的行
- 支持自定义输出文件路径
- 提供详细的处理信息和错误提示
- 多种转换方式：网络版本、简化版本、批量处理

## 脚本说明

### 1. xlsx2json.js（完整版）
使用SheetJS库的完整版本，需要网络连接下载依赖库。

### 2. xlsx2json-simple.js（简化版）
无需网络连接的简化版本，处理CSV格式文件。

### 3. batch-convert.js（批量处理）
批量处理工具，自动检测Excel文件并提供转换选项。

### 4. convert.js（快速启动）
智能启动脚本，自动检测文件类型并提供最佳方案。

## 使用方法

### 方法一：快速启动（推荐）
```bash
# 一键启动，自动检测文件并提供最佳方案
deno run --allow-read --allow-write --allow-run convert.js
```

### 方法二：批量处理
```bash
# 处理当前目录的所有Excel文件
deno run --allow-read --allow-write --allow-run batch-convert.js

# 处理指定目录的Excel文件
deno run --allow-read --allow-write --allow-run batch-convert.js ../data
```

### 方法三：网络版本
```bash
# 基本用法
deno run --allow-read --allow-write --allow-net xlsx2json.js <输入文件路径>

# 指定输出文件
deno run --allow-read --allow-write --allow-net xlsx2json.js <输入文件路径> <输出文件路径>

# 查看帮助
deno run xlsx2json.js --help
```

### 方法四：简化版本（离线）
先将Excel文件另存为CSV格式，然后：
```bash
# 转换CSV文件
deno run --allow-read --allow-write xlsx2json-simple.js <CSV文件路径>

# 指定输出文件
deno run --allow-read --allow-write xlsx2json-simple.js <CSV文件路径> <输出文件路径>
```

## 使用示例

```bash
# 快速启动
deno run --allow-read --allow-write --allow-run convert.js

# 转换演示文件
deno run --allow-read --allow-write xlsx2json-simple.js demo.csv

# 转换Excel文件
deno run --allow-read --allow-write --allow-net xlsx2json.js data.xlsx
```

## 输入格式要求

Excel文件应该按以下格式组织：

| A列 (Key) | B列 (Value) |
|-----------|-------------|
| name      | 张三        |
| age       | 25          |
| city      | 北京        |

## 输出格式

生成的JSON文件格式：
```json
{
  "name": "张三",
  "age": "25",
  "city": "北京"
}
```

## 权限说明

不同脚本需要的Deno权限：

| 脚本 | 权限 | 说明 |
|------|------|------|
| convert.js | `--allow-read --allow-write --allow-run` | 快速启动脚本 |
| xlsx2json.js | `--allow-read --allow-write --allow-net` | 网络版本 |
| xlsx2json-simple.js | `--allow-read --allow-write` | 简化版本 |
| batch-convert.js | `--allow-read --allow-write --allow-run` | 批量处理 |

## 系统要求

- Deno >= 1.0.0
- 网络连接（仅完整版需要）

## 注意事项

1. 只处理Excel文件的第一个工作表
2. A列为空的行会被跳过
3. 所有值都会被转换为字符串格式
4. 如果不指定输出文件路径，会在输入文件同目录生成同名的.json文件
5. 完整版本需要网络连接下载SheetJS库，简化版本无需网络

## 故障排除

### 网络连接问题
如果遇到网络连接问题，使用简化版本：
1. 在Excel中将.xlsx文件另存为.csv格式
2. 使用 `xlsx2json-simple.js` 处理CSV文件

### 权限问题
确保为脚本提供了正确的Deno权限。如果权限不足，Deno会提示所需的具体权限。