import { defineStore } from 'pinia';
import type { Product } from '../types/product';
import { productService } from '../services/product-service';

export const useProductStore = defineStore('products', {
  state: () => ({
    products: [] as Product[],
    isLoading: false,
    error: null as Error | null,
  }),
  actions: {
    async createProduct(productData: Omit<Product, 'id'>) {
      this.isLoading = true;
      try {
        const newProduct = await productService().addProduct(productData);
        if (newProduct) {
          this.products.unshift(newProduct);
          return newProduct;
        }
      } catch (error) {
        this.error = error as Error;
        throw error;
      } finally {
        this.isLoading = false;
      }
    },
  },
});
