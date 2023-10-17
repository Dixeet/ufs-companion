<template>
  <v-select
    v-model="appLanguage"
    :items="languages"
    :menu-icon="null"
    class="c-lang-selector"
    rounded="0"
    color="primary-variant"
    variant="solo"
    base-color="primary-variant"
    density="compact"
    center-affix
    hide-details
  >
    <template #append-inner>
      <v-icon
        class="my-auto"
        color="primary-variant"
        size="small"
        icon="$web"
      ></v-icon>
    </template>
  </v-select>
</template>

<script setup>
const languages = ['en', 'fr'];
const appLanguage = useState('appLanguage');
</script>

<style lang="scss">
.c-lang-selector {
  .v-field.v-field--variant-solo {
    box-shadow: none;
  }
}
</style>
