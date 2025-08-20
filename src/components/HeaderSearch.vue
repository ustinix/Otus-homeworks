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
  <v-app-bar color="primary" prominent class="d-flex px-4">
    <v-container class="d-flex align-center pa-0 px-6">
      <v-toolbar-title class="custom-title">Магазин товаров</v-toolbar-title>

      <v-spacer></v-spacer>

      <v-text-field
        v-model="searchQuery"
        density="compact"
        placeholder="Поиск по названию или цене"
        prepend-inner-icon="mdi-magnify"
        variant="outlined"
        hide-details
        class="search-field mx-2"
        single-line
      ></v-text-field>
    </v-container>
  </v-app-bar>
</template>

<style scoped>
.custom-title {
  flex: none !important;
}
.search-field {
  width: 100%;
  max-width: 500px;
}
</style>
