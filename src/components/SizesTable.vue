<template>
  <v-table density="compact" hover>
    <thead>
      <tr>
        <th class="text-left">{{ sizeLabel }}</th>
        <th class="text-center">Min</th>
        <th class="text-right">Max</th>
      </tr>
    </thead>
    <tbody>
      <tr v-for="weight in weights" :key="weight.size">
        <td class="text-body-2">
          {{ weight.size }}
        </td>
        <td class="text-center text-body-2">{{ weight.min }}kg</td>
        <td class="text-right text-body-2">{{ weight.max }}kg</td>
      </tr>
    </tbody>
  </v-table>
</template>

<script setup>
const props = defineProps({
  type: {
    type: String,
    required: true,
  },
});

const sizeLabel = useTranslation('sizeLabel');

const weights = shallowRef([]);
const db = useDb();

db.toFishWeight.get(props.type).then((res) => {
  if (res?.sizes?.length) {
    weights.value = res.sizes;
  }
});
</script>

<style></style>
