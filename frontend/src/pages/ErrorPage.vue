<script setup lang="ts"></script>

<template>
  <div class="errorPage-container">
    <h2>Страница не существует</h2>
    <v-btn to="/" color="primary" size="large"> Вернуться на главную </v-btn>
  </div>
</template>

<style scoped>
.errorPage-container {
  margin: 0 auto;
  width: 300px;
  display: flex;
  flex-direction: column;
  gap: 20px;
}
</style>
