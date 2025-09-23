import { defineStore } from 'pinia';
import { apolloClient, gql } from '../lib/apollo-client';
import { ref } from 'vue';
import type { Product } from '../types/product';
import type { ProductQueryResponse } from '../types/apiResponses';
import { transformApiProductToProduct } from '../utils/transformApiProductToProduct';

export const useProductStore = defineStore('product', () => {
  const product = ref<Product | null>(null);
  const isLoading = ref(false);
  const error = ref<Error | null>(null);

  const getProduct = async (id: string): Promise<void> => {
    isLoading.value = true;
    error.value = null;
    product.value = null;
    try {
      const result = await apolloClient.query<ProductQueryResponse>({
        query: gql`
          query GetProduct($productId: ID!) {
            product(id: $productId) {
              id
              title
              price
              description
              images
              category {
                id
                name
                image
              }
            }
          }
        `,
        variables: {
          productId: id,
        },
      });
      product.value = result.data?.product
        ? transformApiProductToProduct(result.data?.product)
        : null;
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
