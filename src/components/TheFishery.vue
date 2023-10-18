<template>
  <div class="content">
    <h1 class="text-h4 no-content">{{ title }}</h1>
    <v-divider
      class="border-opacity-50"
      color="primary-variant"
      thickness="1"
    />
    <div>
      <v-card
        v-if="appFishery.description"
        color="surface-variant"
        :text="description"
      ></v-card>
    </div>
    <div class="v-row">
      <div
        v-for="(fish, index) in fishes"
        :key="index"
        class="v-col-12 v-col-sm-6 v-col-md-4 v-col-xl-3"
      >
        <FishCard class="" :fish="fish"></FishCard>
      </div>
    </div>
  </div>
</template>

<script setup>
const lang = useState('appLanguage');
const appFishery = useState('appFishery');
const db = useDb();

const fishes = shallowRef([]);
const title = useTranslation(appFishery.value.name);
const description = useTranslation(appFishery.value.description);

watchEffect(async () => {
  if (appFishery.value?.species) {
    const dbFishes = await db.fishes
      .where('id')
      .anyOf(appFishery.value.species)
      .sortBy(`name.${lang.value}`);

    for (const fish of dbFishes) {
      fish.baits = appFishery.value?.baits
        ? appFishery.value.baits.filter((bait) =>
            bait.species.includes(fish.id),
          )
        : [];
      fish.lures = appFishery.value?.lures
        ? appFishery.value.lures.filter((lure) =>
            lure.species.includes(fish.id),
          )
        : [];
    }
    fishes.value = dbFishes;
  }
});
</script>

<style></style>
