// deno run -A ./.task/jsrtest.ts
import { DOMParser } from 'https://deno.land/x/deno_dom/deno-dom-wasm.ts';
import * as cheerio from "https://cdn.skypack.dev/cheerio";
import { scrape } from 'https://jsr.io/@jeff/markdown-scraper/0.1.1/mod.ts';

const response = await fetch('https://example.com');
const html = await response.text();

const document = new DOMParser().parseFromString(html, 'text/html');
const title = document?.querySelector('title')?.textContent;
console.log(title);

const data = await scrape('https://example.com');
console.log(data);

const $ = cheerio.load(html);
const tit = $("title").text();
console.log(tit);