import { defineStore } from 'pinia';
import { ref, watch } from 'vue';

interface Item {
  name: string;
  description: string;
  price: number;
}

const STORAGE_KEY = 'ist-store';

export const useListStore = defineStore('listStore', () => {
  const loadFromStorage = (): Item[] => {
    const storedData = localStorage.getItem(STORAGE_KEY);
    return storedData ? JSON.parse(storedData) : [];
  };

  const list = ref<Item[]>(loadFromStorage());

  watch(
    list,
    newList => {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(newList));
    },
    { deep: true },
  );

  const addItem = (item: Item) => {
    list.value.push(item);
  };

  const removeItem = (index: number) => {
    list.value.splice(index, 1);
  };

  const clearList = () => {
    list.value = [];
    localStorage.removeItem(STORAGE_KEY);
  };

  return {
    list,
    addItem,
    removeItem,
    clearList,
  };
});
