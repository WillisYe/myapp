// deno run -A search.ts input/index.html div
import { readLines } from "https://deno.land/std/io/mod.ts";

async function searchFile(filePath: string, keyword: string) {
    let lineNumber = 0;
    const file = await Deno.open(filePath);

    for await (const line of readLines(file)) {
        lineNumber++;
        if (line.includes(keyword)) {
            console.log(`${lineNumber}: ${line}`);
        }
    }

    file.close();
}

const [filePath, keyword] = Deno.args;

if (!filePath || !keyword) {
    console.error("Usage: deno run searchFile.ts <file-path> <keyword>");
    Deno.exit(1);
}

await searchFile(filePath, keyword);