<script setup lang="ts">
import HeaderMain from './components/HeaderMain.vue';
import { useProductsStore } from './stores/products';
import { onMounted, ref } from 'vue';
import type { Product } from './types/product';
import LoadingCircle from './components/LoadingCircle.vue';
import ErrorTemplate from './components/ErrorTemplate.vue';
import { storeToRefs } from 'pinia';
import { checkAndInitializeAPI } from './utils/api-init';

const productsStore = useProductsStore();
const { products, isLoading, error } = storeToRefs(productsStore);
const { getProducts } = productsStore;

const displayedProducts = ref<Product[]>([]);
const apiInitialized = ref(false);
const apiError = ref<string | null>(null);

onMounted(async () => {
  try {
    const success = await checkAndInitializeAPI();

    if (success) {
      apiInitialized.value = true;
    } else {
      apiError.value = 'Не удалось инициализировать API';
      console.error('Ошибка инициализации API');
    }
  } catch (error) {
    apiError.value = 'Критическая ошибка инициализации API';
    console.error('Критическая ошибка инициализации API:', error);
  } finally {
    if (apiInitialized.value) {
      await getProducts();
    }
  }
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
    <loading-circle v-if="isLoading" />
    <error-template v-else-if="error" :error="error" :event="reloadProducts" />
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
