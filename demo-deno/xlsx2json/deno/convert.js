#!/usr/bin/env deno run --allow-read --allow-write --allow-run

/**
 * XLSX转JSON快速启动脚本 - Deno版本
 * 用法: deno run --allow-read --allow-write --allow-run convert.js
 *
 * 这个脚本会自动检测当前目录的文件情况并提供最佳的转换方案
 */

async function detectFiles() {
    const files = {
        xlsx: [],
        csv: [],
        txt: []
    };

    try {
        for await (const entry of Deno.readDir('.')) {
            if (entry.isFile) {
                const name = entry.name.toLowerCase();
                if (name.endsWith('.xlsx')) {
                    files.xlsx.push(entry.name);
                } else if (name.endsWith('.csv')) {
                    files.csv.push(entry.name);
                } else if (name.endsWith('.txt')) {
                    files.txt.push(entry.name);
                }
            }
        }
    } catch (error) {
        console.error(`无法读取当前目录: ${error.message}`);
        Deno.exit(1);
    }

    return files;
}

function showWelcome() {
    console.log("🔄 XLSX转JSON转换工具 - Deno版本");
    console.log("===============================");
    console.log("");
}

function showFilesSummary(files) {
    const total = files.xlsx.length + files.csv.length + files.txt.length;

    if (total === 0) {
        console.log("❌ 当前目录中没有找到可转换的文件");
        console.log("支持的文件格式: .xlsx, .csv, .txt");
        return false;
    }

    console.log("📁 检测到以下文件:");

    if (files.xlsx.length > 0) {
        console.log(`   Excel文件 (${files.xlsx.length}个):`);
        files.xlsx.forEach(file => console.log(`     - ${file}`));
    }

    if (files.csv.length > 0) {
        console.log(`   CSV文件 (${files.csv.length}个):`);
        files.csv.forEach(file => console.log(`     - ${file}`));
    }

    if (files.txt.length > 0) {
        console.log(`   文本文件 (${files.txt.length}个):`);
        files.txt.forEach(file => console.log(`     - ${file}`));
    }

    return true;
}

function showRecommendation(files) {
    console.log("\n💡 推荐方案:");

    if (files.csv.length > 0 || files.txt.length > 0) {
        console.log("✅ 直接转换CSV/TXT文件（推荐，无需网络）");
        console.log(`   命令: deno run --allow-read --allow-write --allow-run batch-convert.js`);
    }

    if (files.xlsx.length > 0) {
        console.log("📊 Excel文件转换选项:");
        console.log("   1. 网络版本（自动处理，需要网络连接）");
        console.log("   2. 手动转换（先转为CSV，后处理）");
        console.log(`   命令: deno run --allow-read --allow-write --allow-run batch-convert.js`);
    }
}

async function quickConvertCSV(files) {
    const csvFiles = files.csv.concat(files.txt);

    if (csvFiles.length === 0) {
        return;
    }

    console.log("\n🚀 开始快速转换CSV/TXT文件...");

    for (const file of csvFiles) {
        try {
            console.log(`\n正在处理: ${file}`);

            const process = Deno.run({
                cmd: ["deno", "run", "--allow-read", "--allow-write", "xlsx2json-simple.js", file],
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
                // 显示转换输出的关键信息
                const output = new TextDecoder().decode(stdout);
                const lines = output.split('\n');
                const successLine = lines.find(line => line.includes('转换完成'));
                const rowsLine = lines.find(line => line.includes('转换行数'));
                if (successLine) console.log(successLine);
                if (rowsLine) console.log(rowsLine);
            } else {
                console.error("❌ 转换失败:");
                console.error(new TextDecoder().decode(stderr));
            }

        } catch (error) {
            console.error(`❌ 处理 ${file} 时出错: ${error.message}`);
        }
    }

    console.log("\n✨ CSV/TXT文件转换完成！");
}

async function main() {
    showWelcome();

    // 检测文件
    const files = await detectFiles();

    if (!showFilesSummary(files)) {
        return;
    }

    showRecommendation(files);

    // 如果有CSV或TXT文件，提供快速转换选项
    if (files.csv.length > 0 || files.txt.length > 0) {
        console.log("\n❓ 是否立即转换CSV/TXT文件？(y/n): ");

        const buf = new Uint8Array(10);
        const n = await Deno.stdin.read(buf);
        const input = new TextDecoder().decode(buf.subarray(0, n)).trim().toLowerCase();

        if (input === 'y' || input === 'yes' || input === '') {
            await quickConvertCSV(files);
        }
    }

    // 如果有Excel文件，提供批量处理选项
    if (files.xlsx.length > 0) {
        console.log("\n❓ 是否处理Excel文件？(y/n): ");

        const buf = new Uint8Array(10);
        const n = await Deno.stdin.read(buf);
        const input = new TextDecoder().decode(buf.subarray(0, n)).trim().toLowerCase();

        if (input === 'y' || input === 'yes') {
            console.log("\n启动批量处理工具...");
            const process = Deno.run({
                cmd: ["deno", "run", "--allow-read", "--allow-write", "--allow-run", "batch-convert.js"]
            });
            await process.status();
            process.close();
        }
    }

    console.log("\n👋 感谢使用XLSX转JSON工具！");
}

if (import.meta.main) {
    await main();
}