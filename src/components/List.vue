<script setup lang="ts">
import { ref } from 'vue';
import { usersService } from '../services/users-service';

const { users, isLoading, error, getUsers } = usersService();
const color = ref('black');
const isListVisible = ref(true);
const buttonText = ref('Скрыть список');
const isAgeVisible = ref<boolean[]>([]);

getUsers().then(() => {
  isAgeVisible.value = new Array(users.value.length).fill(false);
});

const openCloseList = () => {
  isListVisible.value = !isListVisible.value;
  buttonText.value = isListVisible.value ? 'Скрыть список' : 'Показать список';
};

const openCloseAge = (index: number) => {
  isAgeVisible.value[index] = !isAgeVisible.value[index];
};
</script>

<template>
  <div class="content">
    <h1>Список гостей:</h1>
    <div class="forms">
      <div class="form-field">
        <label class="form_label" for="color">Изменить цвет текста на:</label>
        <input id="color" v-model="color" type="text" placeholder="black" />
      </div>
    </div>
    <button @click="openCloseList">{{ buttonText }}</button>
    <div v-if="isLoading">Загрузка...</div>
    <div v-else-if="error">{{ error }}</div>
    <table v-else-if="isListVisible">
      <thead>
        <tr>
          <th>Имя</th>
          <th>Фамилия</th>
          <th>Возраст</th>
          <th>Придет</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(user, index) in users" :key="user.id">
          <td>{{ user.name }}</td>
          <td>{{ user.surname }}</td>
          <td
            :class="isAgeVisible[index] ? 'age-visible' : 'age-invisible'"
            @click="openCloseAge(index)"
          >
            {{ user.age }}
          </td>
          <td>
            <input class="coming-input" type="checkbox" :checked="user.isComing" />
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
  min-width: 400px;
  max-width: 800px;
  font-family: 'Inter';
  color: v-bind('color');
  display: flex;
  flex-direction: column;
  gap: 1rem;

  h1 {
    font-size: 1.8rem;
    font-weight: 600;
    margin-bottom: 1.5rem;
    color: #1a1a1a;
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

    .age-invisible {
      filter: blur(4px);
      transition: filter 0.8s ease-in-out;
      cursor: pointer;
    }
    .age-visible {
      filter: none;
      cursor: pointer;
    }

    th {
      font-weight: 600;
      background: #f8f8f8;
      color: #555;
    }

    tr:hover td {
      background: #f9f9f9;
    }

    .coming-input {
      pointer-events: none;
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
