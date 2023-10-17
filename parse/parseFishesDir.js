import { readdir, readFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import { findOne } from './regexHelper.js';

export default async function parseFishesDir(extractPath) {
  const dirFiles = await readdir(resolve(extractPath, 'fishes'));
  const files = dirFiles.filter((fileName) => fileName !== '.gitkeep');
  const fishes = [];
  const handleFiles = files.map((fileName) =>
    readFile(resolve(extractPath, 'fishes/', fileName), 'utf-8').then(
      (data) => {
        const fish = {
          id: findId(data),
          name: findName(data),
          description: findDescription(data),
          ...findWeights(data),
          time: findTime(data),
          wind: findWind(data),
          cloud: findCloud(data),
          rain: findRain(data),
          spinningMethods: findSpinningMethods(data),
        };
        fishes.push(fish);
      },
    ),
  );
  await Promise.all(handleFiles);
  return fishes;
}

function findId(data) {
  return parseInt(findOne(/(?<=species:\s?)\S\d*/g, data));
}

function findName(data) {
  return findOne(/(?<=fishName:\s?)\S.*/g, data);
}

function findDescription(data) {
  return findOne(/(?<=fishDescription:\s?)\S.*/g, data);
}

function findWeights(data) {
  const weights = {
    weight: parseFloat(findOne(/(?<=Weight:\s?)\S\d*/g, data)),
  };
  try {
    const [minWeight, maxWeight] = findOne(
      /(?<=WeightMinMax:\s?)\S.*/g,
      data,
    ).match(/(\d|\.)+/g);
    weights.minWeight = parseFloat(minWeight);
    weights.maxWeight = parseFloat(maxWeight);
  } catch (e) {
    /* empty */
  }
  return weights;
}

function findTime(data) {
  const curve = findOne(/\s{2}timeCurve:(?:.*\n\s{3,}.*)*/g, data);
  return getTimesValues(curve);
}

function findWind(data) {
  const curve = findOne(/\s{2}windCurve:(?:.*\n\s{3,}.*)*/g, data);
  return getTimesValues(curve);
}

function findCloud(data) {
  const curve = findOne(/\s{2}cloudinessCurve:(?:.*\n\s{3,}.*)*/g, data);
  return getTimesValues(curve);
}

function findRain(data) {
  const curve = findOne(/\s{2}rainCurve:(?:.*\n\s{3,}.*)*/g, data);
  return getTimesValues(curve);
}

function findSpinningMethods(data) {
  /*
  "spinningMethods": [
    "0",
    "0", Tirer lentement, HUD/SPINNING_STRAIGHT_SLOW
    "0", Tirer, HUD/SPINNING_STRAIGHT
    "0",
    "0", Lift & Drop, HUD/SPINNING_LIFT_DROP
    "0", Stop & Go, HUD/SPINNING_STOP_GO
    "1" Twitching, HUD/SPINNING_TWITCHING
  ]
   */
  const spinningMethods = [
    '',
    'HUD/SPINNING_STRAIGHT_SLOW',
    'HUD/SPINNING_STRAIGHT',
    '',
    'HUD/SPINNING_LIFT_DROP',
    'HUD/SPINNING_STOP_GO',
    'HUD/SPINNING_TWITCHING',
  ];
  const methods = data.match(
    /(?<=spinningMethodFactor:\s?\n( {2}- (?:\d|\.)*\n)*( {2}- ))(?:\d|\.)*/g,
  );
  if (methods) {
    const fishSpinningMethods = [];
    methods.forEach((method, index) => {
      if (parseFloat(method) >= 0.7) {
        fishSpinningMethods.push(spinningMethods[index]);
      }
    });
    return fishSpinningMethods;
  } else {
    return null;
  }
}

function getTimesValues(str) {
  const res = {};
  if (str) {
    const timesValues = str.match(/(?<=(time|value):\s).*/g);
    if (timesValues?.length) {
      for (const index in timesValues) {
        if (!(index % 2) && index !== '8') {
          res[timesValues[index]] = parseFloat(
            timesValues[parseInt(index) + 1],
          );
        }
      }
    }
  }
  return res;
}
