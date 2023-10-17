<template>
  <v-layout>
    <v-navigation-drawer>
      <v-list>
        <v-list-item title="Navigation drawer"></v-list-item>
      </v-list>
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

<script setup></script>

<style></style>
