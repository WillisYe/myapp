// deno run -A getBookmarks.js
import { ensureFile } from "https://deno.land/std/fs/mod.ts";
import { green, bold } from "https://deno.land/std/fmt/colors.ts";
import jsonData from "./.input/Bookmarks.json" assert { type: "json" };

var list = jsonData.roots.bookmark_bar.children.reduce((pre, cur) => {
  if (!cur.children) {
    console.log(cur.guid, cur.name)
  }
  return [...pre, ...(cur.children || [cur])];
}, []);

list = list.toSorted((a, b) => {
  switch (true) {
    case a.url > b.url:
      return 1;
    case a.url < b.url:
      return -1;
    case a.url == b.url:
      return 0;
    default:
      break;
  }
});

var listRepeat = list.filter((item, index) => index != list.findIndex(i => i.url == item.url)) 
var urls = list.map(item => item.url)

writeFile("./.output/Bookmarks.json", JSON.stringify(list, null, 2));
writeFile("./.output/listRepeat.json", JSON.stringify(listRepeat, null, 2));
writeFile("./.output/urls.json", JSON.stringify(urls, null, 2));

async function writeFile(filePath, content) {
  // 确保文件存在，若不存在则创建
  await ensureFile(filePath);
  // 写入文件
  await Deno.writeTextFileSync(filePath, content);
  console.log(green("统计数据已生成，路径 " + filePath));
}
