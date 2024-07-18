// deno run -A splitHtml.js
import { ensureFile } from "https://deno.land/std/fs/mod.ts";
import { green, bold } from "https://deno.land/std/fmt/colors.ts";
// 使用cheerio提取出來的有問題，改用正則表達式

var req = await Deno.readTextFileSync('./.input/index.html');
var pattern = /<template [^>]*>([\s\S]*?)<\/template>/g;
var matches = req.match(pattern);

var list = []
matches.forEach((item) => {
  var reg1 = /<template[^>]*\sid=["']([^"']*)["'][^>]*>/;
  var m1 = item.match(reg1);

  var id = m1[1];
  list.push(id)

  var html = item.replace(reg1, '').replace(/<\/template>/, '')

  const regex = /{%([^%]*)%}/g;
  // 移除表達式之間的換行符和不必要的空格
  html = html.replace(regex, (match, group) => {
    return `{%${group.replace(/\s+/g, ' ')}%}`;
  });

  writeFile(`./.output/templates/${id}.html`, html)
});

async function writeFile(filePath, content) {
  // 确保文件存在，若不存在则创建
  await ensureFile(filePath);
  // 写入文件
  await Deno.writeTextFileSync(filePath, content);
  console.log(green('统计数据已生成，路径 ' + filePath));
}