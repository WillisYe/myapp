// deno run -A ping.js
// 运行ping命令
async function pingIP(ipAddress) {
  const process = Deno.run({
    cmd: ["ping", ipAddress], // 在此处可以根据操作系统进行适当的更改
    stdout: "piped",
    stderr: "piped",
  });

  const { code } = await process.status();
  // const rawOutput = await process.output();

  // const decoder = new TextDecoder();
  // const output = decoder.decode(rawOutput);

  // console.log(`Ping results for ${ipAddress}:`);
  // console.log(output);

  if (code === 0) {
    console.error(`Ping to ${ipAddress} success.`);
  } else {
    console.error(`Ping to ${ipAddress} failed.`);
  }
}

await pingIP("www.baidu.com");