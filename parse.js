/* eslint-disable no-console */
import { cwd } from 'node:process';
import { resolve } from 'node:path';
import { fileURLToPath, URL } from 'node:url';
import cli from './parse/cli.js';
import { copyExportedFiles, cleanFiles } from './parse/exported.js';
import generate from './parse/generate.js';

console.time('exec');
const { argv, output } = cli();
const extractPath = resolve(
  fileURLToPath(new URL('.', import.meta.url)),
  'parse/extract/',
);
const generatePath = resolve(
  fileURLToPath(new URL('.', import.meta.url)),
  'public/data/',
);

if (argv?.help) {
  console.log(output);
} else if (argv?.clean) {
  await cleanFiles(extractPath);
} else if (argv?.extract) {
  await copyExportedFiles(resolve(cwd(), argv.extract), extractPath);
} else {
  await generate(generatePath, extractPath);
}
const used = process.memoryUsage().heapUsed / 1024 / 1024;
console.timeEnd('exec');
console.log(`~ ${Math.round(used * 100) / 100} MB used`);
