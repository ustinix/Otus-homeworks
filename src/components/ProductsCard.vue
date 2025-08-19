<script setup lang="ts">
import { computed, onMounted, ref } from 'vue';
import type { Product } from '../types/product';
import type { OrderFormType } from '../types/order';
import ProductFilter from './ProductFilter.vue';
import DialogWindow from './DialogWindow.vue';
import AppButton from './AppButton.vue';
import { productService } from '../services/product-service';
import HeaderSearch from './HeaderSearch.vue';
import LoadingCircle from './LoadingCircle.vue';
import ErrorTemplate from './ErrorTemplate.vue';
import ProductForm from './ProductForm.vue';
import OrderForm from './OrderForm.vue';

const { products, getProducts, isLoading, error } = productService();

const loadProducts = async () => {
  try {
    await getProducts();
    selectedCategory.value = null;
    displayedProducts.value = [];
  } catch (err) {
    error.value = err as Error;
  }
};

onMounted(loadProducts);

const selectedCategory = ref<string | null>(null);
const dialog = ref(false);
const selectedProduct = ref<Product | null>(null);
const displayedProducts = ref<Product[]>([]);
const showProductForm = ref(false);
const showOrderForm = ref(false);
const notification = ref({
  show: false,
  message: '',
  type: 'success' as 'success' | 'error' | 'info',
});

const categories = computed(() => {
  const uniqueCategories = new Set(products.value.map(p => p.category));
  return Array.from(uniqueCategories);
});

const updateDisplayedProducts = (filtered: Product[]) => {
  displayedProducts.value = filtered;
};

const filteredProducts = computed(() => {
  const source = displayedProducts.value.length ? displayedProducts.value : products.value;
  if (!selectedCategory.value) return source;
  return source.filter(product => product.category === selectedCategory.value);
});

const showDetails = (product: Product) => {
  selectedProduct.value = product;
  dialog.value = true;
};

const openProductForm = () => {
  showProductForm.value = true;
};

const openOrderForm = () => {
  showOrderForm.value = true;
};

const handleProductCreated = async (newProduct: Product) => {
  console.log('Товар создан:', newProduct);
  showNotification('Товар успешно создан!', 'success');
  loadProducts();
};

const handleOrderCreated = (orderData: OrderFormType) => {
  console.log('Заказ создан:', orderData);
  showNotification('Заказ успешно оформлен!', 'success');
};

const showNotification = (message: string, type: 'success' | 'error' | 'info') => {
  notification.value = {
    show: true,
    message,
    type,
  };

  setTimeout(() => {
    notification.value.show = false;
  }, 3000);
};

const hideNotification = () => {
  notification.value.show = false;
};
</script>
<template>
  <v-app>
    <v-snackbar
      v-model="notification.show"
      :color="
        notification.type === 'success'
          ? 'success'
          : notification.type === 'error'
            ? 'error'
            : 'info'
      "
      :timeout="3000"
      location="top"
    >
      {{ notification.message }}

      <template #actions>
        <v-btn variant="text" @click="hideNotification"> Закрыть </v-btn>
      </template>
    </v-snackbar>

    <loading-circle v-if="isLoading" />
    <error-template v-else-if="error" :error="error" :event="loadProducts" />
    <template v-else>
      <header-search
        :products="products"
        @update:filtered="updateDisplayedProducts"
      ></header-search>
      <v-card-actions class="flex-grow-0 mt-15">
        <v-btn color="primary" variant="tonal" @click="openProductForm">
          Создать новый продукт
        </v-btn>

        <v-btn color="primary" variant="tonal" @click="openOrderForm"> Оформить заказ </v-btn>
      </v-card-actions>

      <ProductForm v-model="showProductForm" @created="handleProductCreated" />

      <OrderForm v-model="showOrderForm" @order-created="handleOrderCreated" />

      <v-container class="mt-5">
        <product-filter v-model:selected-category="selectedCategory" :categories="categories" />
        <v-row dense>
          <v-col
            v-for="product in filteredProducts"
            :key="product.id"
            cols="12"
            sm="6"
            md="4"
            lg="3"
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
  </v-app>
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
