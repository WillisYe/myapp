# XLSX转JSON工具集

这是一个多技术栈的工具集合，用于将XLSX表格文件转换为JSON格式。提供了Deno、Node.js和Python三种不同的实现，以适应不同的开发环境和网络条件。

## 项目结构

```
xlsx2json/
├── README.md                 # 项目总体说明（本文件）
├── EXAMPLES.md               # 使用示例
├── GUIDE.md                  # 快速选择指南
├── deno/                     # Deno版本
│   ├── README.md             # Deno说明
│   ├── convert.js            # 快速启动
│   ├── xlsx2json.js          # 完整版（需要网络）
│   ├── xlsx2json-simple.js   # 简化版（离线）
│   ├── batch-convert.js      # 批量处理
│   └── demo.csv              # 测试文件
├── nodejs/                   # Node.js版本
│   ├── package.json          # npm配置
│   ├── README.md             # Node.js说明
│   ├── xlsx2json.js          # 完整版
│   ├── xlsx2json-simple.js   # 简化版
│   ├── batch-convert.js      # 批量处理
│   ├── demo.csv              # 测试文件
│   └── demo.json             # 测试结果
└── python/                   # Python版本
    ├── requirements.txt      # pip依赖
    ├── README.md             # Python说明
    ├── xlsx2json.py          # 完整版
    ├── xlsx2json_simple.py   # 简化版
    ├── batch_convert.py      # 批量处理
    ├── demo.csv              # 测试文件
    └── demo.json             # 测试结果
```

## 版本选择指南

### 🦄 Deno版本（现代化首选）
- **位置**：`deno/` 目录
- **优点**：现代JavaScript运行时，内置TypeScript支持，安全性好
- **缺点**：可能存在网络连接问题
- **适用场景**：新项目，现代开发环境
- **快速启动**：`cd deno && deno run --allow-read --allow-write --allow-run convert.js`

### 🚀 Node.js版本（企业环境首选）
- **位置**：`nodejs/` 目录
- **优点**：生态成熟，依赖管理完善，兼容性好
- **缺点**：需要安装npm依赖
- **适用场景**：企业项目，现有Node.js环境
- **快速启动**：`cd nodejs && npm install && node xlsx2json-simple.js demo.csv`

### 🐍 Python版本（数据处理首选）
- **位置**：`python/` 目录
- **优点**：语法简洁，数据处理能力强，易于维护
- **缺点**：运行速度相对较慢
- **适用场景**：数据分析，科学计算，自动化脚本
- **快速启动**：`cd python && pip install openpyxl && python xlsx2json_simple.py demo.csv`

## 功能特点

- ✅ **A列作为key，B列作为value**
- ✅ **自动跳过空行和无效数据**
- ✅ **支持中文文件名和内容**
- ✅ **完整版和简化版双重方案**
- ✅ **批量处理功能**
- ✅ **详细的错误提示和处理信息**
- ✅ **跨平台兼容**

## 快速开始

### 选择您的技术栈

#### Deno用户
```bash
cd deno
# 快速启动（自动检测文件类型）
deno run --allow-read --allow-write --allow-run convert.js

# 直接转换CSV文件
deno run --allow-read --allow-write xlsx2json-simple.js demo.csv
```

#### Node.js用户
```bash
cd nodejs
npm install
node xlsx2json-simple.js demo.csv
```

#### Python用户
```bash
cd python
pip install -r requirements.txt
python xlsx2json_simple.py demo.csv
```

## 输入格式要求

所有版本都支持相同的输入格式：

| A列 (Key) | B列 (Value) |
|-----------|-------------|
| name      | 张三        |
| age       | 25          |
| city      | 北京        |
| email     | user@example.com |

## 输出格式

生成的JSON文件格式：
```json
{
  "name": "张三",
  "age": "25",
  "city": "北京",
  "email": "user@example.com"
}
```

## 使用场景

### 1. 配置文件转换
将Excel配置表转换为应用配置JSON文件

### 2. 多语言国际化
将翻译对照表转换为i18n JSON文件

### 3. 数据迁移
将Excel数据转换为API可读的JSON格式

### 4. 批量处理
一次性转换多个Excel文件

## 系统要求

| 版本 | 最低要求 | 推荐版本 |
|------|----------|----------|
| Deno | 1.0+ | Latest |
| Node.js | 14.0+ | 18.0+ |
| Python | 3.6+ | 3.9+ |

## 依赖说明

| 版本 | 完整版依赖 | 简化版依赖 |
|------|------------|------------|
| Deno | SheetJS (网络下载) | 无 |
| Node.js | xlsx | 无 |
| Python | openpyxl | 无 |

## 常见问题

### Q: 网络连接问题怎么办？
A: 使用各版本的简化版本（*-simple.*），先将Excel文件转换为CSV格式。

### Q: 中文乱码怎么解决？
A: 确保CSV文件使用UTF-8编码保存。

### Q: 支持哪些Excel格式？
A: 完整版支持.xlsx和.xls，简化版支持CSV和TXT。

### Q: 如何处理大文件？
A: 建议使用简化版本，或将大文件分割成多个小文件处理。

## 贡献指南

1. 每个版本独立维护在各自的文件夹中
2. 保持功能一致性
3. 添加新功能时同步更新所有版本
4. 遵循各语言的最佳实践

## 许可证

MIT License - 详见各版本目录中的LICENSE文件

---

## 快速选择

| 如果您... | 推荐使用 |
|----------|----------|
| 是前端开发者 | Node.js版本 |
| 喜欢现代工具 | Deno版本 |
| 做数据分析 | Python版本 |
| 网络受限 | 任意简化版本 |
| 批量处理 | 任意批量脚本 |

## 目录导航

- 📖 [项目总体说明](README.md) - 本文档
- 📋 [使用示例](EXAMPLES.md) - 详细的使用示例和场景
- 🧭 [快速选择指南](GUIDE.md) - 帮助您选择最适合的版本
- 🦄 [Deno版本说明](deno/README.md) - Deno实现的详细说明
- 🚀 [Node.js版本说明](nodejs/README.md) - Node.js实现的详细说明
- 🐍 [Python版本说明](python/README.md) - Python实现的详细说明