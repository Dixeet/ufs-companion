/* eslint-disable no-console */
import parseFishesDir from './parseFishesDir.js';
import parseBaitsDir from './parseBaitsDir.js';
import parseMainMenu from './parseMainMenu.js';
import parseI2Languages from './parseI2Languages.js';
import cleanAndWrite from './cleanAndWrite.js';

export default async function generate(generatePath, extractPath) {
  console.log('Parsing...');
  const [fishes, baits] = await Promise.all([
    parseFishesDir(extractPath),
    parseBaitsDir(extractPath),
  ]);
  const fisheries = await parseMainMenu(extractPath, baits);
  console.log('Generating...');
  await parseI2Languages(extractPath, fishes, baits, fisheries);
  console.log('Writing...');
  await cleanAndWrite(generatePath, { fishes, baits, fisheries });
}
