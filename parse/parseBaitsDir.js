import { readdir, readFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import { findOne } from './regexHelper.js';

export default async function parseBaitsDir(extractPath) {
  const dirFiles = await readdir(resolve(extractPath, 'baits'));
  // const dirFiles = ['BombaCrank_01.prefab'];
  const files = dirFiles.filter((fileName) => fileName !== '.gitkeep');
  const baits = [];
  const handleFiles = files.map((fileName) =>
    readFile(resolve(extractPath, 'baits/', fileName), 'utf-8').then((data) => {
      const bait = {
        id: findId(data),
        baitType: findBaitType(data),
        species: findSpecies(data),
      };
      baits.push(bait);
    }),
  );
  await Promise.all(handleFiles);
  return baits;
}

function findId(data) {
  return findOne(/(?<=\s*m_RootGameObject:\s?{fileID:\s).*(?=})/g, data);
}

function findBaitType(data) {
  return findOne(/(?<=\s*baitType:\s).*/g, data);
}

function findSpecies(data) {
  const species = [];
  const fishInterests = findOne(
    /fishInterests:\n(.{4}(species|interest):\s.*\n)*/g,
    data,
  );
  if (fishInterests) {
    const speciesInterests = fishInterests.match(
      /(?<= (species|interest):\s).*/g,
    );
    if (speciesInterests?.length) {
      for (const index in speciesInterests) {
        if (!(index % 2)) {
          if (parseFloat(speciesInterests[parseInt(index) + 1]) >= 0.7) {
            species.push(speciesInterests[index]);
          }
        }
      }
    }
  }
  return species;
}
