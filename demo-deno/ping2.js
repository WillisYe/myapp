// deno run -A ping2.js
const process = Deno.run({
  cmd: ["ping", "example.com"],
  stdout: "piped",
  stderr: "piped",
});

const { code } = await process.status();
if (code === 0) {
  const rawOutput = await process.output();
  const output = new TextDecoder().decode(rawOutput);
  console.log(output);
} else {
  const rawError = await process.stderrOutput();
  const errorString = new TextDecoder().decode(rawError);
  console.error(errorString);
}

process.close();