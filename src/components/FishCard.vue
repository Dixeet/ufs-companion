<template>
  <v-card class="fish-card">
    <template #title>
      <div class="text-secondary-variant">
        {{ title }}
      </div>
    </template>
    <template #subtitle>
      <div class="text-body-4">
        {{ subtitle }}
      </div>
    </template>
    <div class="px-4 mt-n2">
      <v-divider
        class="border-opacity-50 mb-2"
        color="primary-variant"
        thickness="1"
      />
      <div class="d-flex justify-space-between align-center mb-2 px-2">
        <v-icon :color="getIconColor('cloud')" icon="$cloud" />
        <v-icon :color="getIconColor('wind')" icon="$wind" />
        <v-icon :color="getIconColor('rain')" icon="$rain" />
      </div>
      <TimeHeatMap class="mb-4" :time="fish.time"></TimeHeatMap>
      <div
        class="d-flex justify-space-between flex-wrap mb-2"
        style="gap: 0 5px"
      >
        <div
          v-for="(spin, index) in spinningMethods"
          :key="`spin-${index}`"
          class="text-body-4"
          :class="{
            'text-secondary-variant-darken-1': index % 2,
            'text-secondary-variant': !(index % 2),
          }"
        >
          {{ spin }}
        </div>
      </div>
    </div>
    <v-expansion-panels variant="accordion">
      <v-expansion-panel
        :disabled="!fish.baits?.length"
        :title="baitsLabel"
        rounded="0"
        elevation="1"
      >
        <template #text>
          <BaitsTable :baits="fish.baits" paginator sortable></BaitsTable>
        </template>
      </v-expansion-panel>
      <v-expansion-panel
        :disabled="!fish.lures?.length"
        :title="luresLabel"
        rounded="0"
        elevation="1"
      >
        <template #text>
          <BaitsTable :baits="fish.lures" paginator sortable></BaitsTable>
        </template>
      </v-expansion-panel>
      <v-expansion-panel
        :title="descriptionLabel"
        :text="description"
        rounded="0"
        elevation="1"
      >
      </v-expansion-panel>
    </v-expansion-panels>
  </v-card>
</template>

<script setup>
const props = defineProps({
  fish: {
    type: Object,
    required: true,
  },
});

const title = useTranslation(props.fish.name);
const description = useTranslation(props.fish.description);
const descriptionLabel = useTranslation('descriptionLabel');
const baitsLabel = useTranslation('baitsLabel');
const luresLabel = useTranslation('luresLabel');
const subtitle = computed(
  () => `${props.fish.minWeight}kg - ${props.fish.maxWeight}kg`,
);

const spinningMethods = computed(() => {
  return (
    props.fish.spinningMethods &&
    props.fish.spinningMethods.map((spin) => useTranslation(spin).value)
  );
});

function getIconColor(condition) {
  if (props.fish[condition][0] > 0.5 && props.fish[condition][1] > 0.5) {
    return 'light-green-darken-2';
  } else if (
    props.fish[condition][0] > 0.5 &&
    props.fish[condition][1] <= 0.5
  ) {
    return 'surface-lighten-1';
  } else {
    return 'secondary';
  }
}
</script>

<style lang="scss">
.fish-card {
  .v-expansion-panel--active > .v-expansion-panel-title {
    min-height: 48px;
  }
}
</style>
