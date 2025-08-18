<script setup lang="ts">
import { computed, ref } from 'vue';
import type { Product } from '../types/product';
import ProductFilter from './ProductFilter.vue';
import DialogWindow from './DialogWindow.vue';
import AppButton from './AppButton.vue';
import { productService } from '../services/product-service';

const { products, getProducts } = productService();

getProducts();

const selectedCategory = ref<string | null>(null);
const dialog = ref(false);
const selectedProduct = ref<Product | null>(null);

const categories = computed(() => {
  const uniqueCategories = new Set(products.value.map(p => p.category));
  return Array.from(uniqueCategories);
});

const filteredProducts = computed(() => {
  if (!selectedCategory.value) return products.value;
  return products.value.filter(product => product.category === selectedCategory.value);
});

const showDetails = (product: Product) => {
  selectedProduct.value = product;
  dialog.value = true;
};
</script>
<template>
  <v-container class="py-6">
    <product-filter v-model:selected-category="selectedCategory" :categories="categories" />
    <v-row dense>
      <v-col v-for="product in filteredProducts" :key="product.id" cols="12" sm="6" md="4" lg="3">
        <v-card class="h-100 d-flex flex-column" elevation="2">
          <v-img
            :src="product.image"
            :alt="product.title"
            height="200"
            cover
            class="align-end"
            gradient="to bottom, rgba(0,0,0,.1), rgba(0,0,0,.5)"
          >
            <v-card-title class="text-white text-wrap">{{ product.title }}</v-card-title>
          </v-img>

          <v-card-text class="flex-grow-1">
            <div class="text-subtitle-1 mb-2">${{ product.price }}</div>
            <div class="text-caption text-grey mb-2">{{ product.category }}</div>
            <div class="d-flex align-center justify-center">
              <v-rating
                :model-value="product.rating.rate"
                color="amber"
                density="compact"
                size="small"
                half-increments
                readonly
              ></v-rating>
              <span class="text-caption text-grey ms-2"> ({{ product.rating.count }}) </span>
            </div>
          </v-card-text>

          <v-card-actions class="flex-grow-0">
            <app-button color="primary" variant="tonal" @click="showDetails(product)">
              Подробнее
            </app-button>
          </v-card-actions>
        </v-card>
      </v-col>
    </v-row>
    <dialog-window v-model="dialog" :selected-product="selectedProduct" />
  </v-container>
</template>
<style lang="scss" scoped>
.v-card {
  transition: transform 0.3s ease;
  overflow: hidden;
}

.v-card:hover {
  transform: translateY(-5px);
}

.h-100 {
  height: 100%;
}
</style>
