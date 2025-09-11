import { defineStore } from 'pinia';
import axios from 'axios';
import type { Product } from '../types/product';
import { computed, ref } from 'vue';

const API_URL = 'https://fakestoreapi.com/products';

export const useProductsStore = defineStore('products', () => {
  const products = ref<Product[]>([]);
  const isLoading = ref(false);
  const error = ref<Error | null>(null);

  const getProductById = computed(() => (id: number) => {
    return products.value.find(product => product.id === id);
  });

  const getProductsByCategory = computed(() => (category: string) => {
    return products.value.filter(product => product.category === category);
  });

  const getProducts = async (): Promise<void> => {
    isLoading.value = true;
    error.value = null;
    try {
      const { data } = await axios.get<Product[]>(API_URL);
      products.value = data;
    } catch (err) {
      error.value = err as Error;
      console.error('Ошибка при загрузке товаров:', err);
    } finally {
      isLoading.value = false;
    }
  };

  const addProduct = async (productData: Omit<Product, 'id'>): Promise<Product | void> => {
    isLoading.value = true;
    try {
      const { data } = await axios.post<Product>(API_URL, productData);
      products.value.push(data);
      return data;
    } catch (err) {
      error.value = err as Error;
      console.error('Ошибка при добавлении товара:', err);
    } finally {
      isLoading.value = false;
    }
  };

  const deleteProduct = async (id: number): Promise<void> => {
    isLoading.value = true;
    try {
      await axios.delete(`${API_URL}/${id}`);
      products.value = products.value.filter(product => product.id !== id);
    } catch (err) {
      error.value = err as Error;
      console.error(`Ошибка при удалении товара с ID ${id}:`, err);
    } finally {
      isLoading.value = false;
    }
  };

  return {
    products,
    isLoading,
    error,

    getProductById,
    getProductsByCategory,

    getProducts,
    addProduct,
    deleteProduct,
  };
});
