import { describe, it, expect, beforeEach } from 'vitest';
import { mount, type VueWrapper } from '@vue/test-utils';
import { createPinia, setActivePinia } from 'pinia';
import { useCartStore } from '../../src/stores/cart';
import type { Product } from '../../src/types/product';
import type { CartItem } from '../../src/types/cart';
import CartPage from '../../src/pages/CartPage.vue';

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
    setActivePinia(createPinia());
    store = useCartStore();
  });

  it('message about empty cart', () => {
    wrapper = mount(CartPage);
    expect(wrapper.text()).toContain('Ваша корзина пуста');
  });

  it('show products in cart', async () => {
    const cartItem: CartItem = {
      product: mockProduct,
      quantity: 2,
    };

    store.items = [cartItem];

    wrapper = mount(CartPage);

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

    wrapper = mount(CartPage);

    expect(wrapper.text()).toContain('300');
  });
});
