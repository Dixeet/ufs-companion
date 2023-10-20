let db;

export function initDb(database) {
  db = database;
}

export function useDb() {
  return db;
}

export function useQueryDb(queryFn, initialState) {
  return useAsyncState(queryFn(db), initialState);
}

export function useFetchDbData(dataToFetch, database = db) {
  if (!database.isOpen()) {
    db.open();
  }
  const promises = [];
  dataToFetch.forEach(({ file, table }) => {
    promises.push(
      database[table].count((count) => {
        if (!count) {
          // eslint-disable-next-line no-console
          console.log(`Fetching ${file}...`);
          return useFetch(`${import.meta.env.BASE_URL}data/${file}.json`).then(
            async ({ data: res }) => {
              const data = JSON.parse(res.value);
              if (table === 'baits') {
                let entries = [];
                data.forEach((bait) => {
                  entries = [
                    ...entries,
                    ...bait.species.map((fishId) => ({
                      baitId: bait.id,
                      fishId,
                    })),
                  ];
                });
                await database.baitsFishes.bulkAdd(entries);
              }
              return database[table].bulkAdd(data).catch((e) => {
                // eslint-disable-next-line no-console
                console.error(e);
                if (e.failuresByPos?.length) {
                  e.failuresByPos.forEach((str, index) => {
                    if (str) {
                      // eslint-disable-next-line no-console
                      console.warn(data[index]);
                    }
                  });
                }
              });
            },
          );
        }
      }),
    );
  });
  return Promise.all(promises);
}

export function useDeleteDbData(dataToFetch, tx = db) {
  if (db.isOpen()) {
    const promises = [];
    dataToFetch.forEach(({ table }) => {
      promises.push(tx.table(table).toCollection().delete());
    });
    return Promise.all(promises);
  }
  localStorage.clear();
  return Promise.resolve();
}
