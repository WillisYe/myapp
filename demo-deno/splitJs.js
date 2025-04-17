// 拆分common.js开发过程中按需转uts
// deno run -A ./.task/splitJs.js
import { ensureFile } from "https://deno.land/std/fs/mod.ts";
import { green, bold } from "https://deno.land/std/fmt/colors.ts";

async function main() {
  const filePath = './common/js/common/index.js';
  const lines = await readFileToArray(filePath);
  const fns = []
  for (let index = 0; index < lines.length; index++) {
    const line = lines[index];
    if (line.startsWith('function') || line.startsWith('async function')) {
      let name = line.split('(')[0].split(' ').at(-1)
      let start = index + 1
      let end = lines.slice(start).findIndex(line => line.startsWith('}')) + start
      let code = lines.slice(start-1, end+1).join('\n') + `\nexport default ${name}`
      writeFile(`./.task/output/fns/${name}.uts`, code)
      fns.push(name)
    }
  }
  let importCode = fns.map(name => `import ${name} from './${name}.uts'`).join('\n')
  let exportCode = `\nexport default {\n` + fns.map(name => `  ${name},`).join('\n') + '\n}'
  writeFile(`./.task/output/fns/index.uts`, importCode + exportCode)
}

main()

async function readFileToArray(filePath) {
  try {
    // 读取文件内容为字符串
    const fileContent = await Deno.readTextFile(filePath);
    // 将字符串按换行符分割成数组
    const lines = fileContent.split('\n');
    // 返回数组
    return lines;
  } catch (error) {
    // 处理错误
    console.error(`Error reading file: ${error.message}`);
    throw error;
  }
}

async function writeFile(filePath, content) {
  // 确保文件存在，若不存在则创建
  await ensureFile(filePath);
  // 写入文件
  await Deno.writeTextFileSync(filePath, content);
  console.log(green('统计数据已生成，路径 ' + filePath));
}