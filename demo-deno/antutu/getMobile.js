// deno run -A getMobile.js
import { ensureFile } from "https://deno.land/std/fs/mod.ts";
import jsonData from './.output/antutu.json' with { type : 'json' };
import { green, bold } from "https://deno.land/std/fmt/colors.ts";

var list = jsonData.filter(item => Object.keys(item.params).length).map(item => ({
    index: item.index,
    names: item.names,
    price: item.price,
    width: getWidth(item.params?.['手机尺寸']),
    weight: parseFloat(item.params?.['手机重量']),
}))
list = list.filter((item) => !item.names.includes('三星'))
list = list.toSorted((prev, cur) => prev.weight - cur.weight)
writeFile('./.output/mobile.json', JSON.stringify(list, null, 2))

function getWidth(str = '') {
  return str.split('×').at(1) || 999
}

async function writeFile(filePath, content) {
  // 确保文件存在，若不存在则创建
  await ensureFile(filePath);
  // 写入文件
  await Deno.writeTextFileSync(filePath, content);
  console.log(green("统计数据已生成，路径 " + filePath));
}