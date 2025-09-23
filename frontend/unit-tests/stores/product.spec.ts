import { describe, it, expect, beforeEach, vi, afterEach, type Mock } from 'vitest';
import { useProductStore } from '../../src/stores/product';
import axios from 'axios';
import type { Product } from '../../src/types/product';
import { createPinia, setActivePinia } from 'pinia';

type MockedAxios = {
  get: Mock;
  post: Mock;
  delete: Mock;
};

vi.mock('axios');
const mockedAxios = axios as unknown as MockedAxios;

const mockFetch = vi.fn();
global.fetch = mockFetch;

describe('useProductStore', () => {
  let store: ReturnType<typeof useProductStore>;
  beforeEach(() => {
    const pinia = createPinia();
    setActivePinia(pinia);

    store = useProductStore();
    vi.clearAllMocks();
    mockedAxios.get.mockReset();
    mockedAxios.post.mockReset();
    mockedAxios.delete.mockReset();
  });
  afterEach(() => {
    vi.restoreAllMocks();
  });
  describe('get product', () => {
    it('get product successfully', async () => {
      const mockProducts: Product[] = [
        {
          id: 1,
          title: 'Product 1',
          price: 100,
          description: 'Description 1',
          category: 'Category 1',
          image: 'image1.jpg',
          rating: { rate: 4.5, count: 100 },
        },
        {
          id: 2,
          title: 'Product 2',
          price: 200,
          description: 'Description 2',
          category: 'Category 2',
          image: 'image2.jpg',
          rating: { rate: 4.0, count: 50 },
        },
      ];

      mockedAxios.get.mockResolvedValueOnce({ data: mockProducts });

      await store.getProduct(1);

      expect(mockedAxios.get).toHaveBeenCalledWith('https://fakestoreapi.com/products/1');
      expect(store.product).toEqual(mockProducts);
      expect(store.isLoading).toBe(false);
      expect(store.error).toBeNull();
    });

    it('get error for fail get product', async () => {
      const mockError = new Error('Network error');
      mockedAxios.get.mockRejectedValueOnce(mockError);
      await store.getProduct(3);

      expect(mockedAxios.get).toHaveBeenCalledWith('https://fakestoreapi.com/products/3');
      expect(store.product).toEqual(null);
      expect(store.isLoading).toBe(false);
      expect(store.error).toBe(mockError);
    });
  });
});
