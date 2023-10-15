import parseFishesDir from './parseFishesDir.js';
import parseBaitsDir from './parseBaitsDir.js';
import parseMainMenu from './parseMainMenu.js';

export default async function generate(generateRootPath, extractPath) {
  const [fishes, baits] = await Promise.all([
    parseFishesDir(extractPath),
    parseBaitsDir(extractPath),
  ]);
  const fisheries = await parseMainMenu(extractPath, baits);
}
