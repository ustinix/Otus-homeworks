<script setup lang="ts">
import { ref, computed, watch } from 'vue';
import type { Product } from '../types/product';

const props = defineProps<{
  products: Product[];
}>();

const emit = defineEmits<{
  (e: 'update:filtered', value: Product[]): void;
}>();

const searchQuery = ref('');

const filteredProducts = computed(() => {
  if (!searchQuery.value) return props.products;

  const query = searchQuery.value.toLowerCase();
  return props.products.filter(
    product =>
      product.title?.toLowerCase().includes(query) || product.price.toString().includes(query),
  );
});

watch(filteredProducts, newVal => {
  emit('update:filtered', newVal);
});
</script>

<template>
  <v-container class="search-container">
    <v-text-field
      v-model="searchQuery"
      placeholder="Поиск по названию или цене"
      prepend-inner-icon="mdi-magnify"
      variant="outlined"
      hide-details
      class="search-field"
      density="comfortable"
      single-line
    ></v-text-field>
  </v-container>
</template>

<style scoped>
.search-container {
  width: 310px;
  min-width: 310px;
  display: flex;
  align-items: center;
  padding: 0;
}
</style>
