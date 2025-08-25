<script setup lang="ts">
import { ref } from 'vue';
import ProductForm from '../components/ProductForm.vue';
import type { ProductFormData } from '../types/product';
import { useProducts } from '../services/use-product';

const { products, getProducts, addProduct, isLoading, error } = useProducts();

const notification = ref({
  show: false,
  message: '',
  type: 'success' as 'success' | 'error' | 'info',
});

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

const handleProductCreated = async (newProduct: Product) => {
  addProduct(newProduct);
  console.log('Товар создан:', newProduct);
  showNotification('Товар успешно создан!', 'success');
};
</script>

<template>
  <div>
    <ProductForm @created="handleProductCreated" />
  </div>
</template>

<style scoped></style>
