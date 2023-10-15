import parseFishesDir from './parseFishesDir.js';
import parseBaitsDir from './parseBaitsDir.js';
import parseMainMenu from './parseMainMenu.js';
import parseI2Languages from './parseI2Languages.js';

export default async function generate(generateRootPath, extractPath) {
  // eslint-disable-next-line no-console
  console.log('Parsing...');
  const [fishes, baits] = await Promise.all([
    parseFishesDir(extractPath),
    parseBaitsDir(extractPath),
  ]);
  const fisheries = await parseMainMenu(extractPath, baits);
  await parseI2Languages(extractPath, fishes, baits, fisheries);
}
