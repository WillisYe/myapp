// deno run -A denoRunPython.js
const pythonScript = `
import sys

# 读取Deno传递的输入数据
input_data = sys.stdin.read()

# 执行一些Python代码
result = input_data.upper()

# 将结果写入标准输出
sys.stdout.write(result)
`;

const process = Deno.run({
  cmd: ["python", "-c", pythonScript],
  stdin: "piped",
  stdout: "piped",
});

const inputData = "hello from Deno";

// 将输入数据写入子进程的标准输入
await process.stdin.write(new TextEncoder().encode(inputData));
process.stdin.close();

// 读取子进程的标准输出作为结果
const outputData = new TextDecoder().decode(await process.output());
console.log(outputData);

// 等待子进程结束
await process.status();