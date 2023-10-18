<template>
  <v-card class="fish-card">
    <template #title>
      <div class="text-secondary-variant">
        {{ title }}
      </div>
    </template>
    <div class="px-4">
      <v-divider
        class="border-opacity-50"
        color="primary-variant"
        thickness="1"
      />
      <div class="d-flex justify-space-between align-center my-2">
        <v-icon :color="getIconColor('cloud')" icon="$cloud" />
        <v-icon :color="getIconColor('wind')" icon="$wind" />
        <v-icon :color="getIconColor('rain')" icon="$rain" />
      </div>
    </div>
    <v-expansion-panels variant="accordion">
      <v-expansion-panel :title="baitsLabel" rounded="0" elevation="1">
        <template #text>
          <div>Test</div>
        </template>
      </v-expansion-panel>
      <v-expansion-panel :title="luresLabel" rounded="0" elevation="1">
        <template #text>
          <div>Test</div>
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

function getIconColor(condition) {
  if (props.fish[condition][0] > 0.5 && props.fish[condition][1] > 0.5) {
    return 'tertiary-variant-darken-1';
  } else if (
    props.fish[condition][0] > 0.5 &&
    props.fish[condition][1] <= 0.5
  ) {
    return 'secondary';
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
