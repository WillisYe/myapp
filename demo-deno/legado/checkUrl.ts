// deno run -A checkUrl.ts
// sourceUrl耗时梳理
import { ensureFile } from 'https://deno.land/std/fs/mod.ts';
import { green, bold } from 'https://deno.land/std/fmt/colors.ts';
import jsonData from './.input/result.json' assert { type: 'json' };

async function main() {
	const list = await Promise.all(
		jsonData.slice(0, 10).map(async (item) => {
			const time = await checkLinkAvailability(item.sourceUrl);
			console.log(`${bold(item.sourceUrl)} 耗时${time}ms`);
			return { url: item.sourceUrl, time };
		})
	);

	await writeFile('./.output/listRead.json', JSON.stringify(list, null, 2));
}

async function writeFile(filePath, content) {
	await ensureFile(filePath);
	await Deno.writeTextFile(filePath, content);
	console.log(green('统计数据已生成，路径 ' + filePath));
}

async function checkLinkAvailability(url: string): Promise<number | null> {
	try {
		const start = performance.now();
		const response = await fetch(url);
		const end = performance.now();
		const elapsedTime = parseInt(end - start);
		return response.ok ? elapsedTime : 0;
	} catch (error) {
		return 0;
	}
}

main();
