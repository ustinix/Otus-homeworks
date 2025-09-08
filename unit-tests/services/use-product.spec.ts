import { describe, it, expect, beforeEach, vi, afterEach, type Mock } from 'vitest';
import { useProducts } from '../../src/services/use-product';
import axios from 'axios';
import type { Product } from '../../src/types/product';

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
  beforeEach(() => {
    vi.clearAllMocks();
    mockedAxios.get.mockReset();
    mockedAxios.post.mockReset();
    mockedAxios.delete.mockReset();
  });
  afterEach(() => {
    vi.restoreAllMocks();
  });
  describe('get product', () => {
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
      const { products, isLoading, error, getProducts } = useProducts();

      await getProducts();

      expect(mockedAxios.get).toHaveBeenCalledWith('https://fakestoreapi.com/products');
      expect(products.value).toEqual(mockProducts);
      expect(isLoading.value).toBe(false);
      expect(error.value).toBeNull();
    });

    it('get error for fail get products', async () => {
      const mockError = new Error('Network error');
      mockedAxios.get.mockRejectedValueOnce(mockError);
      const { products, isLoading, error, getProducts } = useProducts();
      await getProducts();

      expect(mockedAxios.get).toHaveBeenCalledWith('https://fakestoreapi.com/products');
      expect(products.value).toEqual([]);
      expect(isLoading.value).toBe(false);
      expect(error.value).toBe(mockError);
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

      const { products, isLoading, error, addProduct } = useProducts();
      products.value = [
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

      const result = await addProduct(newProduct);

      expect(mockedAxios.post).toHaveBeenCalledWith(
        'https://fakestoreapi.com/products',
        newProduct,
      );
      expect(products.value).toHaveLength(2);
      expect(products.value[1]).toEqual(createdProduct);
      expect(result).toEqual(createdProduct);
      expect(isLoading.value).toBe(false);
      expect(error.value).toBeNull();
    });
  });
});
