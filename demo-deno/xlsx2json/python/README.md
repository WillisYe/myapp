# XLSX转JSON工具 - Python版本

这是一个使用Python编写的工具集，用于将XLSX表格文件转换为JSON格式。支持完整的Excel文件解析和简化的CSV处理。

## 功能特点

- 将XLSX文件的第一个工作表转换为JSON
- A列作为JSON的key，B列作为value
- 自动跳过空行和key为空的行
- 支持自定义输出文件路径
- 提供详细的处理信息和错误提示
- 多种转换方式：完整版本、简化版本、批量处理

## 安装依赖

```bash
pip install -r requirements.txt
```

或者手动安装：
```bash
pip install openpyxl
```

## 脚本说明

### 1. xlsx2json.py（完整版）
使用openpyxl库的完整版本，支持完整的Excel文件解析。

### 2. xlsx2json_simple.py（简化版）
无需额外依赖的简化版本，处理CSV格式文件。

### 3. batch_convert.py（批量处理）
批量处理工具，自动检测Excel文件并提供转换选项。

## 使用方法

### 方法一：批量处理（推荐）
```bash
# 处理当前目录的所有Excel文件
python batch_convert.py

# 处理指定目录的Excel文件
python batch_convert.py ./data
```

### 方法二：完整版本
```bash
# 基本用法
python xlsx2json.py <输入文件路径>

# 指定输出文件
python xlsx2json.py <输入文件路径> <输出文件路径>

# 查看帮助
python xlsx2json.py --help
```

### 方法三：简化版本（处理CSV）
先将Excel文件另存为CSV格式，然后：
```bash
# 转换CSV文件
python xlsx2json_simple.py <CSV文件路径>

# 指定输出文件
python xlsx2json_simple.py <CSV文件路径> <输出文件路径>
```

## 使用示例

```bash
# 转换Excel文件
python xlsx2json.py "海外版本地中英词库.xlsx"

# 转换CSV文件
python xlsx2json_simple.py data.csv output.json

# 批量处理
python batch_convert.py
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

- Python >= 3.6
- pip（用于安装依赖）

## 依赖包

- **openpyxl**: 用于读取Excel文件（仅完整版需要）
- **csv**: Python内置模块（简化版使用）
- **json**: Python内置模块
- **pathlib**: Python内置模块

## 注意事项

1. 只处理Excel文件的第一个工作表
2. A列为空的行会被跳过
3. 所有值都会被转换为字符串格式
4. 如果不指定输出文件路径，会在输入文件同目录生成同名的.json文件
5. 完整版本需要安装openpyxl依赖包，简化版本无需额外依赖
6. 支持中文文件名和内容，使用UTF-8编码