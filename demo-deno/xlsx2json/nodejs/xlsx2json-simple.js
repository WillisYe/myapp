#!/usr/bin/env node

/**
 * XLSX转JSON脚本（简化版）- Node.js版本
 * 用法: node xlsx2json-simple.js <输入文件路径> [输出文件路径]
 *
 * 说明：此版本使用基础的文本处理方法，处理CSV格式文件
 * 无需额外依赖包，适用于简单的表格数据转换
 */

const fs = require('fs');
const path = require('path');

function showUsage() {
    console.log("用法:");
    console.log("  node xlsx2json-simple.js <输入文件路径> [输出文件路径]");
    console.log("");
    console.log("支持的文件格式:");
    console.log("  - .csv (推荐)");
    console.log("  - .txt (制表符或逗号分隔)");
    console.log("");
    console.log("参数:");
    console.log("  输入文件路径    - 要转换的CSV/TXT文件路径");
    console.log("  输出文件路径    - 生成的JSON文件路径（可选，默认与输入文件同名但扩展名为.json）");
    console.log("");
    console.log("示例:");
    console.log("  node xlsx2json-simple.js data.csv");
    console.log("  node xlsx2json-simple.js data.csv output.json");
    console.log("");
    console.log("注意:");
    console.log("  如果您有.xlsx文件，请先在Excel中另存为CSV格式");
}

function validateFile(filePath) {
    if (!fs.existsSync(filePath)) {
        throw new Error(`文件不存在: ${filePath}`);
    }

    const stats = fs.statSync(filePath);
    if (!stats.isFile()) {
        throw new Error(`${filePath} 不是一个文件`);
    }

    const ext = path.extname(filePath).toLowerCase();
    const validExtensions = ['.csv', '.txt'];

    if (!validExtensions.includes(ext)) {
        throw new Error(`${filePath} 不是支持的文件格式（需要.csv或.txt）`);
    }

    return true;
}

function generateOutputPath(inputPath) {
    const parsed = path.parse(inputPath);
    return path.join(parsed.dir, parsed.name + '.json');
}

function parseCSVLine(line) {
    const result = [];
    let current = '';
    let inQuotes = false;

    for (let i = 0; i < line.length; i++) {
        const char = line[i];

        if (char === '"') {
            if (inQuotes && line[i + 1] === '"') {
                // 处理双引号转义
                current += '"';
                i++;
            } else {
                // 切换引号状态
                inQuotes = !inQuotes;
            }
        } else if (char === ',' && !inQuotes) {
            // 字段分隔符
            result.push(current.trim());
            current = '';
        } else {
            current += char;
        }
    }

    // 添加最后一个字段
    result.push(current.trim());

    return result;
}

function detectDelimiter(line) {
    const delimiters = [',', '\t', ';', '|'];
    const counts = delimiters.map(delimiter => ({
        delimiter,
        count: line.split(delimiter).length - 1
    }));

    // 选择出现次数最多的分隔符
    const best = counts.reduce((max, current) =>
        current.count > max.count ? current : max
    );

    return best.delimiter;
}

function convertToJson(inputPath, outputPath) {
    try {
        console.log(`正在读取文件: ${inputPath}`);

        // 读取文件内容
        const content = fs.readFileSync(inputPath, 'utf8');
        const lines = content.split(/\r?\n/).filter(line => line.trim() !== '');

        if (lines.length === 0) {
            throw new Error("文件为空");
        }

        console.log(`找到 ${lines.length} 行数据`);

        // 检测分隔符
        const delimiter = detectDelimiter(lines[0]);
        console.log(`检测到分隔符: "${delimiter === '\t' ? '\\t' : delimiter}"`);

        // 转换为key-value对象
        const result = {};
        let processedRows = 0;

        for (let i = 0; i < lines.length; i++) {
            const line = lines[i].trim();
            if (!line) continue;

            let fields;
            if (delimiter === ',') {
                // 使用CSV解析器处理逗号分隔
                fields = parseCSVLine(line);
            } else {
                // 使用简单分割处理其他分隔符
                fields = line.split(delimiter);
            }

            if (fields.length < 2) {
                console.warn(`跳过第 ${i + 1} 行：字段不足`);
                continue;
            }

            const key = fields[0].trim();
            const value = fields[1].trim();

            // 跳过key为空的行
            if (!key) {
                console.warn(`跳过第 ${i + 1} 行：key为空`);
                continue;
            }

            // 移除引号
            const cleanKey = key.replace(/^["']|["']$/g, '');
            const cleanValue = value.replace(/^["']|["']$/g, '');

            result[cleanKey] = cleanValue;
            processedRows++;
        }

        console.log(`已处理 ${processedRows} 行数据`);

        if (processedRows === 0) {
            console.warn("警告: 没有找到有效的数据行");
        }

        // 写入JSON文件
        console.log(`正在写入文件: ${outputPath}`);
        const jsonString = JSON.stringify(result, null, 2);
        fs.writeFileSync(outputPath, jsonString, 'utf8');

        console.log(`✅ 转换完成！`);
        console.log(`   输入文件: ${inputPath}`);
        console.log(`   输出文件: ${outputPath}`);
        console.log(`   转换行数: ${processedRows}`);

    } catch (error) {
        console.error(`❌ 转换失败: ${error.message}`);
        process.exit(1);
    }
}

function main() {
    const args = process.argv.slice(2);

    if (args.length === 0 || args.includes('-h') || args.includes('--help')) {
        showUsage();
        return;
    }

    if (args.length < 1 || args.length > 2) {
        console.error("❌ 参数数量错误");
        showUsage();
        process.exit(1);
    }

    const inputPath = args[0];
    const outputPath = args[1] || generateOutputPath(inputPath);

    try {
        // 验证输入文件
        validateFile(inputPath);

        // 执行转换
        convertToJson(inputPath, outputPath);

    } catch (error) {
        console.error(`❌ ${error.message}`);
        process.exit(1);
    }
}

// 只有在直接运行此脚本时才执行main函数
if (require.main === module) {
    main();
}

module.exports = { convertToJson, validateFile, generateOutputPath };