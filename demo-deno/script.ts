
const start = performance.now();

// 执行任务
// ...
console.log("params:", Deno.args[0]);
console.log("Hello from Deno");

const end = performance.now();
const executionTime = end - start;
console.log("Deno time:", executionTime);