#!/usr/bin/env node

/**
 * XLSX转JSON脚本 - Node.js版本
 * 用法: node xlsx2json.js <输入文件路径> [输出文件路径]
 *
 * 将XLSX文件的第一个工作表转换为JSON格式
 * A列作为key，B列作为value
 */

const XLSX = require('xlsx');
const fs = require('fs');
const path = require('path');

function showUsage() {
    console.log("用法:");
    console.log("  node xlsx2json.js <输入文件路径> [输出文件路径]");
    console.log("");
    console.log("参数:");
    console.log("  输入文件路径    - 要转换的XLSX文件路径");
    console.log("  输出文件路径    - 生成的JSON文件路径（可选，默认与输入文件同名但扩展名为.json）");
    console.log("");
    console.log("示例:");
    console.log("  node xlsx2json.js data.xlsx");
    console.log("  node xlsx2json.js data.xlsx output.json");
    console.log("");
    console.log("安装依赖:");
    console.log("  npm install");
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
    if (ext !== '.xlsx' && ext !== '.xls') {
        throw new Error(`${filePath} 不是Excel文件格式（需要.xlsx或.xls）`);
    }

    return true;
}

function generateOutputPath(inputPath) {
    const parsed = path.parse(inputPath);
    return path.join(parsed.dir, parsed.name + '.json');
}

function convertXlsxToJson(inputPath, outputPath) {
    try {
        console.log(`正在读取文件: ${inputPath}`);

        // 读取Excel文件
        const workbook = XLSX.readFile(inputPath);

        // 获取第一个工作表
        const sheetNames = workbook.SheetNames;
        if (sheetNames.length === 0) {
            throw new Error("Excel文件中没有找到工作表");
        }

        const firstSheetName = sheetNames[0];
        const worksheet = workbook.Sheets[firstSheetName];

        console.log(`正在处理工作表: ${firstSheetName}`);

        // 将工作表转换为数组格式
        const sheetData = XLSX.utils.sheet_to_json(worksheet, {
            header: 1, // 使用数组格式而不是对象格式
            defval: "" // 空单元格的默认值
        });

        if (sheetData.length === 0) {
            throw new Error("工作表中没有数据");
        }

        // 转换为key-value对象
        const result = {};
        let processedRows = 0;

        for (let i = 0; i < sheetData.length; i++) {
            const row = sheetData[i];

            // 跳过空行
            if (!row || row.length === 0) {
                continue;
            }

            const key = row[0]; // A列作为key
            const value = row[1]; // B列作为value

            // 跳过key为空的行
            if (key === undefined || key === null || key === "") {
                continue;
            }

            result[String(key)] = value === undefined || value === null ? "" : String(value);
            processedRows++;
        }

        console.log(`已处理 ${processedRows} 行数据`);

        if (processedRows === 0) {
            console.warn("警告: 没有找到有效的数据行（A列为空）");
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
        convertXlsxToJson(inputPath, outputPath);

    } catch (error) {
        console.error(`❌ ${error.message}`);
        process.exit(1);
    }
}

// 只有在直接运行此脚本时才执行main函数
if (require.main === module) {
    main();
}

module.exports = { convertXlsxToJson, validateFile, generateOutputPath };