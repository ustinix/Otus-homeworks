<script setup lang="ts">
import { ref } from 'vue';

const newUser = ref({
  name: '',
  surname: '',
  age: 0,
  isComing: false,
});
</script>
<template>
  <div class="forms">
    <div class="form-field">
      <label for="name" class="form_label">Имя</label>
      <input id="name" v-model="newUser.name" type="text" name="name" placeholder="Петр" />
    </div>
    <div class="form-field">
      <label for="description" class="form_label">Фамилия</label>
      <input
        id="description"
        v-model="newUser.surname"
        type="text"
        name="description"
        placeholder="Петров"
      />
    </div>
    <div class="form-field">
      <label for="price" class="form_label">Возраст</label>
      <input id="price" v-model="newUser.age" type="number" name="price" min="0" step="1" />
    </div>
    <input type="checkbox" />
    <button class="btn-save">Добавить в список</button>
  </div>
</template>
<style scoped lang="scss">
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
</style>
