import { describe, it, expect, beforeEach, vi, afterEach, type Mock } from 'vitest';
import { useProductsStore } from '../../src/stores/products';
import axios from 'axios';
import type { Product } from '../../src/types/product';
import { createPinia, setActivePinia } from 'pinia';

const API_URL = 'https://fakestoreapi.com/products';

type MockedAxios = {
  get: Mock;
  post: Mock;
  delete: Mock;
};

vi.mock('axios');
const mockedAxios = axios as unknown as MockedAxios;

const mockFetch = vi.fn();
global.fetch = mockFetch;

describe('useProducts', () => {
  let store: ReturnType<typeof useProductsStore>;
  beforeEach(() => {
    const pinia = createPinia();
    setActivePinia(pinia);

    store = useProductsStore();
    vi.clearAllMocks();
    mockedAxios.get.mockReset();
    mockedAxios.post.mockReset();
    mockedAxios.delete.mockReset();
  });
  afterEach(() => {
    vi.restoreAllMocks();
  });
  describe('get products', () => {
    it('get products successfully', async () => {
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

      await store.getProducts();

      expect(mockedAxios.get).toHaveBeenCalledWith(API_URL);
      expect(store.products).toEqual(mockProducts);
      expect(store.isLoading).toBe(false);
      expect(store.error).toBeNull();
    });

    it('get error for fail get products', async () => {
      const mockError = new Error('Network error');
      mockedAxios.get.mockRejectedValueOnce(mockError);
      await store.getProducts();

      expect(mockedAxios.get).toHaveBeenCalledWith(API_URL);
      expect(store.products).toEqual([]);
      expect(store.isLoading).toBe(false);
      expect(store.error).toBe(mockError);
    });
  });
  describe('add product', () => {
    it('add new product successfully', async () => {
      const newProduct: Omit<Product, 'id'> = {
        title: 'New Product',
        price: 300,
        description: 'New Description',
        category: 'New Category',
        image: 'new-image.jpg',
        rating: { rate: 4.2, count: 75 },
      };

      const createdProduct: Product = {
        id: 3,
        ...newProduct,
      };

      mockedAxios.post.mockResolvedValueOnce({ data: createdProduct });

      store.products = [
        {
          id: 1,
          title: 'Existing Product',
          price: 100,
          description: 'Existing Description',
          category: 'Existing Category',
          image: 'existing-image.jpg',
          rating: { rate: 4.0, count: 50 },
        },
      ];

      const result = await store.addProduct(newProduct);

      expect(mockedAxios.post).toHaveBeenCalledWith(API_URL, newProduct);
      expect(store.products).toHaveLength(2);
      expect(store.products[1]).toEqual(createdProduct);
      expect(result).toEqual(createdProduct);
      expect(store.isLoading).toBe(false);
      expect(store.error).toBeNull();
    });
  });
});
