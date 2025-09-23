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
    localStorageMock.getItem.mockReturnValue(null);

    const pinia = createPinia();
    setActivePinia(pinia);

    store = useCartStore();
    store.clearCart();

    vi.clearAllMocks();
    vi.spyOn(store, 'loadFromStorage').mockResolvedValue();
  });

  describe('init cart', () => {
    it('should have empty cart initially', () => {
      expect(store.items).toHaveLength(0);
      expect(store.totalItems).toBe(0);
      expect(store.totalPrice).toBe(0);
    });
  });

  describe('addToCart', () => {
    it('add new product in cart', async () => {
      await store.addToCart(mockProduct);

      expect(store.items).toHaveLength(1);
      expect(store.items[0].product).toEqual(mockProduct);
      expect(store.items[0].quantity).toBe(1);
      expect(localStorageMock.setItem).toHaveBeenCalledWith('cart', expect.any(String));
    });

    it('increase product quantity', async () => {
      await store.addToCart(mockProduct);

      await store.addToCart(mockProduct);

      expect(store.items).toHaveLength(1);
      expect(store.items[0].quantity).toBe(2);
    });
  });
  describe('computed properties', () => {
    it('calculating the total amount products', async () => {
      await store.addToCart(mockProduct);
      await store.addToCart(mockProduct);
      await store.addToCart(mockProduct2);

      expect(store.totalItems).toBe(3);
    });

    it('calculating the total summ', async () => {
      await store.addToCart(mockProduct);
      await store.addToCart(mockProduct);
      await store.addToCart(mockProduct2);

      expect(store.totalPrice).toBe(400);
    });

    it('should return zero for empty cart', () => {
      expect(store.totalItems).toBe(0);
      expect(store.totalPrice).toBe(0);
    });
  });
  describe('remove from cart', () => {
    it('should remove product cart', async () => {
      await store.addToCart(mockProduct);
      await store.addToCart(mockProduct2);

      expect(store.items).toHaveLength(2);

      await store.removeFromCart(1);

      expect(store.items).toHaveLength(1);
      expect(store.items[0].product.id).toBe(2);
    });
  });
  describe('updateQuantity', () => {
    it('should update quantity correctly', async () => {
      await store.addToCart(mockProduct);
      await store.updateQuantity(1, 5);

      expect(store.items[0].quantity).toBe(5);
    });
    it('should remove product when quantity is zero', async () => {
      await store.addToCart(mockProduct);
      await store.updateQuantity(1, 0);

      expect(store.items).toHaveLength(0);
    });
  });
  describe('incrementQuantity', () => {
    it('incrementQuantity should increase quantity', async () => {
      await store.addToCart(mockProduct);

      await store.incrementQuantity(1);

      expect(store.items[0].quantity).toBe(2);
    });
  });
  describe('decrementQuantity', () => {
    it('decrementQuantity should decrease quantity', async () => {
      await store.addToCart(mockProduct);
      await store.addToCart(mockProduct);
      await store.decrementQuantity(1);
      expect(store.items[0].quantity).toBe(1);
    });
    it('should remove product when quantity zero', async () => {
      await store.addToCart(mockProduct);
      await store.decrementQuantity(1);
      expect(store.items).toHaveLength(0);
    });
  });
  describe('clearCart', () => {
    it('should remove all products', async () => {
      await store.addToCart(mockProduct);
      await store.addToCart(mockProduct2);
      expect(store.items).toHaveLength(2);
      await store.clearCart();
      expect(store.items).toHaveLength(0);
      expect(localStorageMock.setItem).toHaveBeenCalledWith('cart', '[]');
    });
  });

  describe('isInCart', () => {
    it('should return true if product is in cart', async () => {
      await store.addToCart(mockProduct);
      expect(store.isInCart(1)).toBe(true);
    });

    it('should return false if product is not in cart', () => {
      expect(store.isInCart(999)).toBe(false);
    });
  });
});
