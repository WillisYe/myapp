// deno run -A legado/checkSortUrl.ts
import { ensureFile } from 'https://deno.land/std/fs/mod.ts';
import { green, bold } from 'https://deno.land/std/fmt/colors.ts';
import jsonData from '../.input/exportRssSource.json' assert { type: 'json' };

async function main() {
	var list = jsonData.map((item, index) => {
		var customOrder;
		if ((item.sortUrl || '').match(/(<js>|@js).*/)) {
			customOrder = -20098490;
		}
		return {
			...item,
			customOrder,
		};
	});
	list = list.toSorted((item1, item2) => {
		if (item1.customOrder && item2.customOrder) {
			return item1.customOrder - item2.customOrder;
		}
		if (item1.customOrder) {
			return -1;
		}
		if (item2.customOrder) {
			return 1;
		}
		if (item1.sortUrl && item2.sortUrl) {
			return item1.sortUrl.localeCompare(item2.sortUrl);
		}
	});

	await writeFile('./.output/readSourceSortBySortUrl.json', JSON.stringify(list, null, 2));
}

main();

async function writeFile(filePath, content) {
	await ensureFile(filePath);
	await Deno.writeTextFile(filePath, content);
	console.log(green('统计数据已生成，路径 ' + filePath));
}
