// deno run -A legado/checkSourceUrl.ts
// sourceUrl中有js的
import { ensureFile } from 'https://deno.land/std/fs/mod.ts';
import { green, bold } from 'https://deno.land/std/fmt/colors.ts';
import jsonData from '../.input/exportRssSource.json' assert { type: 'json' };

async function main() {
	var list = jsonData.map((item, index) => {
		var customOrder;
		if (!isValidURL(item.sourceUrl || '')) {
			customOrder = -20098490;
		}
		return {
			...item,
			customOrder,
		};
	});
	list = list.toSorted((item1, item2) => {
		if (item1.customOrder && item2.customOrder) {
			return item2.customOrder - item1.customOrder;
		}
		if (item1.customOrder) {
			return -1;
		}
		if (item2.customOrder) {
			return 1;
		}
		if (item1.sourceUrl && item2.sourceUrl) {
			return item1.sourceUrl.localeCompare(item2.sourceUrl);
		}
	});
	list.forEach((item, index) => {
		item.customOrder = index;
	});

	await writeFile('./.output/readSourceSortBySourceUrl.json', JSON.stringify(list, null, 2));
}

main();

async function writeFile(filePath, content) {
	await ensureFile(filePath);
	await Deno.writeTextFile(filePath, content);
	console.log(green('统计数据已生成，路径 ' + filePath));
}

function isValidURL(url) {
	const urlPattern = /^(https?:\/\/)?([a-z0-9-]+\.)+[a-z]{2,}(:\d+)?(\/[^\s]*)?$/i;
	return urlPattern.test(url);
}