import { describe, it, expect, beforeEach, vi, type Mock } from 'vitest';
import { setActivePinia, createPinia } from 'pinia';
import { useCartStore } from '../../src/stores/cart';
import type { Product } from '../../src/types/product';

type MockedLocalStorage = {
  getItem: Mock;
  setItem: Mock;
  clear: Mock;
};

const localStorageMock: MockedLocalStorage = {
  getItem: vi.fn(),
  setItem: vi.fn(),
  clear: vi.fn(),
};

Object.defineProperty(global, 'localStorage', {
  value: localStorageMock,
  writable: true,
});

describe('cart store', () => {
  let store: ReturnType<typeof useCartStore>;

  const mockProduct: Product = {
    id: 1,
    title: 'Test Product',
    price: 100,
    description: 'Test Description',
    category: 'Test Category',
    image: 'test.jpg',
    rating: { rate: 4.5, count: 100 },
  };

  const mockProduct2: Product = {
    id: 2,
    title: 'Test Product 2',
    price: 200,
    description: 'Test Description 2',
    category: 'Test Category 2',
    image: 'test2.jpg',
    rating: { rate: 4.0, count: 50 },
  };

  beforeEach(() => {
    setActivePinia(createPinia());
    store = useCartStore();

    store.clearCart();

    vi.clearAllMocks();

    localStorageMock.getItem.mockReset();
    localStorageMock.setItem.mockReset();
    localStorageMock.clear.mockReset();
  });

  describe('addToCart', () => {
    it('add new product in cart', () => {
      store.addToCart(mockProduct);

      expect(store.items).toHaveLength(1);
      expect(store.items[0].product).toEqual(mockProduct);
      expect(store.items[0].quantity).toBe(1);
      expect(localStorageMock.setItem).toHaveBeenCalledWith('cart', expect.any(String));
    });

    it('increase product quantity', () => {
      store.addToCart(mockProduct);

      store.addToCart(mockProduct);

      expect(store.items).toHaveLength(1);
      expect(store.items[0].quantity).toBe(2);
    });
  });
  describe('computed properties', () => {
    it('calculating the total amount products', () => {
      store.addToCart(mockProduct);
      store.addToCart(mockProduct);
      store.addToCart(mockProduct2);

      expect(store.totalItems).toBe(3);
    });

    it('calculating the total summ', () => {
      store.addToCart(mockProduct);
      store.addToCart(mockProduct);
      store.addToCart(mockProduct2);

      expect(store.totalPrice).toBe(400);
    });
  });
  describe('quantity methods', () => {
    it('incrementQuantity increase quantity', () => {
      store.addToCart(mockProduct);

      store.incrementQuantity(1);

      expect(store.items[0].quantity).toBe(2);
    });

    it('decrementQuantity decrease quantity and delete if quantity equally 0', () => {
      store.addToCart(mockProduct);

      store.decrementQuantity(1);

      expect(store.items).toHaveLength(0);
    });
  });
});
