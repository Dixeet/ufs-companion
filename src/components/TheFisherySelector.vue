<template>
  <v-autocomplete
    :model-value="appFishery"
    :item-title="itemTitle"
    :items="fisheries"
    base-color="primary-variant"
    color="primary-variant"
    hide-details
    return-object
    @update:model-value="update"
  ></v-autocomplete>
</template>

<script setup>
const appFishery = useState('appFishery');
const lang = useState('appLanguage');
const { state: fisheries } = useQueryDb((db) => db.fisheries.toArray(), []);
const db = useDb();
const transitionKey = useState('transitionKey');

const itemTitle = computed(() => `name.${lang.value}`);

async function update(fishery) {
  fishery = structuredClone(toRaw(fishery));
  const baitsFishes = await db.baitsFishes
    .where('fishId')
    .anyOf(fishery.species)
    .toArray();
  const lBaits = {};
  for (const baitFish of baitsFishes) {
    if (lBaits[baitFish.baitId] !== undefined) {
      lBaits[baitFish.baitId]++;
    } else {
      lBaits[baitFish.baitId] = 1;
    }
  }
  const dbBaits = await db.baits
    .where('id')
    .anyOf(Object.keys(lBaits).map((b) => parseInt(b)))
    .sortBy(`name.${lang.value}`);
  fishery.baits = [];
  fishery.lures = [];
  for (const id in lBaits) {
    const index = dbBaits.findIndex((bait) => bait.id == id);
    if (index > -1) {
      if (dbBaits[index].baitType === 'EQUIPMENT/BAITS') {
        fishery.baits.push({ ...dbBaits[index], count: lBaits[id] });
      } else if (dbBaits[index].baitType) {
        fishery.lures.push({ ...dbBaits[index], count: lBaits[id] });
      }
    }
  }
  appFishery.value = fishery;
  transitionKey.value = Date.now();
}
</script>

<style lang="scss">
.v-overlay-container {
  .v-overlay__content.v-autocomplete__content {
    .v-list-item.v-list-item--active {
      .v-autocomplete__mask {
        background: rgb(var(--v-theme-secondary));
      }
    }
  }
}
</style>
