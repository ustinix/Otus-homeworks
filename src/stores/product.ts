import { defineStore } from 'pinia';
import { ref } from 'vue';
import type { Product } from '../types/product';

const API_URL = 'https://fakestoreapi.com/products';

export const useProductStore = defineStore('product', () => {
  const product = ref<Product | null>(null);
  const isLoading = ref(false);
  const error = ref<Error | null>(null);

  const getProduct = async (id: number): Promise<void> => {
    isLoading.value = true;
    error.value = null;
    try {
      const response = await fetch(`${API_URL}/${id}`);
      if (!response.ok) throw new Error('Failed to fetch product');
      product.value = await response.json();
    } catch (err) {
      error.value = err as Error;
      console.error(`Ошибка при загрузке товара ${id}:`, err);
    } finally {
      isLoading.value = false;
    }
  };

  const clearProduct = (): void => {
    product.value = null;
    error.value = null;
  };

  return {
    product,
    isLoading,
    error,
    getProduct,
    clearProduct,
  };
});
