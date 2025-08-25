<script setup lang="ts">
import { computed } from 'vue';
import type { Product } from '../types/product';
import AppButton from './AppButton.vue';
import { useCartStore } from '../stores/cart';
import { useRouter } from 'vue-router';

const cartStore = useCartStore();
const router = useRouter();

const props = defineProps<{
  products: Product[];
  selectedCategory?: string | null;
}>();

const filteredProducts = computed(() => {
  if (!props.selectedCategory) return props.products;
  return props.products.filter(product => product.category === props.selectedCategory);
});

const goToProductPage = (productId: number) => {
  router.push({ name: 'product', params: { id: productId } });
};

const addToCart = (product: Product) => {
  cartStore.addToCart(product);
};
</script>
<template>
  <v-container class="products-container">
    <v-row class="products-row">
      <v-col
        v-for="product in filteredProducts"
        :key="product.id"
        cols="12"
        sm="6"
        md="4"
        lg="3"
        class="product-col"
      >
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

          <v-card-actions class="card-actions">
            <app-button color="primary" variant="tonal" @click="goToProductPage(product.id)">
              Подробнее
            </app-button>
            <app-button color="primary" variant="tonal" @click="addToCart(product)">
              В корзину
            </app-button>
          </v-card-actions>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>
<style lang="scss" scoped>
.v-container {
  padding: 0 !important;
}
.v-card {
  transition: transform 0.3s ease;
  overflow: hidden;
}
.card-actions {
  justify-content: space-around;
}
.v-card:hover {
  transform: translateY(-5px);
}

.h-100 {
  height: 100%;
}
</style>
