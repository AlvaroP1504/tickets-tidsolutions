<template>
  <v-expansion-panel>
    <v-expansion-panel-title class="ticket-header">
      <div class="header-content">
        <span class="ticket-title">{{ ticket.title }}</span>
        <PriorityBadge :priority="ticket.priority" />
      </div>
    </v-expansion-panel-title>

    <v-expansion-panel-text>
      <div class="ticket-details">
        <div class="detail-row">
          <span class="detail-label">Actualizado:</span>
          <span class="detail-value">{{ formattedDate }}</span>
        </div>
        <div class="detail-row description-row">
          <span class="detail-label">Descripción:</span>
          <p class="detail-value description-text">
            {{ ticket.description }}
          </p>
        </div>
      </div>
    </v-expansion-panel-text>
  </v-expansion-panel>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { Ticket } from '@/domain/entities/Ticket'
import { formatDateForDisplay } from '@/application/mappers/ticketMapper'
import PriorityBadge from './PriorityBadge.vue'

const props = defineProps<{
  ticket: Ticket
}>()

const formattedDate = computed(() => formatDateForDisplay(props.ticket.updatedAt))
</script>

<style scoped>
.ticket-header {
  min-height: 64px;
}

.header-content {
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  gap: 16px;
}

.ticket-title {
  flex: 1;
  font-weight: 500;
  font-size: 1rem;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.ticket-details {
  display: flex;
  flex-direction: column;
  gap: 16px;
  padding: 8px 0;
}

.detail-row {
  display: flex;
  gap: 8px;
}

.description-row {
  flex-direction: column;
  gap: 4px;
}

.detail-label {
  font-weight: 600;
  color: rgb(var(--v-theme-on-surface));
  opacity: 0.7;
  font-size: 0.875rem;
}

.detail-value {
  font-size: 0.875rem;
  color: rgb(var(--v-theme-on-surface));
}

.description-text {
  margin: 0;
  line-height: 1.5;
  white-space: pre-wrap;
}
</style>
