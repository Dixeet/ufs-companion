<template>
  <v-layout>
    <v-navigation-drawer>
      <v-list>
        <v-list-item title="Navigation drawer"></v-list-item>
      </v-list>

      <template #append>
        <v-btn rounded="0" color="secondary" @click="deleteDatabase"
          >Delete Db</v-btn
        >
      </template>
    </v-navigation-drawer>

    <v-container>
      <v-main>
        <Transition>
          <slot></slot>
        </Transition>
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