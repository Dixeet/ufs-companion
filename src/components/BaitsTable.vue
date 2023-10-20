<template>
  <div>
    <v-table density="compact">
      <thead>
        <tr>
          <th class="text-left">
            <div class="d-inline-flex align-center">
              <v-btn
                v-if="sortable"
                class="mr-1"
                variant="text"
                :color="
                  sortedBy === 'name' ? 'primary-variant' : 'surface-lighten-1'
                "
                icon="$sort"
                density="comfortable"
                size="small"
                @click.stop="sortBy('name')"
              ></v-btn>
              {{ nameLabel }}
            </div>
          </th>
          <th class="text-center">
            <div class="d-inline-flex align-center">
              <v-btn
                v-if="sortable"
                class="mr-1"
                variant="text"
                :color="
                  sortedBy === 'count' ? 'primary-variant' : 'surface-lighten-1'
                "
                icon="$sort"
                density="comfortable"
                size="small"
                @click.stop="sortBy('count')"
              ></v-btn>
              {{ countLabel }}
            </div>
          </th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="bait in baits" :key="bait.id">
          <td>
            <div class="text-body-1">
              {{ bait.name }}
            </div>
            <div class="text-body-4 text-disabled mt-n1 mb-1">
              {{ bait.baitTypeName }}
            </div>
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

let order = 1;
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
    return res * order;
  }
  return a.name.localeCompare(b.name) * order;
}

function sortBy(by) {
  if (sortedBy.value === by) {
    order = order * -1;
  } else {
    order = 1;
  }
  if (by === 'name') {
    baitsList.value.sort((a, b) => a.name.localeCompare(b.name) * order);
  } else {
    baitsList.value.sort(sortedByCountFn);
  }
  sortedBy.value = by;
}
</script>

<style></style>
