import { ref, type Ref } from 'vue';
import type { User } from '../types/user';

const API_URL = 'https://7e9973e8386e9508.mokky.dev/users';

export function usersService() {
  const users: Ref<User[]> = ref([]);
  const isLoading: Ref<boolean> = ref(false);
  const error: Ref<string | null> = ref(null);

  const getUsers = async (): Promise<void> => {
    isLoading.value = true;
    try {
      const response = await fetch(API_URL);
      if (!response.ok) throw new Error('Ошибка загрузки данных');
      users.value = await response.json();
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Неизвестная ошибка';
    } finally {
      isLoading.value = false;
    }
  };

  const addUser = async (user: User): Promise<void> => {
    isLoading.value = true;
    try {
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(user.id),
      });
      if (!response.ok) throw new Error('Ошибка добавления');
      const newUser: User = await response.json();
      users.value.push(newUser);
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Неизвестная ошибка';
    } finally {
      isLoading.value = false;
    }
  };
  return {
    users,
    isLoading,
    error,
    getUsers,
    addUser,
  };
}
