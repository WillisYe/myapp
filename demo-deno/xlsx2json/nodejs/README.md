# XLSX转JSON工具 - Node.js版本

这是一个使用Node.js编写的工具集，用于将XLSX表格文件转换为JSON格式。无需网络连接，本地安装依赖即可使用。

## 功能特点

- 将XLSX文件的第一个工作表转换为JSON
- A列作为JSON的key，B列作为value
- 自动跳过空行和key为空的行
- 支持自定义输出文件路径
- 提供详细的处理信息和错误提示
- 多种转换方式：完整版本、简化版本、批量处理

## 安装依赖

```bash
npm install
```

## 脚本说明

### 1. xlsx2json.js（完整版）
使用xlsx库的完整版本，支持完整的Excel文件解析。

### 2. xlsx2json-simple.js（简化版）
无需额外依赖的简化版本，处理CSV格式文件。

### 3. batch-convert.js（批量处理）
批量处理工具，自动检测Excel文件并提供转换选项。

## 使用方法

### 方法一：批量处理（推荐）
```bash
# 处理当前目录的所有Excel文件
node batch-convert.js

# 处理指定目录的Excel文件
node batch-convert.js ./data
```

### 方法二：完整版本
```bash
# 基本用法
node xlsx2json.js <输入文件路径>

# 指定输出文件
node xlsx2json.js <输入文件路径> <输出文件路径>

# 查看帮助
node xlsx2json.js --help
```

### 方法三：简化版本（处理CSV）
先将Excel文件另存为CSV格式，然后：
```bash
# 转换CSV文件
node xlsx2json-simple.js <CSV文件路径>

# 指定输出文件
node xlsx2json-simple.js <CSV文件路径> <输出文件路径>
```

## 使用示例

```bash
# 使用npm脚本
npm run convert data.xlsx
npm run simple data.csv
npm run batch

# 直接使用node
node xlsx2json.js "海外版本地中英词库.xlsx"
node xlsx2json-simple.js data.csv output.json
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

## 系统要求

- Node.js >= 14.0.0
- npm（用于安装依赖）

## 注意事项

1. 只处理Excel文件的第一个工作表
2. A列为空的行会被跳过
3. 所有值都会被转换为字符串格式
4. 如果不指定输出文件路径，会在输入文件同目录生成同名的.json文件
5. 完整版本需要安装xlsx依赖包，简化版本无需额外依赖