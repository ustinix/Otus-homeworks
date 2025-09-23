import { describe, it, expect, beforeEach, vi, Mock } from 'vitest';
import { mount, type VueWrapper } from '@vue/test-utils';
import { createPinia, setActivePinia } from 'pinia';
import { useCartStore } from '../../src/stores/cart';
import type { Product } from '../../src/types/product';
import type { CartItem } from '../../src/types/cart';
import CartPage from '../../src/pages/CartPage.vue';

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

describe('cart page', () => {
  let wrapper: VueWrapper;
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

  beforeEach(() => {
    localStorageMock.getItem.mockReturnValue(null);
    setActivePinia(createPinia());
    store = useCartStore();
    vi.spyOn(store, 'loadFromStorage').mockResolvedValue();
    store.isLoading = false;
    store.error = null;
  });

  it('message about empty cart', async () => {
    store.items = [];
    store.isLoading = false;
    wrapper = mount(CartPage);
    await wrapper.vm.$nextTick();
    expect(wrapper.text()).toContain('Ваша корзина пуста');
  });

  it('not show products when cart is empty', async () => {
    wrapper = mount(CartPage);
    await wrapper.vm.$nextTick();

    expect(wrapper.text()).not.toContain('Test Product');
    expect(wrapper.find('.product-iem').exists()).toBe(false);
  });

  it('show products in cart', async () => {
    const cartItem: CartItem = {
      product: mockProduct,
      quantity: 2,
    };

    store.items = [cartItem];
    store.isLoading = false;

    wrapper = mount(CartPage);
    await wrapper.vm.$nextTick();

    expect(wrapper.text()).toContain('Test Product');
    expect(wrapper.text()).toContain('200');
    expect(wrapper.text()).toContain('2');
  });

  it('show all products summ', async () => {
    const cartItem: CartItem = {
      product: mockProduct,
      quantity: 3,
    };

    store.items = [cartItem];
    store.isLoading = false;

    wrapper = mount(CartPage);
    await wrapper.vm.$nextTick();
    expect(wrapper.text()).toContain('300');
  });
});
