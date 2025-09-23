<script setup lang="ts">
const emit = defineEmits<{
  (e: 'click', event: MouseEvent): void;
}>();
</script>

<template>
  <v-btn v-bind="$attrs" @click="emit('click', $event)">
    <slot>Кнопка</slot>
  </v-btn>
</template>

<style scoped></style>
