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
    const existingItemIndex = items.value.findIndex(item => item.product.id === product.id);
    if (existingItemIndex !== -1) {
      items.value = items.value.map((item, index) =>
        index === existingItemIndex ? { ...item, quantity: item.quantity + 1 } : item,
      );
    } else {
      items.value = [
        ...items.value,
        {
          product,
          quantity: 1,
        },
      ];
    }
    saveToStorage();
  };

  const removeFromCart = (productId: number) => {
    items.value = items.value.filter(item => item.product.id !== productId);
    saveToStorage();
  };

  const updateQuantity = (productId: number, quantity: number) => {
    const itemIndex = items.value.findIndex(item => item.product.id === productId);

    if (itemIndex !== -1) {
      if (quantity === 0) {
        removeFromCart(productId);
      } else {
        items.value = items.value.map((item, index) =>
          index === itemIndex ? { ...item, quantity: quantity } : item,
        );
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

  const incrementQuantity = (productId: number) => {
    const itemIndex = items.value.findIndex(item => item.product.id === productId);
    if (itemIndex !== -1) {
      items.value = items.value.map((item, index) =>
        index === itemIndex ? { ...item, quantity: item.quantity + 1 } : item,
      );
    }
    saveToStorage();
  };

  const decrementQuantity = (productId: number) => {
    const itemIndex = items.value.findIndex(item => item.product.id === productId);
    const decrementStep = 1;
    if (itemIndex !== -1) {
      const newQuantity = items.value[itemIndex].quantity - decrementStep;

      if (newQuantity === 0) {
        removeFromCart(productId);
      } else {
        items.value = items.value.map((item, index) =>
          index === itemIndex ? { ...item, quantity: newQuantity } : item,
        );
        saveToStorage();
      }
    }
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
    incrementQuantity,
    decrementQuantity,
  };
});
