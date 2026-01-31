#!/usr/bin/env deno run --allow-read --allow-write --allow-run

/**
 * XLSX转JSON批量处理脚本 - Deno版本
 * 用法: deno run --allow-read --allow-write --allow-run batch-convert.js [目录路径]
 *
 * 此脚本会：
 * 1. 查找指定目录（默认当前目录）中的所有.xlsx文件
 * 2. 显示转换选项给用户选择
 * 3. 执行相应的转换操作
 */

async function findXlsxFiles(directory = '.') {
    const files = [];

    try {
        for await (const entry of Deno.readDir(directory)) {
            if (entry.isFile && entry.name.toLowerCase().endsWith('.xlsx')) {
                files.push(entry.name);
            }
        }
    } catch (error) {
        throw new Error(`无法读取目录 ${directory}: ${error.message}`);
    }

    return files;
}

function showFiles(files) {
    console.log(`找到 ${files.length} 个Excel文件:`);
    files.forEach((file, index) => {
        console.log(`  ${index + 1}. ${file}`);
    });
}

function generateOutputName(inputFile, extension) {
    const lastDotIndex = inputFile.lastIndexOf('.');
    if (lastDotIndex === -1) {
        return inputFile + extension;
    }
    return inputFile.substring(0, lastDotIndex) + extension;
}

async function promptUser(message) {
    console.log(message);
    const buf = new Uint8Array(1024);
    const n = await Deno.stdin.read(buf);
    const input = new TextDecoder().decode(buf.subarray(0, n)).trim();
    return input;
}

function showConvertOptions() {
    console.log("\n转换选项:");
    console.log("1. 使用网络版本（需要网络连接，支持完整XLSX解析）");
    console.log("2. 手动转换指南（离线方式）");
    console.log("3. 退出");
}

async function convertWithNetwork(files) {
    console.log("\n使用网络版本转换...");

    for (const file of files) {
        try {
            console.log(`\n正在转换: ${file}`);

            const process = Deno.run({
                cmd: ["deno", "run", "--allow-read", "--allow-write", "--allow-net", "xlsx2json.js", file],
                stdout: "piped",
                stderr: "piped"
            });

            const [status, stdout, stderr] = await Promise.all([
                process.status(),
                process.output(),
                process.stderrOutput()
            ]);

            process.close();

            if (status.success) {
                console.log("✅ 转换成功");
            } else {
                console.error("❌ 转换失败:");
                console.error(new TextDecoder().decode(stderr));
            }

        } catch (error) {
            console.error(`❌ 转换 ${file} 时出错: ${error.message}`);
        }
    }
}

function showManualGuide(files) {
    console.log("\n📋 手动转换指南:");
    console.log("====================");

    files.forEach((file, index) => {
        console.log(`\n${index + 1}. 处理文件: ${file}`);
        console.log("   步骤:");
        console.log("   a) 用Excel打开此文件");
        console.log("   b) 确保A列是key，B列是value");
        console.log("   c) 选择 文件 > 另存为");
        console.log(`   d) 文件名: ${generateOutputName(file, '.csv')}`);
        console.log("   e) 文件类型选择: CSV (逗号分隔)(*.csv)");
        console.log("   f) 点击保存");
        console.log(`   g) 运行: deno run --allow-read --allow-write xlsx2json-simple.js "${generateOutputName(file, '.csv')}"`);
    });

    console.log("\n或者，您也可以使用在线工具:");
    console.log("- https://convertio.co/xlsx-csv/");
    console.log("- https://www.zamzar.com/convert/xlsx-to-csv/");

    console.log("\n转换为CSV后，使用以下命令:");
    files.forEach(file => {
        const csvName = generateOutputName(file, '.csv');
        console.log(`deno run --allow-read --allow-write xlsx2json-simple.js "${csvName}"`);
    });
}

async function main() {
    const args = Deno.args;
    const directory = args[0] || '.';

    console.log("XLSX转JSON批量处理工具 - Deno版本");
    console.log("===============================");

    try {
        // 查找Excel文件
        const files = await findXlsxFiles(directory);

        if (files.length === 0) {
            console.log(`在目录 "${directory}" 中没有找到.xlsx文件`);
            return;
        }

        showFiles(files);
        showConvertOptions();

        const choice = await promptUser("\n请选择操作 (1-3): ");

        switch (choice.trim()) {
            case '1':
                await convertWithNetwork(files);
                break;
            case '2':
                showManualGuide(files);
                break;
            case '3':
                console.log("退出程序");
                break;
            default:
                console.log("无效选择");
                break;
        }

    } catch (error) {
        console.error(`❌ ${error.message}`);
        Deno.exit(1);
    }
}

// 只有在直接运行此脚本时才执行main函数
if (import.meta.main) {
    await main();
}