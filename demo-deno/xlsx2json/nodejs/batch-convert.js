#!/usr/bin/env node

/**
 * XLSX转JSON批量处理脚本 - Node.js版本
 * 用法: node batch-convert.js [目录路径]
 *
 * 此脚本会：
 * 1. 查找指定目录（默认当前目录）中的所有.xlsx文件
 * 2. 显示转换选项给用户选择
 * 3. 执行相应的转换操作
 */

const fs = require('fs');
const path = require('path');
const { spawn } = require('child_process');
const readline = require('readline');

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

function findXlsxFiles(directory = '.') {
    const files = [];

    try {
        const entries = fs.readdirSync(directory, { withFileTypes: true });

        for (const entry of entries) {
            if (entry.isFile() && entry.name.toLowerCase().endsWith('.xlsx')) {
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
    const parsed = path.parse(inputFile);
    return parsed.name + extension;
}

function showConvertOptions() {
    console.log("\n转换选项:");
    console.log("1. 使用完整版本（需要安装xlsx依赖包）");
    console.log("2. 手动转换指南（离线方式）");
    console.log("3. 退出");
}

function promptUser(question) {
    return new Promise((resolve) => {
        rl.question(question, (answer) => {
            resolve(answer.trim());
        });
    });
}

function runCommand(command, args) {
    return new Promise((resolve, reject) => {
        const process = spawn(command, args, { stdio: 'inherit' });

        process.on('close', (code) => {
            if (code === 0) {
                resolve();
            } else {
                reject(new Error(`命令执行失败，退出码: ${code}`));
            }
        });

        process.on('error', (error) => {
            reject(error);
        });
    });
}

async function convertWithNodejs(files) {
    console.log("\n使用Node.js版本转换...");

    // 检查是否安装了依赖
    if (!fs.existsSync(path.join(__dirname, 'node_modules'))) {
        console.log("需要安装依赖包，正在执行 npm install...");
        try {
            await runCommand('npm', ['install']);
            console.log("✅ 依赖安装完成");
        } catch (error) {
            console.error("❌ 依赖安装失败:", error.message);
            console.log("请手动运行: npm install");
            return;
        }
    }

    for (const file of files) {
        try {
            console.log(`\n正在转换: ${file}`);
            await runCommand('node', ['xlsx2json.js', file]);
            console.log("✅ 转换成功");

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
        console.log(`   g) 运行: node xlsx2json-simple.js "${generateOutputName(file, '.csv')}"`);
    });

    console.log("\n或者，您也可以使用在线工具:");
    console.log("- https://convertio.co/xlsx-csv/");
    console.log("- https://www.zamzar.com/convert/xlsx-to-csv/");

    console.log("\n转换为CSV后，使用以下命令:");
    files.forEach(file => {
        const csvName = generateOutputName(file, '.csv');
        console.log(`node xlsx2json-simple.js "${csvName}"`);
    });
}

async function main() {
    const args = process.argv.slice(2);
    const directory = args[0] || '.';

    console.log("XLSX转JSON批量处理工具 - Node.js版本");
    console.log("===================================");

    try {
        // 查找Excel文件
        const files = await findXlsxFiles(directory);

        if (files.length === 0) {
            console.log(`在目录 "${directory}" 中没有找到.xlsx文件`);
            rl.close();
            return;
        }

        showFiles(files);
        showConvertOptions();

        const choice = await promptUser("\n请选择操作 (1-3): ");

        switch (choice) {
            case '1':
                await convertWithNodejs(files);
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

        rl.close();

    } catch (error) {
        console.error(`❌ ${error.message}`);
        rl.close();
        process.exit(1);
    }
}

// 只有在直接运行此脚本时才执行main函数
if (require.main === module) {
    main();
}