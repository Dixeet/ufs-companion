import { readdir, readFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import { findOne } from './regexHelper.js';

export default async function parseBaitsDir(extractPath) {
  const dirFiles = await readdir(resolve(extractPath, 'baits'));
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
  return parseInt(
    findOne(/(?<=\s*m_RootGameObject:\s?{fileID:\s).*(?=})/g, data),
  );
}

function findBaitType(data) {
  /*
   "baitType": null, Appâts EQUIPMENT/BAITS
   "baitType": "1", Cuilleres tournantes, EQUIPMENT/SPINNERS
   "baitType": "2", Cuilleres ondulantes, EQUIPMENT/SPOON
   "baitType": "3", Wobblers, EQUIPMENT/WOBBLERS
   "baitType": "4", Leurres souples, EQUIPMENT/SOFT_BAITS
   "baitType": "5", Mouches, EQUIPMENT/FLIES
   */
  const baitTypes = [
    'EQUIPMENT/BAITS',
    'EQUIPMENT/SPINNERS',
    'EQUIPMENT/SPOON',
    'EQUIPMENT/WOBBLERS',
    'EQUIPMENT/SOFT_BAITS',
    'EQUIPMENT/FLIES',
  ];
  const type = findOne(/(?<=\s*baitType:\s).*/g, data);
  const baitType = type ? baitTypes[parseInt(type)] : baitTypes[0];
  return baitType;
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
            species.push(parseInt(speciesInterests[index]));
          }
        }
      }
    }
  }
  return species;
}
