import { defineStore } from 'pinia';
import axios from 'axios';
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
      const { data } = await axios.get<Product>(`${API_URL}/${id}`);
      product.value = data;
    } catch (err) {
      error.value = err as Error;
      console.error(`Ошибка при загрузке товара ${id}:`, err);
    } finally {
      isLoading.value = false;
    }
  };

  return {
    product,
    isLoading,
    error,
    getProduct,
  };
});
