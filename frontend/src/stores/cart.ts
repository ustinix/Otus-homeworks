import { defineStore } from 'pinia';
import { computed, onUnmounted, ref } from 'vue';
import type { CartItem } from '../types/cart';
import type { Product } from '../types/product';
import { io, type Socket } from 'socket.io-client';
import { useUserStore } from './user';

interface CartSyncPayload {
  userId: string;
  items: CartItem[];
  timestamp: number;
}

interface CartItemPayload {
  userId: string;
  productId: string;
  product?: Product;
  quantity?: number;
  timestamp: number;
}

export const useCartStore = defineStore('cart', () => {
  const items = ref<CartItem[]>([]);
  const isLoading = ref<boolean>(false);
  const error = ref<Error | null>(null);
  const socket = ref<Socket | null>(null);
  const isConnected = ref<boolean>(false);

  const userStore = useUserStore();

  const getUserId = (): string => {
    return userStore.getUserId();
  };

  const initWebSocket = (): void => {
    try {
      socket.value = io('http://localhost:3000');

      socket.value.on('connect', () => {
        isConnected.value = true;
        console.log('WebSocket connected');

        socket.value?.emit('get-cart-state');
      });

      socket.value.on('disconnect', () => {
        isConnected.value = false;
        console.log('WebSocket disconnected');
      });

      socket.value.on('set-cart-state', (payload: CartSyncPayload) => {
        if (payload.userId === getUserId()) {
          items.value = payload.items;
          saveToStorage();
        }
      });

      socket.value.on('add-to-cart', (payload: CartItemPayload) => {
        if (payload.userId === getUserId()) {
          handleAddToCart(payload);
        }
      });

      socket.value.on('remove-from-cart', (payload: CartItemPayload) => {
        if (payload.userId === getUserId()) {
          handleRemoveFromCart(payload.productId);
        }
      });

      socket.value.on('update-cart-item', (payload: CartItemPayload) => {
        if (payload.userId === getUserId() && payload.quantity !== undefined) {
          handleUpdateQuantity(payload.productId, payload.quantity);
        }
      });

      socket.value.on('clear-cart', (payload: { userId: string }) => {
        if (payload.userId === getUserId()) {
          handleClearCart();
        }
      });

      socket.value.on('get-cart-state-request', () => {
        socket.value?.emit('send-cart-state', {
          userId: getUserId(),
          items: items.value,
          timestamp: Date.now(),
        });
      });
    } catch (err) {
      error.value = new Error('Ошибка подключения WebSocket');
      console.error('WebSocket error:', err);
    }
  };

  const loadFromStorage = async (): Promise<void> => {
    isLoading.value = true;

    try {
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
    try {
      localStorage.setItem('cart', JSON.stringify(items.value));
    } catch (err) {
      new Error('Ошибка сохранения корзины');
      throw err;
    }
  };

  const handleAddToCart = (payload: CartItemPayload): void => {
    const existingItemIndex = items.value.findIndex(item => item.product.id === payload.productId);

    if (existingItemIndex !== -1) {
      items.value = items.value.map((item, index) =>
        index === existingItemIndex ? { ...item, quantity: item.quantity + 1 } : item,
      );
    } else if (payload.product) {
      items.value = [
        ...items.value,
        {
          product: payload.product,
          quantity: 1,
        },
      ];
    }
    saveToStorage();
  };

  const handleRemoveFromCart = (productId: string): void => {
    items.value = items.value.filter(item => item.product.id !== productId);
    saveToStorage();
  };

  const handleUpdateQuantity = (productId: string, quantity: number): void => {
    const itemIndex = items.value.findIndex(item => item.product.id === productId);

    if (itemIndex !== -1) {
      if (quantity === 0) {
        handleRemoveFromCart(productId);
      } else {
        items.value = items.value.map((item, index) =>
          index === itemIndex ? { ...item, quantity } : item,
        );
        saveToStorage();
      }
    }
  };

  const handleClearCart = (): void => {
    items.value = [];
    saveToStorage();
  };

  const addToCart = async (product: Product): Promise<void> => {
    isLoading.value = true;
    try {
      const payload: CartItemPayload = {
        userId: getUserId(),
        productId: product.id,
        product: product,
        timestamp: Date.now(),
      };

      if (isConnected.value && socket.value) {
        socket.value.emit('add-to-cart', payload);
      } else {
        handleAddToCart(payload);
      }
    } catch (err) {
      error.value = new Error('Ошибка добавления товара');
      throw err;
    } finally {
      isLoading.value = false;
    }
  };

  const removeFromCart = async (productId: string): Promise<void> => {
    isLoading.value = true;
    try {
      const payload: CartItemPayload = {
        userId: getUserId(),
        productId: productId,
        timestamp: Date.now(),
      };

      if (isConnected.value && socket.value) {
        socket.value.emit('remove-from-cart', payload);
      } else {
        handleRemoveFromCart(productId);
      }
    } catch (err) {
      error.value = new Error('Ошибка удаления товара');
      throw err;
    } finally {
      isLoading.value = false;
    }
  };

  const updateQuantity = async (productId: string, quantity: number): Promise<void> => {
    isLoading.value = true;
    try {
      const payload: CartItemPayload = {
        userId: getUserId(),
        productId: productId,
        quantity: quantity,
        timestamp: Date.now(),
      };

      if (isConnected.value && socket.value) {
        socket.value.emit('update-cart-item', payload);
      } else {
        handleUpdateQuantity(productId, quantity);
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
      const payload = {
        userId: getUserId(),
        timestamp: Date.now(),
      };

      if (isConnected.value && socket.value) {
        socket.value.emit('clear-cart', payload);
      } else {
        handleClearCart();
      }
    } catch (err) {
      error.value = new Error('Ошибка очистки корзины');
      throw err;
    } finally {
      isLoading.value = false;
    }
  };

  const totalItems = computed(() => {
    return items.value.reduce((total, item) => total + item.quantity, 0);
  });

  const totalPrice = computed(() => {
    return items.value.reduce((total, item) => total + item.product.price * item.quantity, 0);
  });

  const incrementQuantity = async (productId: string): Promise<void> => {
    const item = items.value.find(item => item.product.id === productId);
    if (item) {
      await updateQuantity(productId, item.quantity + 1);
    }
  };

  const decrementQuantity = async (productId: string): Promise<void> => {
    const item = items.value.find(item => item.product.id === productId);
    if (item) {
      await updateQuantity(productId, item.quantity - 1);
    }
  };

  loadFromStorage();
  initWebSocket();

  onUnmounted(() => {
    if (socket.value) {
      socket.value.disconnect();
    }
  });

  return {
    isLoading,
    error,
    items,
    totalItems,
    totalPrice,
    isConnected,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    incrementQuantity,
    decrementQuantity,
  };
});
