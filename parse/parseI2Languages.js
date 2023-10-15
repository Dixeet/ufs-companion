import { readFile } from 'node:fs/promises';
import { resolve } from 'node:path';

export default async function parseI2Languages(
  extractPath,
  fishes,
  baits,
  fisheries,
) {
  const file = await readFile(
    resolve(extractPath, 'I2Languages.prefab'),
    'utf-8',
  );
  return Promise.all([
    fillFishesInfos(fishes, file),
    fillBaitsInfos(baits, file),
    fillFisheriesInfos(fisheries, file),
  ]);
}

async function fillFishesInfos(fishes, data) {
  const spinningMethods = {
    'HUD/SPINNING_STRAIGHT_SLOW': null,
    'HUD/SPINNING_STRAIGHT': null,
    'HUD/SPINNING_LIFT_DROP': null,
    'HUD/SPINNING_STOP_GO': null,
    'HUD/SPINNING_TWITCHING': null,
  };
  for (const method in spinningMethods) {
    spinningMethods[method] = findTrad(method, data);
  }
  for (const fish of fishes) {
    fish.name = findTrad(fish.name, data) || fish.name;
    fish.description = findTrad(fish.description, data) || fish.description;
    if (fish.spinningMethods?.length) {
      fish.spinningMethods.forEach((method, index) => {
        fish.spinningMethods[index] = spinningMethods[method];
      });
    }
  }
}

async function fillFisheriesInfos(fisheries, data) {
  for (const fishery of fisheries) {
    if (fishery.name) {
      fishery.name = findTrad(fishery.name, data) || fishery.name;
    }
    if (fishery.description) {
      fishery.description =
        findTrad(fishery.description, data) || fishery.description;
    }
    if (fishery.location) {
      fishery.location = findTrad(fishery.location, data) || fishery.location;
    }
  }
}

async function fillBaitsInfos(baits, data) {
  const baitTypes = {
    'EQUIPMENT/BAITS': null,
    'EQUIPMENT/SPINNERS': null,
    'EQUIPMENT/SPOON': null,
    'EQUIPMENT/WOBBLERS': null,
    'EQUIPMENT/SOFT_BAITS': null,
    'EQUIPMENT/FLIES': null,
  };
  for (const type in baitTypes) {
    baitTypes[type] = findTrad(type, data);
  }
  for (const bait of baits) {
    if (bait.equipmentTranslateName) {
      bait.name = findTrad(bait.equipmentTranslateName, data) || {
        en: bait.equipmentName,
        fr: bait.equipmentName,
      };
    } else {
      bait.name = {
        en: bait.equipmentName,
        fr: bait.equipmentName,
      };
    }
    delete bait.equipmentName;
    delete bait.equipmentTranslateName;
    if (bait.baitType) {
      bait.baitTypeName = baitTypes[bait.baitType];
    }
  }
}

function findTrad(term, data) {
  let res = null;
  const trads = data.match(
    new RegExp(
      '(?<=' +
        term +
        '\\n *TermType:.*\\n *Description:.*\\n *Languages:.*\\n( *- .*\\n)*( *- )).*',
      'g',
    ),
  );
  if (trads?.length) {
    res = {
      en: trads[0],
      fr: trads[0],
    };
    if (trads[3]) {
      res.fr = trads[3];
    }
  }
  return res;
}
