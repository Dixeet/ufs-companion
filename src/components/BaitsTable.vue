<template>
  <div>
    <v-table density="compact">
      <thead>
        <tr>
          <th class="text-left">
            <div class="d-inline-flex align-center">
              {{ nameLabel }}
              <v-btn
                v-if="sortable"
                variant="text"
                :color="
                  sortedBy === 'name' ? 'primary-variant' : 'surface-lighten-1'
                "
                icon="$arrowDown"
                density="comfortable"
                size="small"
                @click.stop="sortBy('name')"
              ></v-btn>
            </div>
          </th>
          <th class="text-center">
            <div class="d-inline-flex align-center">
              {{ countLabel }}
              <v-btn
                v-if="sortable"
                variant="text"
                :color="
                  sortedBy === 'count' ? 'primary-variant' : 'surface-lighten-1'
                "
                icon="$arrowDown"
                density="comfortable"
                size="small"
                @click.stop="sortBy('count')"
              ></v-btn>
            </div>
          </th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="bait in baits" :key="bait.id">
          <td>
            {{ bait.name }}
            <br />
            <v-chip class="mb-1" density="comfortable" size="small">
              {{ bait.baitTypeName }}
            </v-chip>
          </td>
          <td class="text-center">{{ bait.count }}</td>
        </tr>
      </tbody>
    </v-table>
    <v-pagination
      v-if="paginator"
      v-model="page"
      density="compact"
      :length="pageCount"
      rounded="0"
    ></v-pagination>
  </div>
</template>

<script setup>
const props = defineProps({
  baits: {
    type: Array,
    required: true,
  },
  max: {
    type: [Number, String],
    default: 5,
  },
  paginator: {
    type: Boolean,
    default: false,
  },
  sortable: {
    type: Boolean,
    default: false,
  },
});

const nameLabel = useTranslation('nameLabel');
const countLabel = useTranslation('countLabel');

const baitsList = ref([]);

const totalBaits = computed(() => baitsList.value.length);
const page = shallowRef(1);
const pageCount = computed(() => Math.ceil(totalBaits.value / props.max));
const baits = computed(() =>
  baitsList.value.slice(props.max * (page.value - 1), props.max * page.value),
);

const sortedBy = shallowRef('count');

watchEffect(() => {
  baitsList.value = props.baits
    .map(({ baitTypeName, name, count, id }) => {
      return {
        baitTypeName: useTranslation(baitTypeName),
        name: useTranslation(name).value.replace('"', ''),
        count,
        id,
      };
    })
    .toSorted(sortedByCountFn);
});

function sortedByCountFn(a, b) {
  const res = b.count - a.count;
  if (res) {
    return res;
  }
  return a.name.localeCompare(b.name);
}

function sortBy(by) {
  if (by === 'name') {
    baitsList.value.sort((a, b) => a.name.localeCompare(b.name));
  } else {
    baitsList.value.sort(sortedByCountFn);
  }
  sortedBy.value = by;
}
</script>

<style></style>
