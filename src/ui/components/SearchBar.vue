<template>
  <v-text-field
    :model-value="modelValue"
    label="Buscar por título"
    placeholder="Escribe para filtrar tickets..."
    prepend-inner-icon="mdi-magnify"
    clearable
    variant="outlined"
    density="comfortable"
    hide-details
    @update:model-value="$emit('update:modelValue', $event || '')"
  />
</template>

<script setup lang="ts">
defineProps<{
  modelValue: string
}>()

defineEmits<{
  'update:modelValue': [value: string]
}>()
</script>
