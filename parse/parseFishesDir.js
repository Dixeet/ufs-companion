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
  return findOne(/(?<=species:\s?)\S\d*/g, data);
}

function findName(data) {
  return findOne(/(?<=fishName:\s?)\S.*/g, data);
}

function findDescription(data) {
  return findOne(/(?<=fishDescription:\s?)\S.*/g, data);
}

function findWeights(data) {
  const weights = {
    weight: findOne(/(?<=Weight:\s?)\S\d*/g, data),
  };
  try {
    [weights.minWeight, weights.maxWeight] = findOne(
      /(?<=WeightMinMax:\s?)\S.*/g,
      data,
    ).match(/\d+/g);
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
  return data.match(/(?<=spinningMethodFactor:\s?\n( {2}- \d\n)*( {2}- ))\d*/g);
}

function getTimesValues(str) {
  const res = {};
  if (str) {
    const timesValues = str.match(/(?<=(time|value):\s).*/g);
    if (timesValues?.length) {
      for (const index in timesValues) {
        if (!(index % 2) && index !== '8') {
          res[timesValues[index]] = timesValues[parseInt(index) + 1];
        }
      }
    }
  }
  return res;
}
