import { readFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import { findOne } from './regexHelper.js';

export default async function parseMainMenu(extractPath, baits) {
  const file = await readFile(resolve(extractPath, 'MainMenu.unity'), 'utf-8');
  const [toFishWeight, fisheries] = await Promise.all([
    findToFishWeight(file),
    findFisheries(file),
    extendBaitsInfos(baits, file),
  ]);
  return { toFishWeight, fisheries };
}

async function findToFishWeight(data) {
  return [
    {
      id: 'hookToFishWeight',
      sizes: findHookSizes(data, 'hookToFishWeight'),
    },
    {
      id: 'lureToFishWeight',
      sizes: findHookSizes(data, 'lureToFishWeight'),
    },
    {
      id: 'flyToFishWeight',
      sizes: findHookSizes(data, 'flyToFishWeight'),
    },
  ];
}

function findHookSizes(data, type) {
  const sizes = [
    '#12',
    '#8',
    '#6',
    '#4',
    '#2',
    '#1',
    '#1/0',
    '#2/0',
    '#3/0',
    '#4/0',
    '#5/0',
    '#6/0',
    '#7/0',
    '#8/0',
    '#9/0',
    '#10/0',
    '#11/0',
    '#12/0',
  ];
  const rawSizes = data.match(
    new RegExp('(?<=' + type + ':\\n(  -.*\\n)*(  -.*))(?:\\d|\\.)+', 'g'),
  );
  const hookSizes = [];
  if (rawSizes.length) {
    for (const index in rawSizes) {
      if (!(index % 2)) {
        hookSizes.push({
          size: sizes[index / 2],
          min: parseFloat(rawSizes[index]),
          max: parseFloat(rawSizes[parseInt(index) + 1]),
        });
      }
    }
  }
  return hookSizes;
}

async function extendBaitsInfos(baits, data) {
  const baitsToDelete = [];
  for (const index in baits) {
    const bait = baits[index];
    const dataBait = findOne(
      new RegExp(bait.id + '[\\s\\S]*?(?= *description)', 'g'),
      data,
    );
    if (dataBait) {
      bait.price = parseFloat(findOne(/(?<=price: ).*/g, dataBait));
      bait.equipmentName = findOne(/(?<=equipmentName: ).*/g, dataBait);
      bait.equipmentTranslateName = findOne(
        /(?<=equipmentTranslateName: ).*/g,
        dataBait,
      );
    } else {
      baitsToDelete.push(index);
    }
  }
  let deletedCount = 0;
  for (const index of baitsToDelete) {
    baits.splice(index - deletedCount, 1);
    deletedCount++;
  }
}

async function findFisheries(data) {
  const fisheries = [];
  const fisheriesFound = data.match(/\s{2}- unitySceneName(?:.*\n\s{3,}.*)*/g);
  if (fisheriesFound?.length) {
    for (const fisheryStr of fisheriesFound) {
      const id = parseInt(findOne(/(?<=fisheryId:\s).*/g, fisheryStr));
      const fakeFishery = findOne(/leaderboardName: TODO/g, fisheryStr);
      if (id !== undefined && id !== null && id >= 0 && !fakeFishery) {
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
