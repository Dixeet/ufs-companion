import parseFishesDir from './parseFishesDir.js';
import parseBaitsDir from './parseBaitsDir.js';

export default async function generate(generateRootPath, extractPath) {
  const [fishes, baits] = await Promise.all([
    parseFishesDir(extractPath),
    parseBaitsDir(extractPath),
  ]);
}
