import { readFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import { findOne } from './regexHelper.js';

export default async function parseMainMenu(extractPath, baits) {
  const file = await readFile(resolve(extractPath, 'MainMenu.unity'), 'utf-8');
  const [fisheries] = await Promise.all([
    findFisheries(file),
    extendBaitsInfos(baits, file),
  ]);
  return fisheries;
}

async function extendBaitsInfos(baits, data) {
  for (const bait of baits) {
    const dataBait = findOne(
      new RegExp(bait.id + '[\\s\\S]*?(?= *description)', 'g'),
      data,
    );
    if (dataBait) {
      bait.price = findOne(/(?<=price: ).*/g, dataBait);
      bait.equipmentName = findOne(/(?<=equipmentName: ).*/g, dataBait);
      bait.equipmentTranslateName = findOne(
        /(?<=equipmentTranslateName: ).*/g,
        dataBait,
      );
    }
  }
}

async function findFisheries(data) {
  const fisheries = [];
  const fisheriesFound = data.match(/\s{2}- unitySceneName(?:.*\n\s{3,}.*)*/g);
  if (fisheriesFound?.length) {
    for (const fisheryStr of fisheriesFound) {
      const id = findOne(/(?<=fisheryId:\s).*/g, fisheryStr);
      const fakeFishery = findOne(/leaderboardName: TODO/g, fisheryStr);
      if (id && parseInt(id) >= 0 && !fakeFishery) {
        const fishery = {
          id,
          name: findOne(/(?<=name:\s).*/g, fisheryStr),
          description: findOne(/(?<=description:\s).*/g, fisheryStr),
          location: findOne(/(?<=location:\s).*/g, fisheryStr),
          species: findFisherySpecies(fisheryStr),
        };
        fisheries.push(fishery);
      }
    }
  }
  return fisheries;
}

function findFisherySpecies(data) {
  const species = [];
  const fishSpecies = findOne(/(?<=fishSpecies:\s).*/g, data);
  if (fishSpecies) {
    for (let i = 0; i < fishSpecies.length / 8; i++) {
      const chunk = fishSpecies.slice(i * 8, (i + 1) * 8).slice(0, 2);
      species.push(parseInt(chunk, 16));
    }
  }
  return species;
}
