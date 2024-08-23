// deno run -A esm.js
import * as cheerio from 'https://cdn.skypack.dev/cheerio';

const $ = cheerio.load('<h2 class="title">Hello world</h2>');
console.log($('h2.title').text())