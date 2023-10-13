import { readdir, copyFile, unlink } from 'node:fs/promises';
import { fileURLToPath, URL } from 'node:url';
import { resolve, basename } from 'node:path';

const extractPath = resolve(
  fileURLToPath(new URL('.', import.meta.url)),
  'extract/',
);

export async function copyExportedFiles(exportRootPath) {
  await cleanFiles();
  return copyFiles(exportRootPath);
}

export async function cleanFiles() {
  const excludedFiles = (file) =>
    file !== 'baits' && file !== 'fishes' && file !== '.gitkeep';
  const [extractFiles, baitsFiles, fishesFiles] = await Promise.all([
    readdir(extractPath),
    readdir(resolve(extractPath, 'baits/')),
    readdir(resolve(extractPath, 'fishes/')),
  ]);
  const files = [
    ...extractFiles
      .filter(excludedFiles)
      .map((file) => unlink(resolve(extractPath, file))),
    ...baitsFiles
      .filter(excludedFiles)
      .map((file) => unlink(resolve(extractPath, `baits/${file}`))),
    ...fishesFiles
      .filter(excludedFiles)
      .map((file) => unlink(resolve(extractPath, `fishes/${file}`))),
  ];
  return Promise.all(files);
}

async function getFishesAndBaitsFiles(exportRootPath) {
  const exportedFishesAndBaitsPath = 'ExportedProject/Assets/Prefab/';
  const baitsFiles = [];
  const fishesFiles = [];

  const baitRegex = /(?<=Bait_).*(?=\.prefab(?!\.meta))/g;
  const fishRegex = /(?<=Fish_).*(?=\.prefab(?!\.meta))/g;

  const exportedFilesNames = await readdir(
    resolve(exportRootPath, exportedFishesAndBaitsPath),
  );
  for (const fileName of exportedFilesNames) {
    const baitFound = baitRegex.exec(fileName);
    const fishFound = fishRegex.exec(fileName);

    if (baitFound) {
      baitsFiles.push({
        name: baitFound[0],
        path: resolve(exportRootPath, exportedFishesAndBaitsPath, fileName),
      });
    }

    if (fishFound) {
      fishesFiles.push({
        name: fishFound[0],
        path: resolve(exportRootPath, exportedFishesAndBaitsPath, fileName),
      });
    }
  }

  return {
    baitsFiles,
    fishesFiles,
  };
}

async function copyFiles(exportRootPath) {
  const mainMenuPath = resolve(
    exportRootPath,
    'ExportedProject/Assets/FishingGame/Scenes/MainMenu.unity',
  );
  const languagesPath = resolve(
    exportRootPath,
    'ExportedProject/Assets/Resources/I2Languages.prefab',
  );
  const fishesAndBaitsFiles = await getFishesAndBaitsFiles(exportRootPath);
  const copies = [
    copyFile(mainMenuPath, resolve(extractPath, basename(mainMenuPath))),
    copyFile(languagesPath, resolve(extractPath, basename(languagesPath))),
  ];
  for (const file of fishesAndBaitsFiles.baitsFiles) {
    copies.push(
      copyFile(file.path, resolve(extractPath, `baits/${file.name}.prefab`)),
    );
  }
  for (const file of fishesAndBaitsFiles.fishesFiles) {
    copies.push(
      copyFile(file.path, resolve(extractPath, `fishes/${file.name}.prefab`)),
    );
  }
  return Promise.all(copies);
}
