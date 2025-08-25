import axios from 'axios';
import type { Product } from '../types/product';
import { ref } from 'vue';

const API_URL = 'https://fakestoreapi.com/products';

export function useProducts() {
  const products = ref<Product[]>([]);
  const isLoading = ref(false);
  const error = ref<Error | null>(null);

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

  const addProduct = async (product: Omit<Product, 'id'>): Promise<Product | void> => {
    isLoading.value = true;
    try {
      const { data } = await axios.post<Product>(API_URL, product);
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
    getProducts,
    addProduct,
    deleteProduct,
  };
}

export function useProduct() {
  const product = ref<Product | null>(null);
  const isLoading = ref(false);
  const error = ref<Error | null>(null);

  const getProduct = async (id: number): Promise<void> => {
    const response = await fetch(`${API_URL}/${id}`);
    if (!response.ok) throw new Error('Failed to fetch product');
    product.value = await response.json();
  };

  const clearProduct = () => {
    product.value = null;
  };

  return {
    product,
    isLoading,
    error,
    getProduct,
    clearProduct,
  };
}
