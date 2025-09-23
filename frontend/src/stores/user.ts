import { defineStore } from 'pinia';
import type { User } from '../types/user';
import { computed, ref } from 'vue';
import { generateUserId } from '../utils/generateUserId';
import { useCartStore } from './cart';

export const useUserStore = defineStore('user', () => {
  const user = ref<User | null>(null);
  const userId = ref<string>('');
  const cartStore = useCartStore();

  const isLoggedIn = computed(() => !!user.value?.isLoggedIn);
  const isAdmin = computed(() => user.value?.isAdmin || false);

  const loadUserFromStorage = () => {
    const userData = localStorage.getItem('user');
    const savedUserId = localStorage.getItem('userId');
    if (userData) {
      try {
        user.value = JSON.parse(userData);
      } catch (error) {
        console.error('Ошибка при чтении данных пользователя:', error);
        user.value = null;
      }
    } else {
      user.value = null;
    }

    if (savedUserId) {
      userId.value = savedUserId;
    } else {
      userId.value = generateUserId();
      localStorage.setItem('userId', userId.value);
    }
  };

  const setUser = (userData: User) => {
    user.value = userData;
    localStorage.setItem('user', JSON.stringify(userData));

    if (!userId.value) {
      userId.value = generateUserId();
      localStorage.setItem('userId', userId.value);
    }
  };

  const logout = () => {
    cartStore.clearCart();
    user.value = null;
    localStorage.removeItem('user');
  };

  const getUserId = (): string => {
    if (!userId.value) {
      userId.value = generateUserId();
      localStorage.setItem('userId', userId.value);
    }
    return userId.value;
  };

  const refreshUserId = (): string => {
    userId.value = generateUserId();
    localStorage.setItem('userId', userId.value);
    return userId.value;
  };

  loadUserFromStorage();

  return {
    user,
    userId: computed(() => userId.value),
    isLoggedIn,
    isAdmin,
    setUser,
    logout,
    loadUserFromStorage,
    getUserId,
    refreshUserId,
  };
});
