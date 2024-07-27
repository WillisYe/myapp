// deno run -A checkUrl_class.ts
// sourceUrl耗时梳理
import { ensureFile } from 'https://deno.land/std/fs/mod.ts';
import { green, bold } from 'https://deno.land/std/fmt/colors.ts';
import jsonData from './.input/result.json' assert { type: 'json' };

class LinkChecker {
	constructor(private url: string) {}

	public time: number | 0 = 0;

	public async checkAvailability(): Promise<number | 0> {
		try {
			const start = performance.now();
			const response = await fetch(this.url);
			const end = performance.now();
			const elapsedTime = parseInt(end - start);
			return response.ok ? elapsedTime : 0;
		} catch (error) {
			return 0;
		}
	}

	public printResult(time: number | 0): void {
		this.time = time;
		const message = time === 0 ? '不可用或发生错误' : `${time}ms`;
		console.log(`检查完毕 ${bold(this.url)}，用时：${message}`);
	}
}

async function main() {
	const checkers = jsonData.slice(0, 10).map((item) => new LinkChecker(item.sourceUrl));

	for (const checker of checkers) {
		const time = await checker.checkAvailability();
		checker.printResult(time);
	}

	const list = checkers.map((checker) => ({ url: checker.url, time: checker.time }));
	await writeFile('./.output/listRead.json', JSON.stringify(list, null, 2));
}

main();

async function writeFile(filePath, content) {
	await ensureFile(filePath);
	await Deno.writeTextFile(filePath, content);
	console.log(green('统计数据已生成，路径 ' + filePath));
}
