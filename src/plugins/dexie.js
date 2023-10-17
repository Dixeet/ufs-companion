import Dexie from 'dexie';

const DEFAULT_CONFIG = { name: 'UFSCompanion', dixieConfig: {} };
const dataToFetch = [
  { file: 'baits', table: 'baits' },
  { file: 'fisheries', table: 'fisheries' },
  { file: 'fishes', table: 'fishes' },
];

export default {
  install: (app, config = DEFAULT_CONFIG) => {
    config = { ...DEFAULT_CONFIG, ...config };
    const db = new Dexie(config.name, config.dixieConfig);
    app.provide('database', { name: config.name, dataToFetch });
    initDb(db);
    onReady(db);
    migrate(db);
    db.open();
  },
};

function onReady(db) {
  db.on('ready', () => {
    return useFetchDbData(dataToFetch);
  });
}

function migrate(db) {
  db.version(1).stores({
    baits: 'id,name.en,name.fr',
    fisheries: 'id,name.en,name.fr',
    fishes: 'id,name.en,name.fr',
    baitsFishes: '++,baitId,fishId',
  });
  /*
  To refresh with new data,
  use code below and increment VERSION_NUMBER according to the previous one

  db.version(VERSION_NUMBER).upgrade(() => {
   return useDeleteDbData(dataToFetch);
  });

*/
}
