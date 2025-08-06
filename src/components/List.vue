<script setup lang="ts">
import { ref } from 'vue';
import { useListStore } from '../stores/list';

const store = useListStore();

const itemName = ref('');
const itemDescription = ref('');
const itemPrice = ref(0);
const errorMessage = ref('');

const saveName = () => {
  if (itemName.value) {
    store.addItem({
      name: itemName.value,
      description: itemDescription.value,
      price: Number(itemPrice.value),
    });

    itemName.value = '';
    itemDescription.value = '';
    itemPrice.value = 0;
  } else {
    errorMessage.value = 'Заполните имя';
  }
};
</script>

<template>
  <div class="content">
    <h1>Список:</h1>
    <div class="forms">
      <div class="form-field">
        <label for="name" class="form_label">Название</label>
        <input id="name" v-model="itemName" type="text" name="name" />
      </div>
      <div class="form-field">
        <label for="description" class="form_label">Описание</label>
        <input id="description" v-model="itemDescription" type="text" name="description" />
      </div>
      <div class="form-field">
        <label for="price" class="form_label">Цена (руб)</label>
        <input id="price" v-model="itemPrice" type="number" name="price" min="0" step="0.01" />
      </div>
      <button class="btn-save" @click="saveName">Сохранить в список</button>
    </div>
    <p v-if="store.list.length < 1">Список пока пуст</p>
    <table v-else>
      <thead>
        <tr>
          <th>Название</th>
          <th>Описание</th>
          <th>Цена</th>
          <th>Удалить</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(item, index) in store.list" :key="index">
          <td>{{ item.name }}</td>
          <td>{{ item.description }}</td>
          <td>{{ item.price.toFixed(2) }}</td>
          <td>
            <button @click="store.removeItem(index)">Удалить</button>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<style scoped lang="scss">
.content {
  margin: 0 auto;
  padding: 2rem;
  max-width: 800px;
  font-family: 'Inter';
  color: #2c3e50;

  h1 {
    font-size: 1.8rem;
    font-weight: 600;
    margin-bottom: 1.5rem;
    color: #1a1a1a;
  }

  .forms {
    display: flex;
    align-items: flex-end;
    gap: 1.2rem;
    margin-bottom: 2rem;
    flex-wrap: wrap;

    .form-field {
      display: flex;
      flex-direction: column;
      flex: 1;
      min-width: 150px;
    }

    label {
      font-size: 0.9rem;
      font-weight: 500;
      color: #555;
      text-align: left;
    }

    input {
      padding: 0.6rem 0.8rem;
      border: 1px solid #e0e0e0;
      border-radius: 6px;
      font-size: 0.95rem;
      transition: all 0.2s;

      &:focus {
        outline: none;
        border-color: #42b983;
        box-shadow: 0 0 0 2px rgba(66, 185, 131, 0.2);
      }
    }

    .btn-save {
      align-self: flex-end;
      padding: 0.65rem 1.2rem;
      background: #70b496;
      color: rgb(0, 0, 0);
      border: none;
      border-radius: 6px;
      font-weight: 500;
      cursor: pointer;
      transition: all 0.2s;
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);

      &:hover {
        background: #3aa876;
      }
    }
  }
  p {
    color: #888;
    text-align: center;
    padding: 1.5rem;
  }
  table {
    width: 100%;
    border-collapse: collapse;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);

    th,
    td {
      padding: 0.8rem 1rem;
      text-align: left;
      border-bottom: 1px solid #eee;
    }

    th {
      font-weight: 600;
      background: #f8f8f8;
      color: #555;
    }

    tr:hover td {
      background: #f9f9f9;
    }

    button {
      padding: 0.4rem 0.8rem;
      background: #f8f8f8;
      color: #ff4444;
      border: 1px solid #eee;
      border-radius: 4px;
      font-size: 0.85rem;
      cursor: pointer;
      transition: all 0.2s;

      &:hover {
        background: #ffebee;
      }
    }
  }
}
</style>
