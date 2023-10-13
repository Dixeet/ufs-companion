import { cwd } from 'node:process';
import { resolve } from 'node:path';
import cli from './parse/cli.js';
import { copyExportedFiles, cleanFiles } from './parse/exported.js';

const { argv, output } = cli();

if (argv?.help) {
  // eslint-disable-next-line no-console
  console.log(output);
} else if (argv?.clean) {
  await cleanFiles();
} else {
  if (argv?.extract) {
    await copyExportedFiles(resolve(cwd(), argv.extract));
  }
}
