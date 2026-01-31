#!/usr/bin/env deno run --allow-read --allow-write --allow-net

/**
 * XLSX转JSON脚本 - Deno版本
 * 用法: deno run --allow-read --allow-write --allow-net xlsx2json.js <输入文件路径> [输出文件路径]
 *
 * 将XLSX文件的第一个工作表转换为JSON格式
 * A列作为key，B列作为value
 */

// 使用动态导入来处理可能的网络问题
let XLSX;
try {
    XLSX = await import("https://deno.land/x/sheetjs@v0.18.3/xlsx.mjs");
} catch (error) {
    console.error("❌ 无法加载SheetJS库，请检查网络连接或使用离线版本");
    console.error("错误详情:", error.message);
    Deno.exit(1);
}

function showUsage() {
    console.log("用法:");
    console.log("  deno run --allow-read --allow-write --allow-net xlsx2json.js <输入文件路径> [输出文件路径]");
    console.log("");
    console.log("参数:");
    console.log("  输入文件路径    - 要转换的XLSX文件路径");
    console.log("  输出文件路径    - 生成的JSON文件路径（可选，默认与输入文件同名但扩展名为.json）");
    console.log("");
    console.log("示例:");
    console.log("  deno run --allow-read --allow-write --allow-net xlsx2json.js data.xlsx");
    console.log("  deno run --allow-read --allow-write --allow-net xlsx2json.js data.xlsx output.json");
}

function validateFile(filePath) {
    try {
        const fileInfo = Deno.statSync(filePath);
        if (!fileInfo.isFile) {
            throw new Error(`${filePath} 不是一个文件`);
        }

        if (!filePath.toLowerCase().endsWith('.xlsx') && !filePath.toLowerCase().endsWith('.xls')) {
            throw new Error(`${filePath} 不是Excel文件格式（需要.xlsx或.xls）`);
        }

        return true;
    } catch (error) {
        if (error instanceof Deno.errors.NotFound) {
            throw new Error(`文件不存在: ${filePath}`);
        }
        throw error;
    }
}

function generateOutputPath(inputPath) {
    const lastDotIndex = inputPath.lastIndexOf('.');
    if (lastDotIndex === -1) {
        return inputPath + '.json';
    }
    return inputPath.substring(0, lastDotIndex) + '.json';
}

async function convertXlsxToJson(inputPath, outputPath) {
    try {
        console.log(`正在读取文件: ${inputPath}`);

        // 读取Excel文件
        const data = await Deno.readFile(inputPath);
        const workbook = XLSX.readXLSX(data);

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
        await Deno.writeTextFile(outputPath, jsonString);

        console.log(`✅ 转换完成！`);
        console.log(`   输入文件: ${inputPath}`);
        console.log(`   输出文件: ${outputPath}`);
        console.log(`   转换行数: ${processedRows}`);

    } catch (error) {
        console.error(`❌ 转换失败: ${error.message}`);
        Deno.exit(1);
    }
}

async function main() {
    const args = Deno.args;

    if (args.length === 0 || args.includes('-h') || args.includes('--help')) {
        showUsage();
        return;
    }

    if (args.length < 1 || args.length > 2) {
        console.error("❌ 参数数量错误");
        showUsage();
        Deno.exit(1);
    }

    const inputPath = args[0];
    const outputPath = args[1] || generateOutputPath(inputPath);

    try {
        // 验证输入文件
        validateFile(inputPath);

        // 执行转换
        await convertXlsxToJson(inputPath, outputPath);

    } catch (error) {
        console.error(`❌ ${error.message}`);
        Deno.exit(1);
    }
}

// 只有在直接运行此脚本时才执行main函数
if (import.meta.main) {
    await main();
}