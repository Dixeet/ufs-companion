import parseFishesDir from './parseFishesDir.js';

export default async function generate(generateRootPath, extractPath) {
  await parseFishesDir(extractPath);
}
