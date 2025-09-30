<template>
  <v-container class="tickets-page">
    <v-row>
      <v-col cols="12">
        <h1 class="page-title">Tickets</h1>
      </v-col>
    </v-row>

    <v-row>
      <v-col cols="12" md="8" lg="6">
        <SearchBar v-model="ticketsStore.query" />
      </v-col>
    </v-row>

    <v-row>
      <v-col cols="12" md="10" lg="8">
        <!-- Loading state -->
        <div v-if="ticketsStore.loading" class="loading-container">
          <v-progress-circular indeterminate color="primary" />
          <p class="loading-text">Cargando tickets...</p>
        </div>

        <!-- Empty state when no results -->
        <v-alert
          v-else-if="ticketsStore.filtered.length === 0"
          type="info"
          variant="tonal"
          class="no-results-alert"
        >
          No hay coincidencias para "{{ ticketsStore.query }}"
        </v-alert>

        <!-- Tickets list -->
        <v-expansion-panels
          v-else
          v-model="openPanelIndex"
          variant="accordion"
          class="tickets-accordion"
        >
          <TicketItem
            v-for="ticket in ticketsStore.filtered"
            :key="ticket.id"
            :ticket="ticket"
          />
        </v-expansion-panels>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup lang="ts">
import { computed, onMounted, watch } from 'vue'
import { useTicketsStore } from '../stores/useTicketsStore'
import SearchBar from '../components/SearchBar.vue'
import TicketItem from '../components/TicketItem.vue'

const ticketsStore = useTicketsStore()

// El índice del panel abierto (basado en visibleOpenId)
const openPanelIndex = computed({
  get() {
    const openId = ticketsStore.visibleOpenId
    if (!openId) return undefined

    const index = ticketsStore.filtered.findIndex(t => t.id === openId)
    return index >= 0 ? index : undefined
  },
  set(index: number | undefined) {
    if (index !== undefined && index >= 0) {
      const ticket = ticketsStore.filtered[index]
      if (ticket) {
        ticketsStore.toggleOpen(ticket.id)
      }
    }
  }
})

// Cargar tickets al montar el componente
onMounted(() => {
  ticketsStore.load()
})

// Sincronizar cambios en query
watch(
  () => ticketsStore.query,
  () => {
    ticketsStore.ensureOpenWhenListChanges()
  }
)
</script>

<style scoped>
.tickets-page {
  max-width: 1200px;
  padding-top: 24px;
  padding-bottom: 48px;
}

.page-title {
  font-size: 2rem;
  font-weight: 600;
  color: rgb(var(--v-theme-on-surface));
  margin-bottom: 8px;
}

.loading-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 48px 0;
  gap: 16px;
}

.loading-text {
  margin: 0;
  color: rgb(var(--v-theme-on-surface));
  opacity: 0.7;
}

.no-results-alert {
  margin-top: 16px;
}

.tickets-accordion {
  margin-top: 16px;
}
</style>
