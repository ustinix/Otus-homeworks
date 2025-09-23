import { defineStore } from 'pinia';
import { apolloClient, gql } from '../lib/apollo-client';
import type { Product, ApiProduct, CreateProductDto } from '../types/product';
import type { AddProductMutationResponse, ProductsQueryResponse } from '../types/apiResponses';
import { computed, ref } from 'vue';
import { transformApiProductToProduct } from '../utils/transformApiProductToProduct';

export const useProductsStore = defineStore('products', () => {
  const products = ref<Product[]>([]);
  const isLoading = ref(false);
  const error = ref<Error | null>(null);

  const getProductsByCategory = computed(() => (category: string) => {
    return products.value.filter(product => product.category === category);
  });

  const updateProducts = (newProducts: Product[]): void => {
    products.value.splice(0, products.value.length, ...newProducts);
  };

  const getProducts = async (): Promise<void> => {
    isLoading.value = true;
    error.value = null;
    try {
      const result = await apolloClient.query<ProductsQueryResponse>({
        query: gql`
          query GetAllProducts {
            products(limit: 100) {
              id
              title
              price
              description
              images
              category {
                id
                name
              }
            }
          }
        `,
      });
      console.log('Ответ от сервера (категории):', result);
      if (result.data?.products) {
        console.log('Полученные товары:', result.data.products);
        const transformedProducts: Product[] = result.data.products.map((apiProduct: ApiProduct) =>
          transformApiProductToProduct(apiProduct),
        );

        updateProducts(transformedProducts);
      } else {
        console.warn('Нет данных о товарах в ответе');
        updateProducts([]);
      }
    } catch (err) {
      error.value = err as Error;
      console.error('Ошибка при получении товаров:', error);
      updateProducts([]);
    } finally {
      isLoading.value = false;
    }
  };

  return {
    products,
    isLoading,
    error,
    getProductsByCategory,
    getProducts,
  };
});
