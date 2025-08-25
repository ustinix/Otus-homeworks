<script setup lang="ts">
import HeaderMain from './components/HeaderMain.vue';
import { useProducts } from './services/use-product';
import { onMounted, ref } from 'vue';
import type { Product } from './types/product';
import LoadingCircle from './components/LoadingCircle.vue';
import ErrorTemplate from './components/ErrorTemplate.vue';

const { products, getProducts, isLoading, error } = useProducts();
const displayedProducts = ref<Product[]>([]);

onMounted(async () => {
  await getProducts();
});

const handleSearchUpdate = (filteredProducts: Product[]) => {
  displayedProducts.value = filteredProducts;
};

const reloadProducts = async () => {
  await getProducts();
  displayedProducts.value = [];
};
</script>

<template>
  <v-app class="app-container">
    <LoadingCircle v-if="isLoading" />
    <ErrorTemplate v-else-if="error" :error="error" :event="reloadProducts" />
    <template v-else>
      <header-main :products="products" @search-update="handleSearchUpdate" />
      <main>
        <RouterView
          :displayed-products="displayedProducts.length ? displayedProducts : products"
          :products="products"
        />
      </main>
    </template>
  </v-app>
</template>

<style scoped>
.app-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  min-height: 100vh;
}
main {
  padding: 2rem;
}
</style>
