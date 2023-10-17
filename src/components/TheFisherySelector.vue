<template>
  <v-autocomplete
    v-model="appFishery"
    color="primary-variant"
    base-color="primary-variant"
    :items="fisheries"
    :item-title="itemTitle"
    return-object
  ></v-autocomplete>
</template>

<script setup>
const appFishery = useStorage(
  'appFishery',
  {
    name: {
      en: 'Choose a fishery',
      fr: 'Choisir une pêcherie',
    },
  },
  undefined,
  { shallow: true },
);
const appLanguage = useStorage('appLanguage', 'en');
const { state: fisheries } = useQueryDb((db) => db.fisheries.toArray(), []);

const itemTitle = computed(() => `name.${appLanguage.value}`);
</script>

<style></style>
