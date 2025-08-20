<script setup lang="ts">
import type { FilterProps } from '../types/filterProps';

defineProps<FilterProps>();
const emit = defineEmits<{
  (e: 'update:selected-category', value: string | null): void;
}>();
</script>
<template>
  <v-row>
    <v-col cols="12">
      <v-select
        :model-value="selectedCategory"
        :items="categories"
        label="Фильтр по категориям"
        clearable
        variant="outlined"
        density="comfortable"
        @update:model-value="emit('update:selected-category', $event)"
      ></v-select>
    </v-col>
  </v-row>
</template>

<style scoped></style>
