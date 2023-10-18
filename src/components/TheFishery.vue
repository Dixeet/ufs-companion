<template>
  <div class="content">
    <h1 class="text-h4 no-content">{{ appFishery.name[lang] }}</h1>
    <v-divider
      class="border-opacity-50"
      color="primary-variant"
      thickness="1"
    />
    <div>
      <v-card
        v-if="appFishery.description"
        color="surface-variant"
        :text="appFishery.description[lang]"
      ></v-card>
    </div>
    <div class="v-row">
      <div
        v-for="(fish, index) in fishes"
        :key="index"
        class="v-col-12 v-col-sm-4 v-col-md-3 v-col-xl-2"
      >
        <div>
          {{ fish.name[lang] }}
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
const lang = useState('appLanguage');
const appFishery = useState('appFishery');
const db = useDb();

const fishes = shallowRef([]);

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
