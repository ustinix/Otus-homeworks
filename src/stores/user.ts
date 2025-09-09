import { defineStore } from 'pinia';
import type { User } from '../types/user';
import { computed, ref } from 'vue';

export const useUserStore = defineStore('user', () => {
  const user = ref<User | null>(null);

  const isLoggedIn = computed(() => !!user.value?.isLoggedIn);

  const isAdmin = computed(() => user.value?.isAdmin || false);

  const loadUserFromStorage = () => {
    const userData = localStorage.getItem('user');
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
  };

  const setUser = (userData: User) => {
    user.value = userData;
    localStorage.setItem('user', JSON.stringify(userData));
  };

  const logout = () => {
    user.value = null;
    localStorage.removeItem('user');
  };

  loadUserFromStorage();

  return {
    user,
    isLoggedIn,
    isAdmin,
    setUser,
    logout,
    loadUserFromStorage,
  };
});
