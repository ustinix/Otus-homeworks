import { defineStore } from 'pinia';
import { computed, ref } from 'vue';
import type { CartItem } from '../types/cart';
import type { Product } from '../types/product';

export const useCartStore = defineStore('cart', () => {
  const items = ref<CartItem[]>([]);
  const isLoading = ref<boolean>(false);
  const error = ref<Error | null>(null);

  const loadFromStorage = async (): Promise<void> => {
    isLoading.value = true;

    try {
      await new Promise(resolve => setTimeout(resolve, 100));
      const saved = localStorage.getItem('cart');
      if (saved) {
        items.value = JSON.parse(saved);
      }
    } catch (err) {
      error.value = new Error('Ошибка загрузки корзины');
      throw err;
    } finally {
      isLoading.value = false;
    }
  };

  const saveToStorage = async (): Promise<void> => {
    isLoading.value = true;
    try {
      await new Promise(resolve => setTimeout(resolve, 50));
      localStorage.setItem('cart', JSON.stringify(items.value));
    } catch (err) {
      new Error('Ошибка сохранения корзины');
      throw err;
    } finally {
      isLoading.value = false;
    }
  };

  loadFromStorage();

  const totalItems = computed(() => {
    return items.value.reduce((total, item) => total + item.quantity, 0);
  });

  const totalPrice = computed(() => {
    return items.value.reduce((total, item) => total + item.product.price * item.quantity, 0);
  });

  const addToCart = async (product: Product): Promise<void> => {
    isLoading.value = true;

    try {
      await new Promise(resolve => setTimeout(resolve, 50));
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
      await saveToStorage();
    } catch (err) {
      error.value = new Error('Ошибка добавления товара');
      throw err;
    } finally {
      isLoading.value = false;
    }
  };

  const removeFromCart = async (productId: number): Promise<void> => {
    isLoading.value = true;

    try {
      await new Promise(resolve => setTimeout(resolve, 50));
      items.value = items.value.filter(item => item.product.id !== productId);
      await saveToStorage();
    } catch (err) {
      error.value = new Error('Ошибка удаления товара');
      throw err;
    } finally {
      isLoading.value = false;
    }
  };

  const updateQuantity = async (productId: number, quantity: number): Promise<void> => {
    isLoading.value = true;
    try {
      await new Promise(resolve => setTimeout(resolve, 50));
      const itemIndex = items.value.findIndex(item => item.product.id === productId);

      if (itemIndex !== -1) {
        if (quantity === 0) {
          removeFromCart(productId);
        } else {
          items.value = items.value.map((item, index) =>
            index === itemIndex ? { ...item, quantity: quantity } : item,
          );
        }

        await saveToStorage();
      }
    } catch (err) {
      error.value = new Error('Ошибка изменения количества товара');
      throw err;
    } finally {
      isLoading.value = false;
    }
  };

  const clearCart = async (): Promise<void> => {
    isLoading.value = true;
    try {
      await new Promise(resolve => setTimeout(resolve, 50));
      items.value = [];
      await saveToStorage();
    } catch (err) {
      error.value = new Error('Ошибка очистки корзины');
      throw err;
    } finally {
      isLoading.value = false;
    }
  };

  const isInCart = (productId: number) => {
    return items.value.some(item => item.product.id === productId);
  };

  const incrementQuantity = async (productId: number): Promise<void> => {
    isLoading.value = true;
    try {
      const itemIndex = items.value.findIndex(item => item.product.id === productId);
      if (itemIndex !== -1) {
        items.value = items.value.map((item, index) =>
          index === itemIndex ? { ...item, quantity: item.quantity + 1 } : item,
        );
      }
      await saveToStorage();
    } catch (err) {
      error.value = new Error('Ошибка увеличения количества');
      throw err;
    } finally {
      isLoading.value = false;
    }
  };

  const decrementQuantity = async (productId: number): Promise<void> => {
    isLoading.value = true;
    try {
      const itemIndex = items.value.findIndex(item => item.product.id === productId);
      const decrementStep = 1;
      if (itemIndex !== -1) {
        const newQuantity = items.value[itemIndex].quantity - decrementStep;

        if (newQuantity === 0) {
          await removeFromCart(productId);
        } else {
          items.value = items.value.map((item, index) =>
            index === itemIndex ? { ...item, quantity: newQuantity } : item,
          );
          await saveToStorage();
        }
      }
    } catch (err) {
      error.value = new Error('Ошибка уменьшения количества');
      throw err;
    } finally {
      isLoading.value = false;
    }
  };

  return {
    isLoading,
    error,
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
