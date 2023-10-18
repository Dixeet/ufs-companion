<template>
  <v-layout>
    <v-navigation-drawer>
      <TheFisherySelector />

      <template #append>
        <div class="d-flex justify-space-between align-center">
          <v-btn
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

    <v-container>
      <v-main>
        <slot></slot>
      </v-main>
    </v-container>
  </v-layout>
</template>

<script setup>
const database = inject('database');

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

<style></style>
