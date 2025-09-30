<template>
  <v-app>
    <v-app-bar color="primary" prominent>
      <v-app-bar-title class="app-title">
        <v-icon icon="mdi-ticket-confirmation" class="title-icon" />
        Sistema de Tickets
      </v-app-bar-title>
    </v-app-bar>

    <v-main>
      <TicketsPage />
    </v-main>
  </v-app>
</template>

<script setup lang="ts">
import TicketsPage from './ui/pages/TicketsPage.vue'
</script>

<style>
* {
  box-sizing: border-box;
}

.app-title {
  display: flex;
  align-items: center;
  gap: 12px;
  font-weight: 600;
}

.title-icon {
  font-size: 1.75rem;
}
</style>
