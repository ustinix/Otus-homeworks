<script setup lang="ts">
defineProps<{
  selectedCategory: string | null;
  categories: string[];
}>();

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
        class="filter-field"
        @update:model-value="emit('update:selected-category', $event)"
      ></v-select>
    </v-col>
  </v-row>
</template>

<style scoped>
.filter-field {
  max-width: 24%;
}
</style>
