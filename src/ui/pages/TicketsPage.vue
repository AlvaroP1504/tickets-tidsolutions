<template>
  <v-container class="tickets-page">
    <v-row>
      <v-col cols="12">
        <h1 class="page-title">Tickets</h1>
      </v-col>
    </v-row>

    <v-row align="center">
      <v-col cols="12" md="6" lg="5">
        <SearchBar v-model="ticketsStore.query" />
      </v-col>
      
      <v-col cols="12" md="6" lg="4">
        <div class="controls-wrapper">
          <v-btn-toggle
            :model-value="ticketsStore.mode"
            mandatory
            color="primary"
            variant="outlined"
            divided
            density="comfortable"
            @update:model-value="ticketsStore.setMode($event)"
          >
            <v-btn value="single">
              <v-icon start>mdi-numeric-1-box</v-icon>
              Single
            </v-btn>
            <v-btn value="multiple">
              <v-icon start>mdi-format-list-checkbox</v-icon>
              Multiple
            </v-btn>
          </v-btn-toggle>

          <v-btn
            v-if="ticketsStore.mode === 'multiple' && ticketsStore.visibleOpenIds.length > 0"
            color="error"
            variant="tonal"
            density="comfortable"
            @click="ticketsStore.closeAllVisible()"
          >
            <v-icon start>mdi-close-box-multiple</v-icon>
            Cerrar todos
          </v-btn>
        </div>
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
          v-model="openPanelIndices"
          :multiple="ticketsStore.mode === 'multiple'"
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

// Índices de los paneles abiertos (sincronizado con Vuetify)
const openPanelIndices = computed({
  get() {
    const indices = ticketsStore.openPanelIndices
    
    // Vuetify espera:
    // - number | undefined en modo single
    // - number[] | undefined en modo multiple
    if (ticketsStore.mode === 'single') {
      return indices.length > 0 ? indices[0] : undefined
    } else {
      return indices
    }
  },
  set(value: number | number[] | undefined) {
    ticketsStore.setOpenIndices(value)
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

.controls-wrapper {
  display: flex;
  gap: 12px;
  align-items: center;
  flex-wrap: wrap;
}

@media (max-width: 960px) {
  .controls-wrapper {
    justify-content: flex-start;
  }
}
</style>
