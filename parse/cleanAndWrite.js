import { writeFile, unlink } from 'node:fs/promises';
import { resolve } from 'node:path';

export default async function cleanAndWrite(generatePath, data) {
  const fileNames = {
    fishes: 'fishes.json',
    baits: 'baits.json',
    fisheries: 'fisheries.json',
  };
  await cleanFiles(generatePath, fileNames);
  return Promise.all(
    Object.entries(fileNames).map(([key, fileName]) =>
      writeFile(resolve(generatePath, fileName), JSON.stringify(data[key])),
    ),
  );
}

export async function cleanFiles(generatePath, fileNames) {
  return Promise.all(
    Object.values(fileNames).map((fileName) =>
      unlink(resolve(generatePath, fileName)).catch(() => {}),
    ),
  );
}
