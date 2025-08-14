<template>
  <v-row class="mb-6">
    <v-col cols="12">
      <v-select
        v-model="selectedCategory"
        :items="categories"
        label="Фильтр по категориям"
        clearable
        variant="outlined"
        density="comfortable"
        @update:model-value="$emit('update:selected-category', $event)"
      ></v-select>
    </v-col>
  </v-row>
</template>

<script setup lang="ts">
import { computed } from 'vue';

interface FilterProps {
  selectedCategory: string | null;
  categories: string[];
}

const props = defineProps<FilterProps>();
const emit = defineEmits(['update:selected-category']);
const selectedCategory = computed({
  get: () => props.selectedCategory,
  set: value => emit('update:selected-category', value),
});
</script>

<style scoped></style>
