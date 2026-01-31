#!/usr/bin/env deno run --allow-read --allow-write

/**
 * XLSX转JSON脚本（简化版）- Deno版本
 * 用法: deno run --allow-read --allow-write xlsx2json-simple.js <输入文件路径> [输出文件路径]
 *
 * 说明：此版本使用基础的文本处理方法，适用于简单的Excel文件
 * 要求Excel文件已经另存为CSV格式，或者使用在线工具转换
 */

function showUsage() {
    console.log("用法:");
    console.log("  deno run --allow-read --allow-write xlsx2json-simple.js <输入文件路径> [输出文件路径]");
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
    console.log("  deno run --allow-read --allow-write xlsx2json-simple.js data.csv");
    console.log("  deno run --allow-read --allow-write xlsx2json-simple.js data.csv output.json");
    console.log("");
    console.log("注意:");
    console.log("  如果您有.xlsx文件，请先在Excel中另存为CSV格式");
}

function validateFile(filePath) {
    try {
        const fileInfo = Deno.statSync(filePath);
        if (!fileInfo.isFile) {
            throw new Error(`${filePath} 不是一个文件`);
        }

        const validExtensions = ['.csv', '.txt'];
        const hasValidExtension = validExtensions.some(ext =>
            filePath.toLowerCase().endsWith(ext)
        );

        if (!hasValidExtension) {
            throw new Error(`${filePath} 不是支持的文件格式（需要.csv或.txt）`);
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

async function convertToJson(inputPath, outputPath) {
    try {
        console.log(`正在读取文件: ${inputPath}`);

        // 读取文件内容
        const content = await Deno.readTextFile(inputPath);
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
        await convertToJson(inputPath, outputPath);

    } catch (error) {
        console.error(`❌ ${error.message}`);
        Deno.exit(1);
    }
}

// 只有在直接运行此脚本时才执行main函数
if (import.meta.main) {
    await main();
}