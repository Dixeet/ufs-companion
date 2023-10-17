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
const appFishery = useState('appFishery');
const appLanguage = useState('appLanguage');
const { state: fisheries } = useQueryDb((db) => db.fisheries.toArray(), []);

const itemTitle = computed(() => `name.${appLanguage.value}`);
</script>

<style></style>
