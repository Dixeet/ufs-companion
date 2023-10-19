<template>
  <v-layout>
    <v-navigation-drawer v-model="drawer" width="275">
      <TheFisherySelector />
      <div class="c-tabs">
        <v-tabs
          v-model="tab"
          bg-color="primary"
          density="compact"
          direction="horizontal"
          align-tabs="start"
          show-arrows
        >
          <v-tab value="1" class="text-body-2">Tops</v-tab>
          <v-tab value="2" class="text-body-2">{{ hookSizeLabel }}</v-tab>
          <v-tab value="3" class="text-body-2">{{ lureSizeLabel }}</v-tab>
          <v-tab value="4" class="text-body-2">{{ flySizeLabel }}</v-tab>
        </v-tabs>

        <v-window v-model="tab">
          <v-window-item value="1">
            <Transition name="fade" mode="out-in">
              <div :key="transitionKey">
                <div v-if="appFishery?.baits?.length">
                  <div
                    class="text-subtitle-1 text-primary-variant-lighten-1 px-4 mt-2"
                  >
                    {{ topBaits }}
                  </div>
                  <BaitsTable :baits="appFishery.baits" max="4"></BaitsTable>
                </div>
                <div v-if="appFishery?.lures?.length">
                  <v-divider
                    class="border-opacity-50 my-2"
                    color="primary-variant"
                    thickness="1"
                  />
                  <div
                    class="text-subtitle-1 text-primary-variant-lighten-1 px-4 mt-2"
                  >
                    {{ topLures }}
                  </div>
                  <BaitsTable :baits="appFishery.lures" max="4"></BaitsTable>
                </div>
              </div>
            </Transition>
          </v-window-item>

          <v-window-item value="2">
            <SizesTable type="hookToFishWeight"></SizesTable>
          </v-window-item>

          <v-window-item value="3">
            <SizesTable type="lureToFishWeight"></SizesTable>
          </v-window-item>
          <v-window-item value="4">
            <SizesTable type="flyToFishWeight"></SizesTable>
          </v-window-item>
        </v-window>
      </div>

      <template #append>
        <div class="d-flex justify-space-between align-center">
          <v-btn
            v-if="isDev"
            variant="plain"
            icon="$dbOff"
            color="primary-variant"
            @click="deleteDatabase"
          ></v-btn>
          <v-spacer />
          <div>
            <TheLanguageSelector />
          </div>
        </div>
      </template>
    </v-navigation-drawer>
    <v-btn
      alt="Open Drawer"
      class="d-lg-none drawer__toggle"
      :class="{
        'drawer__toggle--open': !drawer,
        'drawer__toggle--close': drawer,
      }"
      color="primary-variant"
      density="compact"
      variant="tonal"
      rounded="0"
      icon
      @click.stop="drawer = !drawer"
    >
      <v-icon :icon="drawer ? '$menuLeft' : '$menuRight'" />
    </v-btn>

    <v-container>
      <v-main>
        <Transition name="fade" mode="out-in">
          <slot :key="transitionKey"></slot>
        </Transition>
      </v-main>
    </v-container>
  </v-layout>
</template>

<script setup>
import SizesTable from '~/components/SizesTable.vue';

const isDev = shallowRef(import.meta.env.MODE === 'development');

const appFishery = useState('appFishery');
const transitionKey = useState('transitionKey');

const topBaits = useTranslation('topBaits');
const topLures = useTranslation('topLures');
const hookSizeLabel = useTranslation('hookSizeLabel');
const lureSizeLabel = useTranslation('lureSizeLabel');
const flySizeLabel = useTranslation('flySizeLabel');
const tab = ref(null);

const database = inject('database');
const drawer = shallowRef(undefined);

function deleteDatabase() {
  if (database?.name) {
    const deleteDbReq = window.indexedDB.deleteDatabase(database?.name);
    deleteDbReq.onsuccess = () => {
      // eslint-disable-next-line no-console
      console.log(`Database ${database?.name} deleted successfully`);
      localStorage.clear();
    };
    deleteDbReq.onerror = () => {
      // eslint-disable-next-line no-console
      console.error(`Error deleting database ${database?.name}.`);
    };
  }
}
</script>

<style lang="scss">
.drawer__toggle {
  position: fixed !important;
  top: 50%;
  z-index: 1004;
  width: 12px !important;
  &--open {
    left: 0;
  }
  &--close {
    left: 276px;
  }
}
.v-layout .v-navigation-drawer__scrim {
  position: fixed;
}
.c-tabs {
  .v-tab.v-tab {
    min-width: unset;
  }
  .v-slide-group__next,
  .v-slide-group__prev {
    min-width: 32px;
  }
}
</style>
