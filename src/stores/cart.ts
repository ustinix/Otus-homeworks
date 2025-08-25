import { defineStore } from 'pinia';
import { computed, ref } from 'vue';
import type { CartItem } from '../types/cart';
import type { Product } from '../types/product';

export const useCartStore = defineStore('cart', () => {
  const items = ref<CartItem[]>([]);

  const loadFromStorage = () => {
    const saved = localStorage.getItem('cart');
    if (saved) {
      items.value = JSON.parse(saved);
    }
  };

  const saveToStorage = () => {
    localStorage.setItem('cart', JSON.stringify(items.value));
  };

  loadFromStorage();

  const totalItems = computed(() => {
    return items.value.reduce((total, item) => total + item.quantity, 0);
  });

  const totalPrice = computed(() => {
    return items.value.reduce((total, item) => total + item.product.price * item.quantity, 0);
  });

  const addToCart = (product: Product) => {
    const existingItem = items.value.find(item => item.product.id === product.id);
    if (existingItem) {
      existingItem.quantity += 1;
    } else {
      items.value.push({
        product,
        quantity: 1,
      });
    }
    saveToStorage();
  };

  const removeFromCart = (productId: number) => {
    items.value = items.value.filter(item => item.product.id !== productId);
    saveToStorage();
  };

  const updateQuantity = (productId: number, quantity: number) => {
    const item = items.value.find(item => item.product.id === productId);

    if (item) {
      if (quantity <= 0) {
        removeFromCart(productId);
      } else {
        item.quantity = quantity;
      }

      saveToStorage();
    }
  };

  const clearCart = () => {
    items.value = [];
    saveToStorage();
  };

  const isInCart = (productId: number) => {
    return items.value.some(item => item.product.id === productId);
  };

  return {
    items,
    totalItems,
    totalPrice,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    isInCart,
    loadFromStorage,
    saveToStorage,
  };
});
