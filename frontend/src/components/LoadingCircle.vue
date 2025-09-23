<script setup lang="ts"></script>
<template>
  <v-container fill-height class="circle-container">
    <v-row align="center" justify="center">
      <v-col cols="12" class="text-center">
        <v-progress-circular indeterminate size="64"></v-progress-circular>
        <div class="mt-4">Загрузка...</div>
      </v-col>
    </v-row>
  </v-container>
</template>
<style scoped>
.circle-container {
  margin: auto 0;
}
</style>
