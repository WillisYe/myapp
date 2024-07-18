// deno run -A getPhone.js
import cheerio from 'npm:cheerio'
import { ensureFile } from "https://deno.land/std/fs/mod.ts";

const req1 = await getHtmlContent('https://www.antutu.com/ranking/rank2.htm');
const $ = cheerio.load(req1);

var list = []
$('.newrankc').each(function (i, elem) {
  var str = $(this).text().trim()
  var arr = str.split(' ').filter(item => item)
  list[i] = {
    str: str,
    index: arr[0],
    sku: arr.at(-1),
    name: arr.slice(1, -1).join(' '),
    params: {}
  }
});

for (const item of list.slice(0, -1)) {
  var url = `https://s.cnmo.com/se.php?s=${encodeURIComponent(item.name)}`
  const content = await getHtmlContent(url);
  var $1 = cheerio.load(content);
  var a = $1('.parameter a').attr('href')
  if (a) {
    item.a = 'https:' + a
    const html = await getHtmlContent(a, 'GBK');
    var $2 = cheerio.load(html);
    item.price = $2('.cell-price .red').text()
    $2('#cell-con-table li').each(function (i, elem) {
      var left = $2(this).find('.left h3').text().trim()
      var right = $2(this).find('.right p').eq(0).text().trim()
      item.params[left] = right.replaceAll('纠错', '').replaceAll('\n', '').trim()
    });
  }
}

list = list.toSorted((prev, cur) => parseFloat(prev.params?.['屏幕尺寸'] || 0) - parseFloat(cur.params?.['屏幕尺寸'] || 0))
writeFile('./.output/antutu.json', JSON.stringify(list, null, 2))

async function writeFile(filePath, content) {
  // 确保文件存在，若不存在则创建
  await ensureFile(filePath);
  // 写入文件
  await Deno.writeTextFileSync(filePath, content);
}

async function getHtmlContent(url, code = 'utf-8') {
  if (url.startsWith('//')) {
    url = 'https:' + url
  }
  const response = await fetch(url);
  const buffer = await response.arrayBuffer();
  const decoder = new TextDecoder(code);
  const content = decoder.decode(buffer);
  return content
}