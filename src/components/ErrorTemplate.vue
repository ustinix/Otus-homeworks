<template>
  <v-container>
    <v-alert type="error" prominent>
      <v-row align="center">
        <v-col class="grow"> Ошибка загрузки: {{ error.message }} </v-col>
        <v-col class="shrink">
          <v-btn @click="event">Повторить</v-btn>
        </v-col>
      </v-row>
    </v-alert>
  </v-container>
</template>

<script setup lang="ts">
defineProps<{
  error: Error;
  event: () => void;
}>();
</script>

<style scoped></style>
