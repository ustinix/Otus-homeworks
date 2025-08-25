<script setup lang="ts">
import ProductsCard from '../components/ProductsCard.vue';
import ProductFilter from '../components/ProductFilter.vue';
import { computed, ref } from 'vue';
import type { Product } from '../types/product';

const props = defineProps<{
  products: Product[];
  displayedProducts: Product[];
}>();

const selectedCategory = ref<string | null>(null);

const categories = computed(() => {
  const uniqueCategories = new Set(props.products.map(p => p.category));
  return Array.from(uniqueCategories);
});
</script>

<template>
  <div class="main-page-container">
    <product-filter v-model:selected-category="selectedCategory" :categories="categories" />
    <ProductsCard :products="displayedProducts" :selected-category="selectedCategory" />
  </div>
</template>

<style scoped></style>
