<template>
  <v-chip
    :color="color"
    size="small"
    variant="flat"
    class="priority-badge"
  >
    {{ label }}
  </v-chip>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { Priority, PriorityLabel, PriorityColor } from '@/domain/value-objects/Priority'

const props = defineProps<{
  priority: Priority
}>()

const label = computed(() => PriorityLabel[props.priority])
const color = computed(() => PriorityColor[props.priority])
</script>

<style scoped>
.priority-badge {
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}
</style>
